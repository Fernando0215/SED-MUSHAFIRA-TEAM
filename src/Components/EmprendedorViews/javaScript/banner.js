
document.addEventListener("DOMContentLoaded", function() {
    const uploadInput = document.getElementById('upload-banner');
    const bannerImage = document.getElementById('banner-image');
    const uploadLabel = document.querySelector('.upload-label');
  
    uploadInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
  
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          bannerImage.src = e.target.result;
          bannerImage.style.display = 'block';
          uploadLabel.style.display = 'none'; // Oculta el botón después de cargar la imagen
        };
        reader.readAsDataURL(file);
      }
    });
});

document.getElementById("banner-image").addEventListener("click", function () {
  document.getElementById("upload-banner").click();  // Simula el click en el input
});