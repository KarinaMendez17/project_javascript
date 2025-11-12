function lsLoad(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function lsSave(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function generarCodigo() {
    const teachers = lsLoad("teachers");
    if (teachers.length === 0) return "T001";
    const lastCode = teachers[teachers.length - 1].code;
    const num = parseInt(lastCode.slice(1)) + 1;
    return `T${String(num).padStart(3, "0")}`;
}

function render() {
    const cont = document.getElementById("teachers-list");
    const data = lsLoad("teachers");
    cont.innerHTML = data
        .map(
            (t) => `
            <div class="row" data-id="${t.id}">
                <img src="${t.img_url || "default.png"}" alt="Foto" class="teacher-img">
                <span>${t.tName} ${t.tLastName} (${t.code}) — ${t.idType || ""} ${t.idNumber || ""} — 
                <em>${t.tStatus}</em> — 
                <strong>${(t.academic_area && t.academic_area.length > 0) ? t.academic_area.join(", ") : "Sin cursos asignados"}</strong></span>
                <button class="edit">Editar</button>
                <button class="delete">Eliminar</button>
            </div>`
        )
        .join("");
}

const form = document.getElementById("teacher-form");
const btnNew = document.getElementById("btn-new-teacher");
const nameInput = document.getElementById("tName");
const lastNameInput = document.getElementById("tLastName");
const idTypeSelect = document.getElementById("idType");
const idNumberInput = document.getElementById("idNumber");
const imgInput = document.getElementById("img_file");
const btnCancel = document.getElementById("btn-cancel");
const coursesContainer = document.getElementById("teacher-courses");
const btnAddCourse = document.getElementById("btn-add-course");

const previewImg = document.createElement("img");
previewImg.style.maxWidth = "100px";
previewImg.style.display = "block";
previewImg.style.marginTop = "10px";
imgInput.parentNode.insertBefore(previewImg, imgInput.nextSibling);

idNumberInput.setAttribute("maxlength", "3");
idNumberInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 3);
});

function llenarCursosDisponibles() {
    const courses = lsLoad("courses");
    const libres = courses.filter((c) => !c.teacher || c.teacher === "");
    if (!libres.length) return `<option value="">No hay cursos libres</option>`;
    return (
        `<option value="">Seleccione un curso...</option>` +
        libres.map((c) => `<option value="${c.code}">${c.cName}</option>`).join("")
    );
}

btnAddCourse.addEventListener("click", () => {
    const div = document.createElement("div");
    div.classList.add("course-entry");
    div.innerHTML = `
        <select class="teacher-course" required>
            ${llenarCursosDisponibles()}
        </select>
        <button type="button" class="btn-remove-course">Eliminar curso</button>
    `;
    coursesContainer.appendChild(div);
    div.querySelector(".btn-remove-course").addEventListener("click", () => div.remove());
});

imgInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        previewImg.src = "";
    }
});

btnNew.addEventListener("click", () => {
    if (!form.classList.contains("hidden")) {
        form.classList.add("hidden");
        form.reset();
        previewImg.src = "";
        imgInput.value = "";
        coursesContainer.innerHTML = "";
        delete form.dataset.editing;
        return;
    }
    form.classList.remove("hidden");
    form.dataset.editing = "";
    form.reset();
    previewImg.src = "";
    coursesContainer.innerHTML = "";
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const teachers = lsLoad("teachers");
    const courses = lsLoad("courses");
    const editingId = form.dataset.editing;
    const idType = idTypeSelect.value.trim();
    const idNumber = idNumberInput.value.trim();
    const tName = nameInput.value.trim();
    const tLastName = lastNameInput.value.trim();
    const assignedCourses = [...document.querySelectorAll(".teacher-course")]
        .map((sel) => sel.value)
        .filter((v) => v);
    const tStatus = assignedCourses.length > 0 ? "active" : "inactive";

    if (!idType || !idNumber || !tName || !tLastName) {
        alert("Completa todos los campos antes de guardar.");
        return;
    }

    const handleSave = (img_url) => {
        if (editingId && editingId !== "") {
            const teacher = teachers.find((t) => t.id == editingId);

            courses.forEach((c) => {
                if (teacher.academic_area?.includes(c.code)) {
                    c.teacher = "";
                }
            });

            assignedCourses.forEach((cCode) => {
                const curso = courses.find((c) => c.code === cCode);
                if (curso) curso.teacher = teacher.code;
            });

            teacher.idType = idType;
            teacher.idNumber = idNumber;
            teacher.tName = tName;
            teacher.tLastName = tLastName;
            teacher.img_url = img_url || teacher.img_url;
            teacher.academic_area = assignedCourses;
            teacher.tStatus = tStatus;
        } else {
            const code = generarCodigo();

            assignedCourses.forEach((cCode) => {
                const curso = courses.find((c) => c.code === cCode);
                if (curso) curso.teacher = code;
            });

            teachers.push({
                id: Date.now(),
                idType,
                idNumber,
                tName,
                tLastName,
                academic_area: assignedCourses,
                tStatus,
                code,
                img_url,
            });
        }

        teachers.forEach((t) => {
            const cursosAsignados = courses.filter((c) => c.teacher === t.code).map((c) => c.code);
            t.academic_area = cursosAsignados;
            t.tStatus = cursosAsignados.length > 0 ? "active" : "inactive";
        });

        lsSave("teachers", teachers);
        lsSave("courses", courses);
        render();
        form.classList.add("hidden");
        form.reset();
        previewImg.src = "";
        imgInput.value = "";
        coursesContainer.innerHTML = "";
        delete form.dataset.editing;
    };

    if (imgInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => handleSave(e.target.result);
        reader.readAsDataURL(imgInput.files[0]);
    } else {
        handleSave();
    }
});

function cargarCursosProfesor(teacher) {
    coursesContainer.innerHTML = "";
    const courses = lsLoad("courses");

    (teacher.academic_area || []).forEach((curso) => {
        const div = document.createElement("div");
        div.classList.add("course-entry");
        div.innerHTML = `
            <select class="teacher-course" required>
                ${llenarCursosDisponibles()}
            </select>
            <button type="button" class="btn-remove-course">Eliminar curso</button>
        `;
        const select = div.querySelector(".teacher-course");
        select.innerHTML += `<option value="${curso}">${curso}</option>`;
        select.value = curso;
        div.querySelector(".btn-remove-course").addEventListener("click", () => div.remove());
        coursesContainer.appendChild(div);
    });
}

document.getElementById("teachers-list").addEventListener("click", (e) => {
    const row = e.target.closest(".row");
    if (!row) return;
    const id = Number(row.dataset.id);
    const teachers = lsLoad("teachers");
    const teacher = teachers.find((t) => String(t.id) === String(id));

    if (e.target.classList.contains("delete")) {
        if (teacher.tStatus !== "inactive") {
            alert("No puedes eliminar a un profesor activo. Desasigna sus cursos primero.");
            return;
        }
        if (confirm(`¿Eliminar a ${teacher.tName} ${teacher.tLastName}?`)) {
            const filtered = teachers.filter((t) => t.id !== id);
            const courses = lsLoad("courses");
            courses.forEach((c) => {
                if (c.teacher === teacher.code) c.teacher = "";
            });
            lsSave("teachers", filtered);
            lsSave("courses", courses);
            render();
        }
        return;
    }

    if (e.target.classList.contains("edit")) {
        form.classList.remove("hidden");
        form.dataset.editing = id;
        idTypeSelect.value = teacher.idType || "";
        idNumberInput.value = teacher.idNumber || "";
        nameInput.value = teacher.tName;
        lastNameInput.value = teacher.tLastName;
        previewImg.src = teacher.img_url || "";
        cargarCursosProfesor(teacher);
    }
});

btnCancel.addEventListener("click", () => {
    form.classList.add("hidden");
    form.reset();
    previewImg.src = "";
    imgInput.value = "";
    coursesContainer.innerHTML = "";
    delete form.dataset.editing;
});

render();
