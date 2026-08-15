// ==========================================
// GET ELEMENTS
// ==========================================

const taskInput =
    document.getElementById("taskInput");

const addBtn =
    document.getElementById("addBtn");

const taskList =
    document.getElementById("taskList");

const searchInput =
    document.getElementById("searchInput");

const totalTasks =
    document.getElementById("totalTasks");

const completedTasks =
    document.getElementById("completedTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const clearCompletedBtn =
    document.getElementById("clearCompleted");

const deleteAllBtn =
    document.getElementById("deleteAll");

const emptyMessage =
    document.getElementById("emptyMessage");

const darkModeBtn =
    document.getElementById("darkModeBtn");


// ==========================================
// TASK OPTIONS
// ==========================================

const prioritySelect =
    document.getElementById("prioritySelect");

const categorySelect =
    document.getElementById("categorySelect");

const dueDateInput =
    document.getElementById("dueDateInput");


// ==========================================
// EDIT MODAL
// ==========================================

const editTaskModalElement =
    document.getElementById(
        "editTaskModal"
    );

const editTaskModal =
    new bootstrap.Modal(
        editTaskModalElement
    );

const editTaskInput =
    document.getElementById(
        "editTaskInput"
    );

const editPrioritySelect =
    document.getElementById(
        "editPrioritySelect"
    );

const editCategorySelect =
    document.getElementById(
        "editCategorySelect"
    );

const editDueDateInput =
    document.getElementById(
        "editDueDateInput"
    );

const saveEditBtn =
    document.getElementById(
        "saveEditBtn"
    );


// ==========================================
// DASHBOARD
// ==========================================

const completionPercentage =
    document.getElementById(
        "completionPercentage"
    );

const progressBar =
    document.getElementById(
        "progressBar"
    );

const motivationMessage =
    document.getElementById(
        "motivationMessage"
    );

const highPriorityCount =
    document.getElementById(
        "highPriorityCount"
    );

const mediumPriorityCount =
    document.getElementById(
        "mediumPriorityCount"
    );

const lowPriorityCount =
    document.getElementById(
        "lowPriorityCount"
    );

const streakCount =
    document.getElementById(
        "streakCount"
    );


// ==========================================
// VARIABLES
// ==========================================

let tasks =
    JSON.parse(
        localStorage.getItem("tasks")
    ) || [];


let currentFilter =
    "all";


let taskBeingEdited =
    null;


let taskChart =
    null;


// ==========================================
// MAKE OLD TASKS COMPATIBLE
// ==========================================

tasks =
    tasks.map(function(task) {

        return {

            id:
                task.id,

            text:
                task.text,

            completed:
                task.completed || false,

            priority:
                task.priority || "medium",

            category:
                task.category || "study",

            dueDate:
                task.dueDate || ""

        };

    });


saveTasks();


// ==========================================
// SAVE TASKS
// ==========================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ==========================================
// SHOW TOAST
// ==========================================

function showToast(
    message,
    type = "success"
) {

    const toastContainer =
        document.getElementById(
            "toastContainer"
        );


    let icon =
        "bi-check-circle-fill";


    if (type === "error") {

        icon =
            "bi-x-circle-fill";

    }


    if (type === "warning") {

        icon =
            "bi-exclamation-triangle-fill";

    }


    if (type === "info") {

        icon =
            "bi-info-circle-fill";

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `toast custom-toast toast-${type}`;


    toast.setAttribute(
        "role",
        "alert"
    );


    toast.innerHTML = `

        <div class="d-flex align-items-center p-3">

            <i
                class="bi ${icon} fs-5 me-3"
            ></i>

            <div class="flex-grow-1">

                ${message}

            </div>

            <button
                type="button"
                class="btn-close btn-close-white ms-3"
                data-bs-dismiss="toast"
            ></button>

        </div>

    `;


    toastContainer.appendChild(
        toast
    );


    const bootstrapToast =
        new bootstrap.Toast(
            toast,
            {
                delay: 2500
            }
        );


    bootstrapToast.show();


    toast.addEventListener(
        "hidden.bs.toast",
        function() {

            toast.remove();

        }
    );

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {

    if (!dateString) {

        return "";

    }


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ==========================================
// DUE DATE STATUS
// ==========================================

function getDueDateStatus(
    dateString
) {

    if (!dateString) {

        return {

            text: "",

            className:
                "due-badge"

        };

    }


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const dueDate =
        new Date(
            dateString +
            "T00:00:00"
        );


    const difference =
        Math.round(
            (
                dueDate -
                today
            ) /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    if (difference < 0) {

        return {

            text:
                "⚠️ Overdue",

            className:
                "task-badge due-overdue"

        };

    }


    if (difference === 0) {

        return {

            text:
                "📅 Due Today",

            className:
                "task-badge due-today"

        };

    }


    if (difference === 1) {

        return {

            text:
                "📅 Tomorrow",

            className:
                "task-badge due-tomorrow"

        };

    }


    return {

        text:
            "📅 " +
            formatDate(dateString),

        className:
            "task-badge due-badge"

    };

}


// ==========================================
// PRIORITY
// ==========================================

function getPriorityInfo(
    priority
) {

    if (
        priority ===
        "high"
    ) {

        return {

            text:
                "🔴 High",

            className:
                "task-badge priority-high"

        };

    }


    if (
        priority ===
        "low"
    ) {

        return {

            text:
                "🟢 Low",

            className:
                "task-badge priority-low"

        };

    }


    return {

        text:
            "🟡 Medium",

        className:
            "task-badge priority-medium"

    };

}


// ==========================================
// CATEGORY
// ==========================================

function getCategoryInfo(
    category
) {

    const categories = {

        study:
            "📚 Study",

        coding:
            "💻 Coding",

        work:
            "💼 Work",

        personal:
            "🏠 Personal",

        shopping:
            "🛒 Shopping"

    };


    return {

        text:
            categories[category] ||
            "📚 Study",

        className:
            "task-badge category-badge"

    };

}


// ==========================================
// DISPLAY TASKS
// ==========================================

function displayTasks() {

    taskList.innerHTML =
        "";


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const filteredTasks =
        tasks.filter(
            function(task) {


                const matchesSearch =
                    task.text
                        .toLowerCase()
                        .includes(
                            searchText
                        );


                let matchesFilter =
                    true;


                if (
                    currentFilter ===
                    "active"
                ) {

                    matchesFilter =
                        !task.completed;

                }


                if (
                    currentFilter ===
                    "completed"
                ) {

                    matchesFilter =
                        task.completed;

                }


                return (
                    matchesSearch &&
                    matchesFilter
                );

            }
        );


    // EMPTY

    if (
        filteredTasks.length ===
        0
    ) {

        emptyMessage.style.display =
            "block";

    } else {

        emptyMessage.style.display =
            "none";

    }


    // ==========================================
    // CREATE TASK ITEMS
    // ==========================================

    filteredTasks.forEach(
        function(task) {


            const li =
                document.createElement(
                    "li"
                );


            li.classList.add(
                "task-item"
            );


            if (task.completed) {

                li.classList.add(
                    "completed"
                );

            }


            // CHECKBOX

            const checkbox =
                document.createElement(
                    "input"
                );


            checkbox.type =
                "checkbox";


            checkbox.classList.add(
                "task-checkbox"
            );


            checkbox.checked =
                task.completed;


            // CONTENT

            const content =
                document.createElement(
                    "div"
                );


            content.classList.add(
                "task-content"
            );


            // TEXT

            const span =
                document.createElement(
                    "div"
                );


            span.classList.add(
                "task-text"
            );


            span.textContent =
                task.text;


            // META

            const meta =
                document.createElement(
                    "div"
                );


            meta.classList.add(
                "task-meta"
            );


            // PRIORITY

            const priority =
                getPriorityInfo(
                    task.priority
                );


            const priorityBadge =
                document.createElement(
                    "span"
                );


            priorityBadge.className =
                priority.className;


            priorityBadge.textContent =
                priority.text;


            meta.appendChild(
                priorityBadge
            );


            // CATEGORY

            const category =
                getCategoryInfo(
                    task.category
                );


            const categoryBadge =
                document.createElement(
                    "span"
                );


            categoryBadge.className =
                category.className;


            categoryBadge.textContent =
                category.text;


            meta.appendChild(
                categoryBadge
            );


            // DATE

            if (
                task.dueDate
            ) {


                const due =
                    getDueDateStatus(
                        task.dueDate
                    );


                const dueBadge =
                    document.createElement(
                        "span"
                    );


                dueBadge.className =
                    due.className;


                dueBadge.textContent =
                    due.text;


                meta.appendChild(
                    dueBadge
                );

            }


            content.appendChild(
                span
            );


            content.appendChild(
                meta
            );


            // ACTIONS

            const actions =
                document.createElement(
                    "div"
                );


            actions.classList.add(
                "task-actions"
            );


            // EDIT

            const editBtn =
                document.createElement(
                    "button"
                );


            editBtn.classList.add(
                "edit-btn"
            );


            editBtn.innerHTML =
                '<i class="bi bi-pencil-fill"></i>';


            editBtn.title =
                "Edit task";


            // DELETE

            const deleteBtn =
                document.createElement(
                    "button"
                );


            deleteBtn.classList.add(
                "delete-btn"
            );


            deleteBtn.innerHTML =
                '<i class="bi bi-trash3-fill"></i>';


            deleteBtn.title =
                "Delete task";


            // ==========================================
            // COMPLETE TASK
            // ==========================================

            checkbox.addEventListener(
                "change",
                function() {


                    task.completed =
                        checkbox.checked;


                    saveTasks();


                    displayTasks();


                    if (
                        task.completed
                    ) {

                        showToast(
                            "Task completed! 🎉",
                            "success"
                        );

                    } else {

                        showToast(
                            "Task marked as active.",
                            "info"
                        );

                    }

                }
            );


            // ==========================================
            // EDIT TASK
            // ==========================================

            editBtn.addEventListener(
                "click",
                function() {


                    taskBeingEdited =
                        task;


                    editTaskInput.value =
                        task.text;


                    editPrioritySelect.value =
                        task.priority;


                    editCategorySelect.value =
                        task.category;


                    editDueDateInput.value =
                        task.dueDate;


                    editTaskModal.show();


                    setTimeout(
                        function() {

                            editTaskInput.focus();

                            editTaskInput.select();

                        },
                        300
                    );

                }
            );


            // ==========================================
            // DELETE TASK
            // ==========================================

            deleteBtn.addEventListener(
                "click",
                function() {


                    const confirmed =
                        confirm(
                            "Are you sure you want to delete this task?"
                        );


                    if (!confirmed) {

                        return;

                    }


                    tasks =
                        tasks.filter(
                            function(
                                existingTask
                            ) {

                                return (
                                    existingTask.id !==
                                    task.id
                                );

                            }
                        );


                    saveTasks();


                    displayTasks();


                    showToast(
                        "Task deleted successfully!",
                        "error"
                    );

                }
            );


            // ADD ELEMENTS

            actions.appendChild(
                editBtn
            );


            actions.appendChild(
                deleteBtn
            );


            li.appendChild(
                checkbox
            );


            li.appendChild(
                content
            );


            li.appendChild(
                actions
            );


            taskList.appendChild(
                li
            );


        }
    );


    updateStatistics();

    updateDashboard();

}


// ==========================================
// ADD TASK
// ==========================================

function addTask() {

    const text =
        taskInput.value.trim();


    // EMPTY

    if (
        text === ""
    ) {

        showToast(
            "Please enter a task!",
            "warning"
        );

        taskInput.focus();

        return;

    }


    // DUPLICATE

    const duplicate =
        tasks.some(
            function(task) {

                return (
                    task.text
                        .toLowerCase() ===
                    text
                        .toLowerCase()
                );

            }
        );


    if (duplicate) {

        showToast(
            "This task already exists!",
            "warning"
        );

        taskInput.focus();

        return;

    }


    // CREATE

    const newTask = {

        id:
            Date.now(),

        text:
            text,

        completed:
            false,

        priority:
            prioritySelect.value,

        category:
            categorySelect.value,

        dueDate:
            dueDateInput.value

    };


    tasks.push(
        newTask
    );


    saveTasks();


    // RESET INPUT

    taskInput.value =
        "";

    dueDateInput.value =
        "";

    prioritySelect.value =
        "medium";

    categorySelect.value =
        "study";


    displayTasks();


    taskInput.focus();


    showToast(
        "Task added successfully! 🎉",
        "success"
    );

}


// ==========================================
// ADD BUTTON
// ==========================================

addBtn.addEventListener(
    "click",
    addTask
);


// ==========================================
// ENTER KEY
// ==========================================

taskInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "Enter"
        ) {

            addTask();

        }

    }
);


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    function() {

        displayTasks();

    }
);


// ==========================================
// FILTERS
// ==========================================

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );


filterButtons.forEach(
    function(button) {


        button.addEventListener(
            "click",
            function() {


                filterButtons.forEach(
                    function(btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                displayTasks();

            }
        );

    }
);


// ==========================================
// BASIC STATISTICS
// ==========================================

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function(task) {

                return task.completed;

            }
        ).length;


    const pending =
        total -
        completed;


    totalTasks.textContent =
        total;


    completedTasks.textContent =
        completed;


    pendingTasks.textContent =
        pending;

}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function(task) {

                return task.completed;

            }
        ).length;


    // ==========================================
    // PERCENTAGE
    // ==========================================

    let percentage =
        0;


    if (
        total > 0
    ) {

        percentage =
            Math.round(
                (
                    completed /
                    total
                ) *
                100
            );

    }


    completionPercentage.textContent =
        percentage +
        "%";


    progressBar.style.width =
        percentage +
        "%";


    // ==========================================
    // MOTIVATION
    // ==========================================

    if (
        total === 0
    ) {

        motivationMessage.textContent =
            "Let's add your first task! 🚀";

    }

    else if (
        percentage ===
        100
    ) {

        motivationMessage.textContent =
            "Amazing! All tasks completed! 🏆";

    }

    else if (
        percentage >=
        75
    ) {

        motivationMessage.textContent =
            "You're doing fantastic! 🔥";

    }

    else if (
        percentage >=
        50
    ) {

        motivationMessage.textContent =
            "Great progress! Keep going! 💪";

    }

    else if (
        percentage >=
        25
    ) {

        motivationMessage.textContent =
            "Good start! You can do this! 🌟";

    }

    else {

        motivationMessage.textContent =
            "Every small step counts! 😊";

    }


    // ==========================================
    // PRIORITY COUNTS
    // ==========================================

    const high =
        tasks.filter(
            function(task) {

                return (
                    task.priority ===
                    "high"
                );

            }
        ).length;


    const medium =
        tasks.filter(
            function(task) {

                return (
                    task.priority ===
                    "medium"
                );

            }
        ).length;


    const low =
        tasks.filter(
            function(task) {

                return (
                    task.priority ===
                    "low"
                );

            }
        ).length;


    highPriorityCount.textContent =
        high;


    mediumPriorityCount.textContent =
        medium;


    lowPriorityCount.textContent =
        low;


    // CHART

    updateTaskChart(
        completed,
        total - completed
    );


    // STREAK

    updateStreak();

}


// ==========================================
// CHART
// ==========================================

function updateTaskChart(
    completed,
    pending
) {

    const canvas =
        document.getElementById(
            "taskChart"
        );


    if (!canvas) {

        return;

    }


    if (
        taskChart
    ) {

        taskChart.destroy();

    }


    taskChart =
        new Chart(
            canvas,
            {

                type:
                    "doughnut",

                data: {

                    labels: [

                        "Completed",

                        "Pending"

                    ],

                    datasets: [

                        {

                            data: [

                                completed,

                                pending

                            ],

                            borderWidth:
                                0

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    cutout:
                        "70%",

                    plugins: {

                        legend: {

                            position:
                                "bottom"

                        }

                    },

                    animation: {

                        animateRotate:
                            true,

                        duration:
                            900

                    }

                }

            }
        );

}


// ==========================================
// STREAK
// ==========================================

function updateStreak() {

    const completedTasksList =
        tasks.filter(
            function(task) {

                return task.completed;

            }
        );


    if (
        completedTasksList.length ===
        0
    ) {

        streakCount.textContent =
            "0 Day Streak";

        return;

    }


    // Simple streak for now

    const streak =
        Math.min(
            completedTasksList.length,
            7
        );


    streakCount.textContent =
        streak +
        " Day Streak";

}


// ==========================================
// CLEAR COMPLETED
// ==========================================

clearCompletedBtn.addEventListener(
    "click",
    function() {


        const exists =
            tasks.some(
                function(task) {

                    return task.completed;

                }
            );


        if (!exists) {

            showToast(
                "There are no completed tasks.",
                "info"
            );

            return;

        }


        const confirmed =
            confirm(
                "Clear all completed tasks?"
            );


        if (!confirmed) {

            return;

        }


        tasks =
            tasks.filter(
                function(task) {

                    return !task.completed;

                }
            );


        saveTasks();


        displayTasks();


        showToast(
            "Completed tasks cleared!",
            "success"
        );

    }
);


// ==========================================
// DELETE ALL
// ==========================================

deleteAllBtn.addEventListener(
    "click",
    function() {


        if (
            tasks.length ===
            0
        ) {

            showToast(
                "There are no tasks to delete.",
                "info"
            );

            return;

        }


        const confirmed =
            confirm(
                "Are you sure you want to delete ALL tasks?"
            );


        if (!confirmed) {

            return;

        }


        tasks = [];


        saveTasks();


        displayTasks();


        showToast(
            "All tasks have been deleted!",
            "error"
        );

    }
);


// ==========================================
// SAVE EDIT
// ==========================================

saveEditBtn.addEventListener(
    "click",
    function() {


        if (
            !taskBeingEdited
        ) {

            return;

        }


        const newText =
            editTaskInput.value.trim();


        // EMPTY

        if (
            newText === ""
        ) {

            showToast(
                "Task cannot be empty!",
                "warning"
            );

            editTaskInput.focus();

            return;

        }


        // DUPLICATE

        const duplicate =
            tasks.some(
                function(task) {

                    return (

                        task.id !==
                        taskBeingEdited.id &&

                        task.text
                            .toLowerCase() ===
                        newText
                            .toLowerCase()

                    );

                }
            );


        if (duplicate) {

            showToast(
                "This task already exists!",
                "warning"
            );

            editTaskInput.focus();

            return;

        }


        // UPDATE

        taskBeingEdited.text =
            newText;


        taskBeingEdited.priority =
            editPrioritySelect.value;


        taskBeingEdited.category =
            editCategorySelect.value;


        taskBeingEdited.dueDate =
            editDueDateInput.value;


        saveTasks();


        displayTasks();


        editTaskModal.hide();


        showToast(
            "Task updated successfully! ✨",
            "success"
        );


        taskBeingEdited =
            null;

    }
);


// ==========================================
// ENTER IN EDIT MODAL
// ==========================================

editTaskInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "Enter"
        ) {

            saveEditBtn.click();

        }

    }
);


// ==========================================
// MODAL CLOSE
// ==========================================

editTaskModalElement.addEventListener(
    "hidden.bs.modal",
    function() {

        taskBeingEdited =
            null;

        editTaskInput.value =
            "";

    }
);


// ==========================================
// DARK MODE
// ==========================================

darkModeBtn.addEventListener(
    "click",
    function() {


        document.body.classList.toggle(
            "dark"
        );


        if (
            document.body.classList.contains(
                "dark"
            )
        ) {


            darkModeBtn.innerHTML =
                '<i class="bi bi-sun-fill"></i>';


            localStorage.setItem(
                "darkMode",
                "true"
            );


            showToast(
                "Dark mode enabled 🌙",
                "info"
            );


        } else {


            darkModeBtn.innerHTML =
                '<i class="bi bi-moon-stars-fill"></i>';


            localStorage.setItem(
                "darkMode",
                "false"
            );


            showToast(
                "Light mode enabled ☀️",
                "info"
            );

        }

    }
);


// ==========================================
// LOAD DARK MODE
// ==========================================

const savedDarkMode =
    localStorage.getItem(
        "darkMode"
    );


if (
    savedDarkMode ===
    "true"
) {

    document.body.classList.add(
        "dark"
    );


    darkModeBtn.innerHTML =
        '<i class="bi bi-sun-fill"></i>';

}


// ==========================================
// INITIAL DISPLAY
// ==========================================

displayTasks();