
"use strict";

// HTML elements
const studentForm = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const studentModal = document.getElementById("studentModal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const cancelModal = document.getElementById("cancelModal");
const searchInput = document.getElementById("searchInput");
const totalStudents = document.getElementById("totalStudents");
const activeStudents = document.getElementById("activeStudents");
const emptyMessage = document.getElementById("emptyMessage");

// Load saved student records
function loadStudents() {
    try {
        const savedStudents = JSON.parse(localStorage.getItem("students"));
        return Array.isArray(savedStudents) ? savedStudents : [];
    } catch (error) {
        console.error("Could not load student records:", error);
        return [];
    }
}

let students = loadStudents();

// Save student records
function saveStudents() {
    try {
        localStorage.setItem("students", JSON.stringify(students));
    } catch (error) {
        alert("Unable to save records in this browser.");
        console.error(error);
    }
}

// Update dashboard numbers
function updateDashboard() {
    totalStudents.textContent = students.length;
    activeStudents.textContent = students.filter(
        student => student.status === "Active"
    ).length;
}

// Display student records
function displayStudents(searchText = "") {
    studentList.innerHTML = "";

    const filteredStudents = students.filter(student => {
        const search = searchText.toLowerCase();

        return (
            student.name.toLowerCase().includes(search) ||
            student.roll.toLowerCase().includes(search) ||
            student.course.toLowerCase().includes(search)
        );
    });

    emptyMessage.style.display =
        filteredStudents.length === 0 ? "block" : "none";

    filteredStudents.forEach(student => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        const nameContainer = document.createElement("div");
        nameContainer.className = "student-name";

        const initial = document.createElement("span");
        initial.className = "student-initial";
        initial.textContent = student.name.charAt(0).toUpperCase();

        const name = document.createElement("span");
        name.textContent = student.name;

        nameContainer.append(initial, name);
        nameCell.appendChild(nameContainer);

        const rollCell = document.createElement("td");
        rollCell.textContent = student.roll;

        const courseCell = document.createElement("td");
        courseCell.textContent = student.course;

        const statusCell = document.createElement("td");
        const status = document.createElement("span");
        status.className = "status";
        status.textContent = student.status || "Active";
        statusCell.appendChild(status);

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            deleteStudent(student.id);
        });

        actionCell.appendChild(deleteButton);

        row.append(
            nameCell,
            rollCell,
            courseCell,
            statusCell,
            actionCell
        );

        studentList.appendChild(row);
    });

    updateDashboard();
}

// Add student
studentForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const roll = document.getElementById("roll").value.trim();
    const course = document.getElementById("course").value.trim();

    if (!name || !roll || !course) {
        alert("Please fill in all fields.");
        return;
    }

    const duplicate = students.some(
        student => student.roll.toLowerCase() === roll.toLowerCase()
    );

    if (duplicate) {
        alert("A student with this roll number already exists.");
        return;
    }

    const newStudent = {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        name: name,
        roll: roll,
        course: course,
        status: "Active"
    };

    students.push(newStudent);
    saveStudents();

    studentForm.reset();
    closeStudentModal();
    searchInput.value = "";

    displayStudents();

    alert("Student added successfully!");
});

// Delete student
function deleteStudent(id) {
    const confirmed = confirm("Are you sure you want to delete this student?");

    if (!confirmed) return;

    students = students.filter(student => student.id !== id);

    saveStudents();
    displayStudents(searchInput.value);
}

// Modal controls
function openStudentModal() {
    studentModal.classList.add("show");
    document.getElementById("name").focus();
}

function closeStudentModal() {
    studentModal.classList.remove("show");
}

openModal.addEventListener("click", openStudentModal);
closeModal.addEventListener("click", closeStudentModal);
cancelModal.addEventListener("click", closeStudentModal);

studentModal.addEventListener("click", function(event) {
    if (event.target === studentModal) {
        closeStudentModal();
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeStudentModal();
    }
});

// Search students
searchInput.addEventListener("input", function() {
    displayStudents(this.value);
});

// FAQ assistant
const faqAnswers = {
    add: "Click the Add New Student button. Enter the student's name, roll number and course, then click Add Student.",
    search: "Enter a student's name, roll number or course in the search box to find matching records.",
    delete: "Find the student in the table and click Delete. Confirm the action to remove the record.",
    save: "Yes! Student records are stored in your browser's Local Storage and remain after refreshing the page on the same browser."
};

document.querySelectorAll(".faq-btn").forEach(button => {
    button.addEventListener("click", function() {
        const question = this.dataset.question;
        document.getElementById("faqAnswer").textContent =
            faqAnswers[question] || "Please try another question.";
    });
});

// Initial dashboard display
displayStudents();



