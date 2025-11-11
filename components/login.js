function lsLoad(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function lsSave(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

document.getElementById("login-form").addEventListener("submit", e => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const admins = lsLoad("admins");

  const user = admins.find(a => a.email === email && a.password === password);

  if (user) {
    // Guardar sesión activa
    localStorage.setItem("session", JSON.stringify({
      id: user.id,
      name: user.aName,
      email: user.email,
      role: "admin",
      loggedAt: new Date().toISOString()
    }));

    window.location.href = "../admin/dashboard.html";
  } else {
    document.getElementById("login-error").classList.remove("hidden");
  }
});
