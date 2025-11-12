function lsLoad(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function lsSave(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function generarCodigo() {
    const courses = lsLoad("courses");
    const num = courses.length
        ? Math.max(...courses.map(c => parseInt(c.code?.slice(1)) || 0)) + 1
        : 1;
    return `C${String(num).padStart(3, "0")}`;
}

function actualizarEstadoProfesor(teacherCode) {
    const teachers = lsLoad("teachers");
    const teacher = teachers.find(t => t.code === teacherCode);
    if (!teacher) return;
    const cursos = lsLoad("courses").filter(c => c.teacher === teacherCode);
    teacher.tStatus = cursos.length > 0 ? "active" : "inactive";
    teacher.academic_area = cursos.map(c => c.code);
    lsSave("teachers", teachers);
}

function renderCourses() {
    const cont = document.getElementById("courses-list");
    const data = lsLoad("courses");
    const prefix = window.location.pathname.includes("/pages/admin/")
        ? "../../"
        : window.location.pathname.includes("/pages/")
        ? "../"
        : "";

    cont.innerHTML = data.length
        ? data
              .map(c => {
                  let imgSrc = "";
                  if (c.img_url && c.img_url.startsWith("data:image")) {
                      imgSrc = c.img_url;
                  } else if (c.img_url && c.img_url.trim() !== "") {
                      imgSrc = prefix + c.img_url;
                  } else {
                      const name = c.cName.toLowerCase();
                      if (name.includes("álgebra")) imgSrc = prefix + "image/algebra.webp";
                      else if (name.includes("programación")) imgSrc = prefix + "image/programming-course.webp";
                      else if (name.includes("mecánica")) imgSrc = prefix + "image/classic-mechanics.webp";
                      else if (name.includes("física")) imgSrc = prefix + "image/physics.webp";
                      else if (name.includes("inglés")) imgSrc = prefix + "image/english.webp";
                      else imgSrc = prefix + "image/default-course.webp";
                  }

                  return `
            <div class="row" data-id="${c.code}">
                <img src="${imgSrc}" class="teacher-img">
                <span><strong>${c.cName}</strong> — ${c.teacher || "Sin profesor"}</span>
                <button class="edit">Editar</button>
                <button class="delete">Eliminar</button>
            </div>`;
              })
              .join("")
        : "<p>No hay cursos registrados.</p>";
}

const form = document.getElementById("course-form");
const btnNew = document.getElementById("btn-new-course");
const btnCancel = document.getElementById("btn-cancel");
const cNameInput = document.getElementById("cName");
const descInput = document.getElementById("description");
const teacherSelect = document.getElementById("teacher-select");
const modulesList = document.getElementById("modules-list");
const btnAddModule = document.getElementById("btn-add-module");
const imgInput = Object.assign(document.createElement("input"), { type: "file", accept: "image/*", id: "course_img" });
const previewImg = Object.assign(document.createElement("img"), { id: "preview_img", className: "teacher-img" });
previewImg.style.display = "block";
previewImg.style.margin = "1rem auto";
form.prepend(imgInput, previewImg);

function llenarProfesores() {
    const teachers = lsLoad("teachers");
    teacherSelect.innerHTML =
        `<option value="">(Opcional) Seleccione un Profesor</option>` +
        teachers.map(t => `<option value="${t.code}">${t.tName} ${t.tLastName}</option>`).join("");
}

imgInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return (previewImg.src = "");
    const reader = new FileReader();
    reader.onload = e => (previewImg.src = e.target.result);
    reader.readAsDataURL(file);
});

btnAddModule.addEventListener("click", () => {
    const mod = document.createElement("div");
    mod.className = "module-block";
    mod.innerHTML = `
        <h4>Módulo</h4>
        <input placeholder="Nombre del módulo" class="module-name" required>
        <textarea placeholder="Descripción del módulo" class="module-desc" required></textarea>
        <div class="lessons-container"></div>
        <button type="button" class="btn-add-lesson">+ Agregar lección</button>
        <button type="button" class="btn-remove-module">Eliminar módulo</button>
    `;
    modulesList.appendChild(mod);
    mod.querySelector(".btn-remove-module").onclick = () => mod.remove();
    mod.querySelector(".btn-add-lesson").onclick = () => addLesson(mod);
});

function addLesson(mod) {
    const l = document.createElement("div");
    l.className = "lesson-entry";
    l.innerHTML = `
        <input placeholder="Nombre de la lección" class="lesson-name" required>
        <input type="number" min="1" placeholder="Horas" class="lesson-hours" required>
        <textarea placeholder="Contenido" class="lesson-content" required></textarea>
        <button type="button" class="btn-remove-lesson">Eliminar lección</button>
    `;
    mod.querySelector(".lessons-container").appendChild(l);
    l.querySelector(".btn-remove-lesson").onclick = () => l.remove();
}

btnNew.onclick = () => {
    const visible = !form.classList.toggle("hidden");
    if (visible) {
        form.reset();
        modulesList.innerHTML = "";
        previewImg.src = "";
        llenarProfesores();
        delete form.dataset.editing;
    }
};

form.onsubmit = e => {
    e.preventDefault();
    const courses = lsLoad("courses");
    const teachers = lsLoad("teachers");
    const editing = form.dataset.editing;
    const cName = cNameInput.value.trim();
    const description = descInput.value.trim();
    const teacher = teacherSelect.value.trim() || null;
    if (!cName || !description) return alert("Completa el nombre y descripción.");

    const modules = [...modulesList.querySelectorAll(".module-block")].map((m, i) => ({
        code: `M${String(i + 1).padStart(3, "0")}`,
        mName: m.querySelector(".module-name").value.trim(),
        description: m.querySelector(".module-desc").value.trim(),
        lessons: [...m.querySelectorAll(".lesson-entry")].map(l => ({
            lName: l.querySelector(".lesson-name").value.trim(),
            hours: +l.querySelector(".lesson-hours").value,
            content: l.querySelector(".lesson-content").value.trim(),
            resources: []
        }))
    }));

    const saveCourse = img_url => {
        let prevTeacher = null;
        if (editing) {
            const c = courses.find(c => c.code === editing);
            prevTeacher = c.teacher;
            Object.assign(c, { cName, description, teacher, modules, img_url });
        } else {
            courses.push({ code: generarCodigo(), cName, description, teacher, modules, img_url });
        }

        // 🔁 Sincroniza profesores
        teachers.forEach(t => {
            const cursosAsignados = courses.filter(c => c.teacher === t.code).map(c => c.code);
            t.academic_area = cursosAsignados;
            t.tStatus = cursosAsignados.length > 0 ? "active" : "inactive";
        });

        lsSave("courses", courses);
        lsSave("teachers", teachers);
        renderCourses();
        form.classList.add("hidden");
        form.reset();
        modulesList.innerHTML = "";
        previewImg.src = "";
        delete form.dataset.editing;
    };

    if (imgInput.files[0]) {
        const reader = new FileReader();
        reader.onload = e => saveCourse(e.target.result);
        reader.readAsDataURL(imgInput.files[0]);
    } else saveCourse(previewImg.src || "");
};

document.getElementById("courses-list").onclick = e => {
    const row = e.target.closest(".row");
    if (!row) return;
    const code = row.dataset.id;
    const courses = lsLoad("courses");
    const teachers = lsLoad("teachers");
    const course = courses.find(c => c.code === code);

    if (e.target.classList.contains("delete")) {
        if (confirm(`¿Eliminar el curso "${course.cName}"?`)) {
            const updatedCourses = courses.filter(c => c.code !== code);
            const teacher = teachers.find(t => t.code === course.teacher);
            if (teacher) {
                teacher.academic_area = teacher.academic_area.filter(c => c !== code);
                teacher.tStatus = teacher.academic_area.length ? "active" : "inactive";
            }
            lsSave("courses", updatedCourses);
            lsSave("teachers", teachers);
            renderCourses();
        }
        return;
    }

    if (e.target.classList.contains("edit")) {
        form.classList.remove("hidden");
        form.dataset.editing = code;
        llenarProfesores();
        cNameInput.value = course.cName;
        descInput.value = course.description;
        teacherSelect.value = course.teacher || "";
        previewImg.src = course.img_url || "";
        modulesList.innerHTML = "";
        course.modules.forEach(mod => {
            const mDiv = document.createElement("div");
            mDiv.className = "module-block";
            mDiv.innerHTML = `
                <h4>Módulo</h4>
                <input value="${mod.mName}" class="module-name">
                <textarea class="module-desc">${mod.description}</textarea>
                <div class="lessons-container"></div>
                <button type="button" class="btn-add-lesson">+ Agregar lección</button>
                <button type="button" class="btn-remove-module">Eliminar módulo</button>
            `;
            modulesList.appendChild(mDiv);
            mDiv.querySelector(".btn-remove-module").onclick = () => mDiv.remove();
            mDiv.querySelector(".btn-add-lesson").onclick = () => addLesson(mDiv);
            mod.lessons.forEach(l => {
                const lDiv = document.createElement("div");
                lDiv.className = "lesson-entry";
                lDiv.innerHTML = `
                    <input value="${l.lName}" class="lesson-name">
                    <input type="number" value="${l.hours}" class="lesson-hours">
                    <textarea class="lesson-content">${l.content}</textarea>
                    <button type="button" class="btn-remove-lesson">Eliminar lección</button>`;
                mDiv.querySelector(".lessons-container").appendChild(lDiv);
                lDiv.querySelector(".btn-remove-lesson").onclick = () => lDiv.remove();
            });
        });
    }
};

btnCancel.onclick = () => {
    form.classList.add("hidden");
    form.reset();
    modulesList.innerHTML = "";
    previewImg.src = "";
    delete form.dataset.editing;
};

renderCourses();
