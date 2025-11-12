# 📘 Mock LMS - Educational Management System  
**Built with:** HTML, CSS, and JavaScript (LocalStorage)

## 📚 Description  
This project is a **Learning Management System (LMS)** for *Institución Educativa ABC*.  
It allows full **management of teachers, courses, modules, and lessons**, as well as a public interface where users can browse available courses.  

The system includes basic authentication for administrators and data persistence using `localStorage`.

---

## 🧩 Main Features  

### 🔐 Authentication  
- Login with **email and password** for administrators.  
- Session persistence in `localStorage`.  
- Logout available from any page.  

### 👨‍🏫 Teacher Management  
- Full CRUD (Create, Read, Update, Delete).  
- Each teacher can have a **photo**, personal data, and **assigned courses**.  
- Active teachers cannot be deleted.  

### 📘 Course Management  
- Full CRUD for courses including:  
  - Custom or default images.  
  - Description and teacher assignment.  
  - Modules and lessons with detailed content.  
- Images are stored in **Base64 format**.  

### 🧮 Modules & Lessons  
- Each course may contain multiple modules, and each module can have several lessons.  
- Supports **text content, duration (hours), and learning materials**.  

### 🧑‍💼 Admin Management  
- Full CRUD for administrative staff (ID, name, email, phone, and role).  
- Access control via login.  

### 🏠 Public Page  
- Browse available courses.  
- Course details include description, teacher info, and modules.  

---

## 🗂️ Project Structure  

```bash
JS_PROJECT/
│
├── components/            
│   ├── admins.js
│   ├── course.js
│   ├── courses-list.js
│   ├── courses.js
│   ├── init.js        
│   ├── login.js
│   ├── searchbar.js
│   └── teachers.js
│
├── css/                   
│   ├── adminmenu.css
│   ├── course.css
│   ├── courses.css
│   ├── home.css
│   ├── login.css
│   ├── styles.css
│   └── submenu.css
│
├── image/                
│   ├── algebra.webp
│   ├── classic-mechanics.webp
│   ├── physics.webp
│   ├── programming-course.webp
│   ├── english.webp
│   ├── ...
│
├── modules/                
│   └── local-storage.js  
│
├── pages/      
│   ├── courses.html   
│   ├── course.html     
│   ├── login.html    
│   └── admin/        
│       ├── admin-panel.html
│       ├── coursesmenu.html
│       ├── teachersmenu.html
│       └── adminsmenu.html
│
├── index.html
└── README.md
```
---

## ⚙️ Technologies Used

- 🧱 HTML5 — semantic structure.
- 🎨 CSS3 — responsive design with UX/UI focus.
- ⚡ JavaScript — core logic, DOM manipulation, and local persistence.
- 💾 LocalStorage — browser-based data storage.
- 🖼️ Base64 — image handling without a backend.

---

## 🚀 How to Run the Project

🔁 **Option 1: Clone the Repository**

1. Clone the repository using the following command:
   ```bash
   git clone https://github.com/KarinaMendez17/project_javascript

2. Open the project on a local server: 
    - Use **Live Server** in VS Code.
    - Open the `index.html` file directly in your browser.


🌍 **Option 2: View Online (No Installation Required)**

You can explore the live LMS version here:
👉 https://institutoabc-dkmd.netlify.app/

The site is hosted on Netlify, so it doesn’t require local setup or dependencies.
Simply open the link and start exploring the system. 🚀

---

## 🔐 Admin Panel Access
**Email:** `AM@example.com`  
**Password:** `ergosum`

---

## 🧭 Navigation Guide
- `/index.html` → 🏠 **Public Course Catalog**  
- `/pages/login.html` → 🔑 **Admin Login**  
- `/pages/admin/admin-panel.html` → 🧩 **LMS Dashboard**

---

## 🧠 Important Notes
- All data is stored **locally in the browser** via `localStorage`.  
- If you switch browsers or clear cache, **data will be deleted**.  
- No internet connection or backend server required.

---

## 🌐 Credits 
Developed by **Karina Méndez 💀**  
📎 [GitHub - KarinaMendez17](https://github.com/KarinaMendez17/)
