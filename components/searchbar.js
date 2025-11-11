const courses = JSON.parse(localStorage.getItem("courses")) || [];
const grid = document.querySelector(".course-grid");
const searchInput = document.getElementById("searchCourse");

function getCourseImage(name) {
  const n = name.toLowerCase();
  if (n.includes("álgebra")) return "image/algebra.webp";
  if (n.includes("programación")) return "image/programming-course.webp";
  if (n.includes("mecánica")) return "image/classic-mechanics.webp";
  if (n.includes("física")) return "image/physics.webp";
  if (n.includes("inglés")) return "image/english.webp";
  return "image/default-course.webp";
}

function renderCourses(filteredCourses) {
  grid.innerHTML = "";

  if (!filteredCourses.length) {
    grid.innerHTML = "<p>No se encontraron cursos.</p>";
    return;
  }

  filteredCourses.forEach(course => {
    const card = document.createElement("div");
    card.classList.add("course-card");
    card.innerHTML = `
      <div class="img-wrapper">
        <div class="img-inner">
          <div class="card-front">
            <img src="${course.img_url || getCourseImage(course.cName)}" alt="${course.cName}">
          </div>
          <div class="card-back">
            <p>${course.description}</p>
          </div>
        </div>
      </div>
      <h3>${course.cName}</h3>
      <a href="pages/course.html?code=${course.code}" class="course-link">Ir al curso →</a>
    `;
    grid.appendChild(card);
  });
}

renderCourses(courses);

searchInput.addEventListener("input", e => {
  const query = e.target.value.toLowerCase().trim();
  const filtered = courses.filter(c =>
    c.cName.toLowerCase().includes(query)
  );
  renderCourses(filtered);
});
