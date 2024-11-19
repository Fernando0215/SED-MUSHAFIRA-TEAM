document.addEventListener("DOMContentLoaded", async function () {
  const uploadInput = document.getElementById('upload-banner');
  const bannerImage = document.getElementById('banner-image');
  const uploadLabel = document.querySelector('.upload-label');

  const emprendimientoId = "673bc0da14756a6865c17cea"; // ID del emprendimiento

  try {
      const response = await fetch(`http://localhost:3000/emprendimientos/${emprendimientoId}`);
      if (!response.ok) {
          throw new Error('Emprendimiento no encontrado');
      }

      const emprendimiento = await response.json();
      if (emprendimiento.bannerImage) {
          bannerImage.src = `http://localhost:3000${emprendimiento.bannerImage}`;
          bannerImage.style.display = "block";
          uploadLabel.style.display = "none";
      }
  } catch (error) {
      console.error('Error al cargar el banner:', error);
  }

  uploadInput.addEventListener('change', async function (event) {
    const file = event.target.files[0];

    if (file) {
        const formData = new FormData();
        formData.append("bannerImage", file);

        try {
            const uploadResponse = await fetch("http://localhost:3000/emprendimientos/banner", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await uploadResponse.json();
            if (result.bannerImage) {
                bannerImage.src = `http://localhost:3000${result.bannerImage}`;
                bannerImage.style.display = "block";
                uploadLabel.style.display = "none";
            }
        } catch (error) {
            console.error("Error al actualizar el banner:", error);
        }
    }
});

});
