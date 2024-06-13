window.addEventListener("message", function(event) {
  console.log("Received message:", event.data);
  if (event.data === "downloadAndReset") {
    downloadAndReset();
  }
});

function downloadAndReset() {
  const photos = JSON.parse(localStorage.getItem("capturedPhotos")) || [];
  if (photos.length === 0) {
    alert("No photos to download.");
    return;
  }

  // Create a new ZIP object
  const zip = new JSZip();

  // Add each photo to the ZIP
  photos.forEach((photo, index) => {
    const dataURL = photo.dataURL;
    const frameKey = photo.frameKey;
    const frameColor = getFrameColor(frameKey);
    const fileName = `photo_${index + 1}_${frameColor}.png`;
    zip.file(fileName, dataURL.split('base64,')[1], { base64: true });
  });

  // Generate the ZIP file asynchronously
  zip.generateAsync({ type: "blob" }).then((content) => {
    // Save the ZIP file using FileSaver.js
    saveAs(content, "photos.zip");

    // Reset the local storage and UI after download
    localStorage.removeItem("capturedPhotos");
    displaySavedPhotos(); // Update the UI to reflect the reset state
  });
}

function displaySavedPhotos() {
  const photoContainer = document.getElementById("photoContainer");
  photoContainer.innerHTML = ""; // Clear previous content

  const photos = JSON.parse(localStorage.getItem("capturedPhotos")) || [];
  photos.forEach((photo) => {
    const img = document.createElement("img");
    img.src = photo.dataURL;

    const frameKey = photo.frameKey;
    const frameColor = getFrameColor(frameKey);
    console.log(`Applying frame color: ${frameColor}`);
    img.classList.add(`frame-${frameColor}`);

    // Add random rotation and random position
    const rotation = Math.random() * 30 - 15;
    const posX = Math.random() * (window.innerWidth - 150);
    const posY = Math.random() * (window.innerHeight - 200);
    img.style.transform = `rotate(${rotation}deg)`;
    img.style.position = "absolute";
    img.style.left = `${posX}px`;
    img.style.top = `${posY}px`;

    photoContainer.appendChild(img);
  });
}

function getFrameColor(frameKey) {
  switch (frameKey) {
    case '0':
      return 'white';
    case '1':
      return 'pink';
    case '2':
      return 'blue';
    case '3':
      return 'yellow';
    default:
      return 'white'; // Default frame color
  }
}

displaySavedPhotos();

window.onstorage = () => {
  displaySavedPhotos();
};
