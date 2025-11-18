function lsLoad(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function lsSave(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function generarCodigo() {
    const students = lsLoad("students");
    if (students.length === 0) return "A001";
    const lastCode = students[students.length - 1].code;
    const num = parseInt(lastCode.slice(1)) + 1;
    return `T${String(num).padStart(3, "0")}`;
}

function render() {
    const cont = document.getElementById("students-list");
    const data = lsLoad("students");
    cont.innerHTML = data
        .map(
            (t) => `
            <div class="row" data-id="${t.id}">
                <span>${t.aName} ${t.aLastName} (${t.acode}) — ${t.idType || ""} ${t.aidNumber || ""} — ${t.agender || ""} — ${t.address|| ""} — ${t.phone || ""} 
                <strong>${(t.academic_area && t.academic_area.length > 0) ? t.academic_area.join(", ") : "Sin cursos asignados"}</strong></span>
                <button class="edit">Editar</button>
                <button class="delete">Eliminar</button>
            </div>`
        )
        .join("");
}

const form = document.getElementById("student-form");
const btnNew = document.getElementById("btn-new-teacher");
const nameInput = document.getElementById("aName");
const lastNameInput = document.getElementById("aLastName");
const idTypeSelect = document.getElementById("aidType");
const idNumberInput = document.getElementById("aidNumber");
const btnCancel = document.getElementById("btn-cancel");
const coursesContainer = document.getElementById("teacher-courses");
const btnAddCourse = document.getElementById("btn-add-course");

const previewImg = document.createElement("img");
previewImg.style.maxWidth = "100px";
previewImg.style.display = "block";
previewImg.style.marginTop = "10px";

idNumberInput.setAttribute("maxlength", "3");
idNumberInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 3);
});

function llenarCursosDisponibles() {
    const courses = lsLoad("courses");
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
    const students = lsLoad("students");
    const courses = lsLoad("courses");
    const editingId = form.dataset.editing;
    const aidType = idTypeSelect.value.trim();
    const aidNumber = idNumberInput.value.trim();
    const aName = nameInput.value.trim();
    const aLastName = lastNameInput.value.trim();
    const assignedCourses = [...document.querySelectorAll(".teacher-course")]
        .map((sel) => sel.value)
        .filter((v) => v);

    if (!aidType || !aidNumber || !aName || !aLastName) {
        alert("Completa todos los campos antes de guardar.");
        return;
    }

    const handleSave = (img_url) => {
        if (editingId && editingId !== "") {
            const student = students.find((t) => t.id == editingId);

            courses.forEach((c) => {
                if (student.academic_area?.includes(c.code)) {
                    c.student = "";
                }
            });

            assignedCourses.forEach((cCode) => {
                const curso = courses.find((c) => c.code === cCode);
                if (curso) curso.student = student.code;
            });

            student.aidType = aidType;
            student.aidNumber = aidNumber;
            student.aName = aName;
            student.aLastName = aLastName;
            student.agender = agender;
            student.address = address;
            student.phone = phone;
            student.academic_area = assignedCourses;
        } else {
            const code = generarCodigo();

            assignedCourses.forEach((cCode) => {
                const curso = courses.find((c) => c.code === cCode);
                if (curso) curso.student = code;
            });

            students.push({
                id: Date.now(),
                aidType,
                aidNumber,
                aName,
                aLastName,
                agender,
                address,
                phone,
                academic_area: assignedCourses,
                code,
            });
        }

        lsSave("students", students);
        render();
        form.classList.add("hidden");
        form.reset();
        previewImg.src = "";
        imgInput.value = "";
        coursesContainer.innerHTML = "";
        delete form.dataset.editing;
    };
});


function cargarCursosProfesor(student) {
    coursesContainer.innerHTML = "";
    const courses = lsLoad("courses");

    (student.academic_area || []).forEach((curso) => {
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

document.getElementById("students-list").addEventListener("click", (e) => {
    const row = e.target.closest(".row");
    if (!row) return;
    const id = Number(row.dataset.id);
    const teachers = lsLoad("students");
    const teacher = students.find((t) => String(t.id) === String(id));

    if (e.target.classList.contains("delete")) {
        if (student.aStatus !== "inactive") {
            alert("No puedes eliminar a un profesor activo. Desasigna sus cursos primero.");
            return;
        }
        if (confirm(`¿Eliminar a ${student.aName} ${student.aLastName}?`)) {
            const filtered = students.filter((t) => t.aid !== aid);
            const courses = lsLoad("courses");
            courses.forEach((c) => {
                if (c.student === student.code) c.student = "";
            });
            lsSave("students", filtered);
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
