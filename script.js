// Event listener for the download button
document.getElementById("download_button").addEventListener("click", function() {
  const password = prompt("Please enter the password to download photos:");
  if (password === "itimaija") { // Replace "itimaija" with the actual password
    const secondScreen = window.open("secondScreen.html", "_blank");
    setTimeout(() => {
      // Send a message to the second screen to initiate the download and reset
      console.log("Sending message to second screen");
      secondScreen.postMessage("downloadAndReset", "*");
    }, 1000);
    downloadAndReset();
  } else {
    alert("Incorrect password. Access denied.");
  }
});

// Function to handle download and reset
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

    // Reset the captured photos in localStorage
    localStorage.removeItem("capturedPhotos");

    // Trigger the 'storage' event to update other tabs if needed
    window.dispatchEvent(new Event('storage'));

    // Open the second screen and send a message immediately
    const secondScreen = window.open("secondScreen.html", "_blank");
    if (secondScreen) {
      console.log("Sending message to second screen");
      secondScreen.postMessage("downloadAndReset", "*");
    } else {
      alert("Failed to open second screen.");
    }
  });
}

// Get the button element
const homeButton = document.getElementById("home_button");

// Add click event listener
homeButton.addEventListener("click", function() {
  // Redirect to home.html
  window.location.href = "home.html";
});



const takePhotoBtn = document.getElementById("takePhotoBtn");
const countdownOverlay = document.getElementById("countdownOverlay");
const flashEffect = document.getElementById("flashEffect");

const MAX_PHOTOS = 50; // Maximum number of photos

// Accessing camera
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();
    document.getElementById("cameraView").appendChild(video);
  })
  .catch((error) => console.error("Error accessing camera:", error));

// Ensure only one event listener is added
takePhotoBtn.addEventListener("click", startCountdown);

document.body.onkeyup = function (e) {
  if (e.key === " " || e.code === "Space" || e.keyCode === 32) {
    startCountdown();
  }
};

function startCountdown() {
  // Prevent multiple countdowns
  if (!countdownOverlay.classList.contains("hidden")) return;

  let countdown = 3;
  countdownOverlay.classList.remove("hidden");
  countdownOverlay.textContent = countdown;
  countdownOverlay.style.opacity = 1; // Ensure the overlay is visible

  const countdownInterval = setInterval(() => {
    countdown -= 1;
    if (countdown > 0) {
      countdownOverlay.textContent = countdown;
    } else {
      clearInterval(countdownInterval);
      countdownOverlay.textContent = ''; // Clear the text
      countdownOverlay.style.opacity = 0; // Hide the overlay
      flashScreen();
      const photoDataURL = capturePhoto();
      savePhotoToLocalStorage(photoDataURL);
    }
  }, 1000);
}

function flashScreen() {
  flashEffect.classList.remove("hidden");
  flashEffect.style.opacity = 1;

  setTimeout(() => {
    flashEffect.style.opacity = 0;
    setTimeout(() => {
      flashEffect.classList.add("hidden");
      countdownOverlay.classList.add("hidden");
    }, 100);
  }, 100);
}

function capturePhoto() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const video = document.querySelector("video");

  canvas.width = 400; // Smaller width
  canvas.height = 240; // Smaller height
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL("image/png");
}

function savePhotoToLocalStorage(photoDataURL, cameraFrameColor) {
  let photos = JSON.parse(localStorage.getItem("capturedPhotos")) || [];
  const frameKey = getFrameKey(cameraFrameColor);
  photos.push({ dataURL: photoDataURL, frameKey: frameKey });
  localStorage.setItem("capturedPhotos", JSON.stringify(photos));
}

function getFrameKey(cameraFrameColor) {
  switch (cameraFrameColor) {
    case 'white':
      return '0';
    case 'pink':
      return '1';
    case 'blue':
      return '2';
    case 'yellow':
      return '3';
  }
}

function onReloadPage() {
  localStorage.removeItem("capturedPhotos");
}

const flashAudio = document.getElementById('flashAudio');

function flashScreen() {
  // Play the audio file 0.5 seconds before the flash effect
  flashAudio.play();

  setTimeout(() => {
    flashEffect.classList.remove("hidden");
    flashEffect.style.opacity = 1;
  }, 500); // Wait 0.5 seconds before showing the flash effect

  setTimeout(() => {
    flashEffect.style.opacity = 0;
    setTimeout(() => {
      flashEffect.classList.add("hidden");
      countdownOverlay.classList.add("hidden");
      flashAudio.pause(); // Pause the audio
      flashAudio.currentTime = 0; // Reset the audio time to 0
    }, 100);
  }, 600); // Wait 0.6 seconds (0.5 seconds + 0.1 seconds for the flash effect)
}

let cameraFrameColor = 'white';
let cameraImages = ['camera_white.png', 'camera_pink.png', 'camera_blue.png', 'camera_yellow.png'];
let currentImageIndex = 0;

function changeColor(direction) {
  const cameraImage = document.querySelector('.handheld_camera');
  currentImageIndex = (currentImageIndex + direction + cameraImages.length) % cameraImages.length;
  cameraImage.src = cameraImages[currentImageIndex];

  // Update cameraFrameColor based on current camera image index
  switch (currentImageIndex) {
    case 0:
      cameraFrameColor = 'white';
      break;
    case 1:
      cameraFrameColor = 'pink';
      break;
    case 2:
      cameraFrameColor = 'blue';
      break;
    case 3:
      cameraFrameColor = 'yellow';
      break;
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    changeColor(-1);
  } else if (e.key === 'ArrowRight') {
    changeColor(1);
  }
});

document.getElementById('next_color').addEventListener('click', () => {
  changeColor(1);
});

document.getElementById('before_color').addEventListener('click', () => {
  changeColor(-1);
});

document.getElementById("controls_secret").addEventListener("click", function() {
  window.open("controls.html");
});

document.addEventListener("keydown", function(event) {
  if (event.key === "c" || event.key === "C") {
    window.open("controls.html", "_blank");
  }
});

function savePhotoToLocalStorage(photoDataURL) {
  let photos = JSON.parse(localStorage.getItem("capturedPhotos")) || [];
  const frameKey = getFrameKey(cameraFrameColor);
  photos.push({ dataURL: photoDataURL, frameKey: frameKey });
  localStorage.setItem("capturedPhotos", JSON.stringify(photos));
}

function getFrameKey(cameraFrameColor) {
  switch (cameraFrameColor) {
    case 'white':
      return '0';
    case 'pink':
      return '1';
    case 'blue':
      return '2';
    case 'yellow':
      return '3';
  }
}
