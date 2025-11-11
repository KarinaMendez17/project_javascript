function lsLoad(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    console.error("Error parsing localStorage key", key, e);
    return [];
  }
}

function lsSave(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function lsInitIfEmpty(key, initialArray = []) {
  if (!localStorage.getItem(key)) {
    lsSave(key, initialArray);
  }
}

//Admin
lsInitIfEmpty("admins", [
  {
    id: "0001",
    aName: "Allied Mastercomputer",
    email: "AM@example.com",
    phone: "555-1234",
    password: "ergosum",
    role: "admin"
  }
]);

//Teachers
lsInitIfEmpty("teachers", [
  {
    code: "T001",
    id: "123",
    tName: "Ted",
    tLastName: "Anderson",
    tStatus: "active",
    img_url: "#",
    academic_area: [],
  }
]);

//Courses
lsInitIfEmpty("courses", [
  {
    code: "C001",
    cName: "Introducción a la Programación",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    teacher: "T001",
    modules: [
      {
        code: "M001",
        mName: "Módulo 1",
        description: "Introducción",
        lessons: [
          {
            lName: "Lección 1",
            hours: 2,
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            resources: []
          }
        ]
      }
    ]
  }
]);

