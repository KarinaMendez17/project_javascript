document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const courseCode = params.get("code");
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    const teachers = JSON.parse(localStorage.getItem("teachers")) || [];
    const course = courses.find(c => c.code === courseCode);
    const container = document.getElementById("course-container");

    if (!course) {
        container.innerHTML = `<h2 style="text-align:center;margin-top:3rem;">Curso no encontrado</h2>`;
        return;
    }

    const teacher = teachers.find(t => t.code === course.teacher);
    const teacherName = teacher ? `${teacher.tName} ${teacher.tLastName}` : "Sin profesor asignado";

    const prefix = window.location.pathname.includes("/pages/") ? "../" : "";
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

    const header = container.querySelector(".course-header");
    const imgEl = header.querySelector(".course-img");
    const titleEl = header.querySelector("h2");
    const descEl = header.querySelector("p");
    const teacherEl = header.querySelector("#teacher-name");

    imgEl.src = imgSrc;
    titleEl.textContent = course.cName;
    descEl.textContent = course.description;
    teacherEl.textContent = teacherName;

    const modulesSection = container.querySelector(".modules");
    if (course.modules && course.modules.length > 0) {
        modulesSection.innerHTML = `
            <h3>Módulos</h3>
            ${course.modules
                .map(
                    (m, i) => `
                <div class="module">
                    <div class="module-header" data-index="${i}">
                        ${m.mName} <span>+</span>
                    </div>
                    <div class="module-content">
                        <p>${m.description || "Sin descripción"}</p>
                        ${
                            m.lessons && m.lessons.length > 0
                                ? m.lessons
                                      .map(
                                          (l, j) => `
                            <div class="lesson">
                                <div class="lesson-header" data-mod="${i}" data-les="${j}">
                                    ${l.lName || "Lección sin nombre"} <span>▶</span>
                                </div>
                                <div class="lesson-content">
                                    <p>${
                                        l.content
                                            ? l.content.substring(0, 100) + "..."
                                            : "Sin contenido"
                                    }</p>
                                    <button data-mod="${i}" data-les="${j}" class="open-lesson">Ver contenido</button>
                                </div>
                            </div>`
                                      )
                                      .join("")
                                : "<p>No hay lecciones en este módulo.</p>"
                        }
                    </div>
                </div>`
                )
                .join("")}
        `;
    } else {
        modulesSection.innerHTML = "<p>No hay módulos registrados.</p>";
    }

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <div class="modal-text">
                <h3></h3>
                <p></p>
            </div>
            <div class="modal-video">
                <iframe src="" allowfullscreen></iframe>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const modalTitle = modal.querySelector("h3");
    const modalText = modal.querySelector("p");
    const modalVideo = modal.querySelector("iframe");
    const closeModal = modal.querySelector(".modal-close");

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
        modalVideo.src = "";
    });

    window.addEventListener("click", e => {
        if (e.target === modal) {
            modal.style.display = "none";
            modalVideo.src = "";
        }
    });

    document.querySelectorAll(".module-header").forEach(header => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling;
            const expanded = content.style.display === "block";
            document.querySelectorAll(".module-content").forEach(c => (c.style.display = "none"));
            document.querySelectorAll(".module-header span").forEach(s => (s.textContent = "+"));
            content.style.display = expanded ? "none" : "block";
            header.querySelector("span").textContent = expanded ? "+" : "-";
        });
    });

    document.querySelectorAll(".lesson-header").forEach(header => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling;
            const expanded = content.style.display === "block";
            content.style.display = expanded ? "none" : "block";
            header.querySelector("span").textContent = expanded ? "▶" : "▼";
        });
    });

    document.querySelectorAll(".open-lesson").forEach(btn => {
        btn.addEventListener("click", e => {
            const modIndex = e.target.dataset.mod;
            const lesIndex = e.target.dataset.les;
            const lesson = course.modules[modIndex].lessons[lesIndex];
            modalTitle.textContent = lesson.lName || "Lección sin nombre";
            modalText.textContent = lesson.content || "Sin contenido disponible.";
            modalVideo.src = "https://www.youtube.com/embed/AnLuKx_c7Ds";
            modal.style.display = "flex";
        });
    });
});
