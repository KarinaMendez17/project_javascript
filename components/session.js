const session = JSON.parse(localStorage.getItem("session"));
const navActions = document.querySelector(".nav-actions");
const loginBtn = document.querySelector(".btn-login");

if (!session) {
    window.location.href = "../login.html";
} else {
    const dashboardBtn = document.createElement("a");
    dashboardBtn.textContent = "Dashboard";
    dashboardBtn.href = "../admin-panel.html";
    dashboardBtn.classList.add("btn-dashboard");
    dashboardBtn.style.marginRight = "1rem";

    loginBtn.textContent = "Cerrar sesión";
    loginBtn.href = "#";
    loginBtn.addEventListener("click", e => {
        e.preventDefault();
        localStorage.removeItem("session");
        window.location.href = "../login.html";
    });

    navActions.prepend(dashboardBtn);
}

function actualizarFechaHora() {
    const ahora = new Date();
    const formato = ahora.toLocaleString();
    document.getElementById("datetime").textContent = formato;
}

setInterval(actualizarFechaHora, 1000);
actualizarFechaHora();