document.addEventListener("DOMContentLoaded", () => {
    const session = JSON.parse(localStorage.getItem("session"));
    const navActions = document.querySelector(".nav-actions");
    const loginBtn = document.querySelector(".btn-login");

    if (navActions && loginBtn) {
        if (session) {
            const dashboardBtn = document.createElement("a");
            dashboardBtn.textContent = "Dashboard";
            dashboardBtn.href = window.location.pathname.includes("/pages/")
                ? "admin-panel.html"
                : "pages/admin-panel.html";
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
            loginBtn.href = window.location.pathname.includes("/pages/")
                ? "login.html"
                : "pages/login.html";
        }
    }

    const courseContainer = document.getElementById("courses-list");
    const storedCourses = JSON.parse(localStorage.getItem("courses")) || [];
    if (!courseContainer) return;
    if (!storedCourses.length) {
        courseContainer.innerHTML = `<p style="text-align:center;">No hay cursos disponibles actualmente.</p>`;
        return;
    }

    const prefix = window.location.pathname.includes("/pages/") ? "../" : "";

    courseContainer.innerHTML = storedCourses.map(course => {
        let imgSrc = "";
        if (course.img_url && course.img_url.startsWith("data:image")) {
            imgSrc = course.img_url;
        } else if (course.img_url && course.img_url.trim() !== "") {
            imgSrc = prefix + course.img_url;
        } else {
            const name = course.cName.toLowerCase();
            if (name.includes("álgebra")) imgSrc = prefix + "image/algebra.webp";
            else if (name.includes("programación")) imgSrc = prefix + "image/programming-course.webp";
            else if (name.includes("mecánica")) imgSrc = prefix + "image/classic-mechanics.webp";
            else if (name.includes("física")) imgSrc = prefix + "image/physics.webp";
            else if (name.includes("inglés")) imgSrc = prefix + "image/english.webp";
            else imgSrc = prefix + "image/default-course.webp";
        }

        const linkHref = window.location.pathname.includes("/pages/")
            ? `course.html?code=${course.code}`
            : `pages/course.html?code=${course.code}`;

        return `
            <div class="course-card">
                <div class="img-wrapper">
                    <div class="img-inner">
                        <div class="card-front">
                            <img src="${imgSrc}" alt="${course.cName}">
                        </div>
                        <div class="card-back">
                            <p style="color: var(--text-dark); font-family: Verdana, Tahoma, sans-serif;">
                                ${course.description || "Sin descripción disponible."}
                            </p>
                        </div>
                    </div>
                </div>
                <h3>${course.cName}</h3>
                <a href="${linkHref}" class="course-link">Ver detalles →</a>
            </div>
        `;
    }).join("");
});
