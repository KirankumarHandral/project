
const studentForm = document.getElementById("studentForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const mobileInput = document.getElementById("mobile");
const courseInput = document.getElementById("course");

const studentTable = document.getElementById("studentTable");
const searchInput = document.getElementById("search");

// Load students from Local Storage
let students = JSON.parse(localStorage.getItem("students")) || [];

// Track whether we are editing a student
let editStudentId = null;


// Save data to Local Storage
function saveToLocalStorage() {
    localStorage.setItem("students", JSON.stringify(students));
}


// Display students in the table
function displayStudents(studentList = students) {

    studentTable.innerHTML = "";

    studentList.forEach((student) => {

        const row = document.createElement("tr");

        // Create table cells safely
        const nameCell = document.createElement("td");
        nameCell.textContent = student.name;

        const emailCell = document.createElement("td");
        emailCell.textContent = student.email;

        const mobileCell = document.createElement("td");
        mobileCell.textContent = student.mobile;

        const courseCell = document.createElement("td");
        courseCell.textContent = student.course;

        const actionCell = document.createElement("td");

        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.type = "button";
        editButton.addEventListener("click", () => editStudent(student.id));

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.addEventListener("click", () => deleteStudent(student.id));

        actionCell.append(editButton, deleteButton);

        row.append(
            nameCell,
            emailCell,
            mobileCell,
            courseCell,
            actionCell
        );

        studentTable.appendChild(row);
    });
}


// Add or Update student
studentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const mobile = mobileInput.value.trim();
    const course = courseInput.value;

    // Basic validation
    if (!name || !email || !mobile || !course) {
        alert("Please fill all fields.");
        return;
    }

    // Mobile validation
    if (!/^\d{10}$/.test(mobile)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    // Duplicate email validation
    const duplicateEmail = students.some(student =>
        student.email.toLowerCase() === email.toLowerCase() &&
        student.id !== editStudentId
    );

    if (duplicateEmail) {
        alert("Email already exists.");
        return;
    }

    if (editStudentId !== null) {

        // Update existing student
        const studentIndex = students.findIndex(
            student => student.id === editStudentId
        );

        if (studentIndex !== -1) {
            students[studentIndex] = {
                id: editStudentId,
                name,
                email,
                mobile,
                course
            };
        }

        editStudentId = null;

        studentForm.querySelector("button[type='submit']").textContent = "Submit";

    } else {

        // Add new student
        const newStudent = {
            id: Date.now(),
            name,
            email,
            mobile,
            course
        };

        students.push(newStudent);
    }

    // Save and refresh
    saveToLocalStorage();
    displayStudents();

    // Reset form
    studentForm.reset();
});


// Edit student
function editStudent(id) {

    const student = students.find(student => student.id === id);

    if (!student) {
        return;
    }

    nameInput.value = student.name;
    emailInput.value = student.email;
    mobileInput.value = student.mobile;
    courseInput.value = student.course;

    editStudentId = id;

    studentForm.querySelector("button[type='submit']").textContent = "Update";

    nameInput.focus();
}


// Delete student
function deleteStudent(id) {

    const confirmDelete = confirm("Are you sure you want to delete this student?");

    if (!confirmDelete) {
        return;
    }

    students = students.filter(student => student.id !== id);

    // If the deleted record was being edited, reset form
    if (editStudentId === id) {
        editStudentId = null;
        studentForm.reset();
        studentForm.querySelector("button[type='submit']").textContent = "Submit";
    }

    saveToLocalStorage();
    displayStudents();
}


// Search students by name
searchInput.addEventListener("input", function () {

    const searchValue = searchInput.value.trim().toLowerCase();

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchValue)
    );

    displayStudents(filteredStudents);
});


// Display records when the page loads
displayStudents();
