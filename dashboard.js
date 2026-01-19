let currentUser = null;
let tasks = [];

/* =========================
   INITIAL LOAD
========================= */
document.addEventListener("DOMContentLoaded", () => {
    currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        alert("Unauthorized access. Please login.");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("name").textContent = "Welcome, " + currentUser.name;
    document.getElementById("email").textContent = currentUser.email;
    document.getElementById("user").textContent = "Welcome, " + currentUser.name;

    tasks = JSON.parse(localStorage.getItem("task")) || [];
    normalizeTasks();

    document.getElementById("default").click();
    refreshUI();
});

/* =========================
   UTILITIES
========================= */
function normalizeTasks() {
    tasks = tasks.map(t => ({
        ...t,
        status: t.status || "pending"
    }));
    localStorage.setItem("task", JSON.stringify(tasks));
}

function saveAndRefresh(mode = "view") {
    localStorage.setItem("task", JSON.stringify(tasks));
    loadUserTasks(mode);
    taskcount();
}

/* =========================
   LOGOUT
========================= */
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

/* =========================
   CREATE TASK
========================= */
function create() {
    const title = document.getElementById("title").value.trim();
    const desc = document.getElementById("desc").value.trim();

    if (!title || !desc) {
        alert("All fields are required!");
        return;
    }

    tasks.push({
        id: Date.now(),
        title,
        description: desc,
        userId: currentUser.id,
        status: "pending"
    });

    document.getElementById("title").value = "";
    document.getElementById("desc").value = "";

    saveAndRefresh("manage");
}

/* =========================
   LOAD TASKS
========================= */
function loadUserTasks(mode = "view") {
    const userTasks = tasks.filter(t => t.userId === currentUser.id);
    render(userTasks, mode);
}

/* =========================
   RENDER TASKS
========================= */
function render(taskList, mode) {
    const container =
        mode === "manage"
            ? document.getElementById("manageTasklist")
            : document.getElementById("viewTasklist");

    container.innerHTML = "";

    if (taskList.length === 0) {
        container.innerHTML = "<p>No tasks added yet.</p>";
        return;
    }

    taskList.forEach(t => {
        const div = document.createElement("div");
        div.className = "task-card";

        div.innerHTML = `
            <h4>Title: ${t.title}</h4>
            <p>Description: ${t.description}</p>

            ${mode === "view" ? `
                <p>Status: <b>${t.status}</b></p>
                ${t.status === "pending"
                    ? `<label><input type="checkbox" onchange="markcomplete(${t.id})"> Mark Completed</label>`
                    : `<label style="color:green"><input type="checkbox" checked disabled> Completed</label>`
                }
            ` : ""}

            ${mode === "manage" ? `
                <div class="task-action">
                    <button onclick="Edittask(${t.id})" ${t.status === "completed" ? "disabled style='opacity:0.5'" : ""}>Edit</button>
                    <button onclick="Deletetask(${t.id})">Delete</button>
                </div>
            ` : ""}
        `;
        container.appendChild(div);
    });
}

/* =========================
   COMPLETE TASK
========================= */
function markcomplete(taskid) {
    tasks = tasks.map(t =>
        t.id === taskid ? { ...t, status: "completed" } : t
    );
    saveAndRefresh();
}

/* =========================
   EDIT TASK
========================= */
function Edittask(taskid) {
    const task = tasks.find(t => t.id === taskid);
    if (!task || task.status === "completed") {
        alert("Completed task cannot be edited.");
        return;
    }

    const newTitle = prompt("Edit title", task.title);
    const newDesc = prompt("Edit description", task.description);

    if (!newTitle || !newDesc) return;

    tasks = tasks.map(t =>
        t.id === taskid
            ? { ...t, title: newTitle, description: newDesc }
            : t
    );

    saveAndRefresh("manage");
}

/* =========================
   DELETE TASK
========================= */
function Deletetask(taskid) {
    if (!confirm("Delete this task?")) return;

    tasks = tasks.filter(t => t.id !== taskid);
    saveAndRefresh("manage");
}

/* =========================
   CLEAR ALL TASKS
========================= */
function Cleartask() {
    if (!confirm("Clear all your tasks?")) return;

    tasks = tasks.filter(t => t.userId !== currentUser.id);
    saveAndRefresh("manage");
}

/* =========================
   SEARCH & FILTER
========================= */
function searchandfilter() {
    const keyword = document.getElementById("search").value.toLowerCase();
    const status = document.getElementById("statusfilter").value;

    let filtered = tasks.filter(t => t.userId === currentUser.id);

    if (status !== "all") {
        filtered = filtered.filter(t => t.status === status);
    }

    if (keyword) {
        filtered = filtered.filter(t =>
            t.title.toLowerCase().includes(keyword)
        );
    }

    render(filtered, "view");
}

/* =========================
   TAB SYSTEM
========================= */
function opentab(event, tabname) {
    document.querySelectorAll(".tabcontent").forEach(t => t.style.display = "none");
    document.querySelectorAll(".tablinks").forEach(b => b.classList.remove("active"));

    document.getElementById(tabname).style.display = "block";
    event.currentTarget.classList.add("active");

    loadUserTasks(tabname === "manage" ? "manage" : "view");
}

/* =========================
   TASK COUNTS
========================= */
function taskcount() {
    const userTasks = tasks.filter(t => t.userId === currentUser.id);

    document.getElementById("Totaltasks").textContent = userTasks.length;
    document.getElementById("progress").textContent =
        userTasks.filter(t => t.status === "pending").length;
    document.getElementById("complete").textContent =
        userTasks.filter(t => t.status === "completed").length;
}

/* =========================
   FULL UI REFRESH
========================= */
function refreshUI() {
    loadUserTasks();
    taskcount();
}
/* =========================
   DARK / LIGHT MODE
========================= */
function toggleTheme() {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.getElementById("themeIcon");
    if (!icon) return;

    if (document.body.classList.contains("dark")) {
        icon.className = "fa-solid fa-sun";
    } else {
        icon.className = "fa-solid fa-moon";
    }
}

/* Load saved theme */
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }
    updateThemeIcon();
});
