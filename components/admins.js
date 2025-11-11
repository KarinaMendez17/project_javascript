function lsLoad(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function lsSave(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function renderAdmins() {
  const cont = document.getElementById("admins-list");
  const data = lsLoad("admins");

  if (!data.length) {
    cont.innerHTML = "<p>No hay administradores registrados.</p>";
    return;
  }

  cont.innerHTML = data
    .map(
      (a) => `
      <div class="row" data-id="${a.id}">
        <span><strong>${a.aName}</strong> — ${a.role}</span>
        <button class="edit">Editar</button>
        <button class="delete">Eliminar</button>
      </div>`
    )
    .join("");
}

const form = document.getElementById("admin-form");
const btnNew = document.getElementById("btn-new-admin");
const nameInput = document.getElementById("aName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const btnCancel = document.getElementById("btn-cancel");
const togglePassword = document.getElementById("toggle-password");

// Toggle de contraseña funcional
togglePassword.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  togglePassword.textContent = isHidden ? "ocultar" : "ver";
});

btnNew.addEventListener("click", () => {
  if (!form.classList.contains("hidden")) {
    form.classList.add("hidden");
    form.reset();
    delete form.dataset.editing;
    return;
  }
  form.classList.remove("hidden");
  form.dataset.editing = "";
  form.reset();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const admins = lsLoad("admins");
  const editingId = form.dataset.editing;

  const aName = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const password = passwordInput.value.trim();
  const role = "admin";

  if (!aName || !email || !phone || !password) {
    alert("Completa todos los campos antes de guardar.");
    return;
  }

  if (editingId && editingId !== "") {
    const admin = admins.find((a) => a.id == editingId);
    admin.aName = aName || admin.aName;
    admin.email = email || admin.email;
    admin.phone = phone || admin.phone;
    admin.password = password || admin.password;
  } else {
    const newId = `A${String(Date.now()).slice(-4)}`;
    admins.push({
      id: newId,
      aName,
      email,
      phone,
      password,
      role,
    });
  }

  lsSave("admins", admins);
  renderAdmins();
  form.classList.add("hidden");
  form.reset();
  delete form.dataset.editing;
});

document.getElementById("admins-list").addEventListener("click", (e) => {
  const row = e.target.closest(".row");
  if (!row) return;
  const id = row.dataset.id;
  const admins = lsLoad("admins");
  const admin = admins.find((a) => a.id === id);

  if (e.target.classList.contains("delete")) {
    if (confirm(`¿Eliminar al administrador ${admin.aName}?`)) {
      const filtered = admins.filter((a) => a.id !== id);
      lsSave("admins", filtered);
      renderAdmins();
    }
    return;
  }

  if (e.target.classList.contains("edit")) {
    form.classList.remove("hidden");
    form.dataset.editing = id;
    nameInput.value = admin.aName;
    emailInput.value = admin.email;
    phoneInput.value = admin.phone;
    passwordInput.value = admin.password;
    passwordInput.type = "password";
    togglePassword.textContent = "ver";
  }
});

btnCancel.addEventListener("click", () => {
  form.classList.add("hidden");
  form.reset();
  delete form.dataset.editing;
});

renderAdmins();
