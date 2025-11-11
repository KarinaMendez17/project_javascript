document.addEventListener("DOMContentLoaded", () => {
    const session = JSON.parse(localStorage.getItem("session"));
    const navActions = document.querySelector(".nav-actions");
    const loginBtn = document.querySelector(".btn-login");

    if (session) {
        const dashboardBtn = document.createElement("a");
        dashboardBtn.textContent = "Dashboard";
        dashboardBtn.href = "admin-panel.html";
        dashboardBtn.classList.add("btn-dashboard");
        dashboardBtn.style.marginRight = "1rem";
        navActions.prepend(dashboardBtn);

        loginBtn.textContent = "Cerrar sesión";
        loginBtn.href = "#";
        loginBtn.addEventListener("click", e => {
            e.preventDefault();
            localStorage.removeItem("session");
            window.location.reload();
        });
    } else {
        loginBtn.textContent = "Iniciar sesión";
        loginBtn.href = "login.html";
    }

    const coursesList = document.getElementById("courses-list");
    const courses = JSON.parse(localStorage.getItem("courses")) || [];

    if (!courses.length) {
        coursesList.innerHTML = `<p style="text-align:center;">No hay cursos disponibles actualmente.</p>`;
        return;
    }

    coursesList.innerHTML = courses.map(course => `
        <div class="course-card">
            <div class="img-wrapper">
                <div class="img-inner">
                    <div class="card-front">
                        <img src="${course.img_url || '../image/default-course.webp'}" alt="${course.cName}">
                    </div>
                    <div class="card-back">
                        <p style="color: var(--text-dark);">${course.description || "Sin descripción disponible."}</p>
                    </div>
                </div>
            </div>
            <h3>${course.cName}</h3>
            <a href="course.html?code=${course.code}" class="course-link">Ver detalles →</a>
        </div>
    `).join("");
});
