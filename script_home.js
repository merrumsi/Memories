function animateTransition(event) {
  event.preventDefault(); // Prevent default link behavior
  document.body.classList.add('dissolve-out'); // Apply dissolve-out animation class
  document.querySelector('.button_container').classList.add('animate'); // Add animation class to button container
  setTimeout(() => {
    window.location.href = 'main.html'; // Navigate to the next page after the animation completes
  }, 2000); // Adjust timing as needed
  setTimeout(() => {
    document.querySelector('.button_container').classList.remove('animate'); // Remove animation class after 500ms
  }, 500);
}