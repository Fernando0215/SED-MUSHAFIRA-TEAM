// Obtener elementos del DOM
const editBtn = document.getElementById("edit-profile-btn");
const modal = document.getElementById("editModal");
const closeModal = document.getElementById("closeModal");
const form = document.getElementById("editProfileForm");

// Elementos de perfil
const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");
const usernameSidebar = document.getElementById("username-sidebar");

// Abrir modal
editBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// Cerrar modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Cerrar modal al hacer clic fuera de él
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Guardar cambios del formulario
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Evitar recarga de la página

  // Obtener valores de los inputs
  const newName = document.getElementById("editName").value;
  const newEmail = document.getElementById("editEmail").value;

  // Actualizar los elementos en la página
  profileName.textContent = newName;
  profileEmail.textContent = `Email: ${newEmail}`;
  usernameSidebar.textContent = newName;

  // Cerrar el modal
  modal.style.display = "none";
});
