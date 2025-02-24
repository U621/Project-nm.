'use strict';

//Opening or closing side bar

const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

sidebarBtn.addEventListener("click", function() {elementToggleFunc(sidebar); })

//Activating Modal-testimonial

const testimonialsItem = document.querySelectorAll('[data-testimonials-item]');
const modalContainer = document.querySelector('[data-modal-container]');
const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
const overlay = document.querySelector('[data-overlay]');

const modalImg = document.querySelector('[data-modal-img]');
const modalTitle = document.querySelector('[data-modal-title]');
const modalText = document.querySelector('[data-modal-text]');

const testimonialsModalFunc = function () {
    modalContainer.classList.toggle('active');
    overlay.classList.toggle('active');
}

for (let i = 0; i < testimonialsItem.length; i++) {
    testimonialsItem[i].addEventListener('click', function () {
        modalImg.src = this.querySelector('[data-testimonials-avatar]').src;
        modalImg.alt = this.querySelector('[data-testimonials-avatar]').alt;
        modalTitle.innerHTML = this.querySelector('[data-testimonials-title]').innerHTML;
        modalText.innerHTML = this.querySelector('[data-testimonials-text]').innerHTML;

        testimonialsModalFunc();
    })
}

//Activating close button in modal-testimonial

modalCloseBtn.addEventListener('click', testimonialsModalFunc);
overlay.addEventListener('click', testimonialsModalFunc);

//Activating Filter Select and filtering options

const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-select-value]');
const filterBtn = document.querySelectorAll('[data-filter-btn]');

select.addEventListener('click', function () {elementToggleFunc(this); });

for(let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener('click', function() {

        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        elementToggleFunc(select);
        filterFunc(selectedValue);

    });
}

const filterItems = document.querySelectorAll('[data-filter-item]');

const filterFunc = function (selectedValue) {
    for(let i = 0; i < filterItems.length; i++) {
        if(selectedValue == "all") {
            filterItems[i].classList.add('active');
        } else if (selectedValue == filterItems[i].dataset.category) {
            filterItems[i].classList.add('active');
        } else {
            filterItems[i].classList.remove('active');
        }
    }
}

//Enabling filter button for larger screens 

let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
    
    filterBtn[i].addEventListener('click', function() {

        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        filterFunc(selectedValue);

        lastClickedBtn.classList.remove('active');
        this.classList.add('active');
        lastClickedBtn = this;

    })
}

// Enabling Contact Form

const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

for(let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener('input', function () {
        if(form.checkValidity()) {
            formBtn.removeAttribute('disabled');
        } else { 
            formBtn.setAttribute('disabled', '');
        }
    })
}

// Enabling Page Navigation 

const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

for(let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener('click', function() {
        
        for(let i = 0; i < pages.length; i++) {
            if(this.innerHTML.toLowerCase() == pages[i].dataset.page) {
                pages[i].classList.add('active');
                navigationLinks[i].classList.add('active');
                window.scrollTo(0, 0);
            } else {
                pages[i].classList.remove('active');
                navigationLinks[i]. classList.remove('active');
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadData(); 
    loadTitle(); 
});

function updateTitle() {
    const title = document.getElementById("schedule-title").value.trim();
    document.getElementById("schedule-display-title").textContent = title || "Your Schedule";
    localStorage.setItem("scheduleTitle", title);
}

function loadTitle() {
    const savedTitle = localStorage.getItem("scheduleTitle") || "Your Schedule";
    document.getElementById("schedule-title").value = savedTitle;
    document.getElementById("schedule-display-title").textContent = savedTitle;
}

function addItem() {
    const subject = document.getElementById("new-subject").value.trim();
    const teacher = document.getElementById("new-teacher").value.trim();
    const classInfo = document.getElementById("new-class").value.trim();
    const credit = parseFloat(document.getElementById("new-credit").value.trim());
    const selectedTables = Array.from(document.querySelectorAll('input[name="table-selection"]:checked'))
        .map(input => input.value);

    if (selectedTables.length === 0) {
        alert("Please select at least one table before adding a course!");
        return;
    }

    if (subject && teacher && classInfo && !isNaN(credit) && credit > 0) {
        let courses = JSON.parse(localStorage.getItem("courses") || "[]");
        courses.push({ subject, teacher, classInfo, credit, tables: selectedTables });
        localStorage.setItem("courses", JSON.stringify(courses));

        document.getElementById("new-subject").value = "";
        document.getElementById("new-teacher").value = "";
        document.getElementById("new-class").value = "";
        document.getElementById("new-credit").value = "";
        document.querySelectorAll('input[name="table-selection"]').forEach(input => input.checked = false);

        loadData();
    } else {
        alert("Please fill all fields correctly!");
    }
}

function loadData() {
    const container = document.getElementById("data-container");
    container.innerHTML = "";
    let courses = JSON.parse(localStorage.getItem("courses") || "[]");

    courses.forEach((course, index) => {
        const newItem = document.createElement("div");
        newItem.className = "data-item";
        newItem.innerHTML = `
            <input type="text" value="${course.subject}" onchange="updateItem(${index}, 'subject', this.value)">
            <input type="text" value="${course.teacher}" onchange="updateItem(${index}, 'teacher', this.value)">
            <input type="text" value="${course.classInfo}" onchange="updateItem(${index}, 'classInfo', this.value)">
            <input type="number" step="0.5" min="0.5" value="${course.credit}" onchange="updateItem(${index}, 'credit', parseFloat(this.value))">
            <span>Tables: ${course.tables.join(", ")}</span>
            <button onclick="deleteItem(${index})">Delete</button>
        `;
        container.appendChild(newItem);
    });
}

function deleteItem(index) {
    let courses = JSON.parse(localStorage.getItem("courses") || "[]");
    courses.splice(index, 1);
    localStorage.setItem("courses", JSON.stringify(courses));
    loadData();
}

function generateRandomSchedules() {
    const numTables = parseInt(document.getElementById("numTables").value);
    const rows = parseInt(document.getElementById("rows").value);
    const cols = parseInt(document.getElementById("cols").value);
    const container = document.getElementById("tableContainer");

    container.innerHTML = ""; // เคลียร์ก่อนสร้างใหม่

    let courses = JSON.parse(localStorage.getItem("courses") || "[]");
    let schedules = Array(numTables).fill().map(() => []);

    courses.forEach(course => {
        course.tables.forEach(table => {
            let tableIndex = table === "all" ? schedules.map((_, i) => i) : [parseInt(table) - 1];
            tableIndex.forEach(index => {
                if (schedules[index]) {
                    let slots = Math.round(course.credit * 2);
                    for (let i = 0; i < slots; i++) {
                        schedules[index].push(`${course.subject}<br>${course.teacher}<br>${course.classInfo}`);
                    }
                }
            });
        });
    });

    schedules.forEach((scheduleEntries, t) => {
        scheduleEntries.sort(() => Math.random() - 0.5);
        let tableHTML = "<table>";
        tableHTML += `<tr><th>คาบ</th>${Array.from({ length: cols }, (_, c) => `<th>${c + 1}</th>`).join("")}</tr>`;
        const days = ["เวลา", "จันทร์", "อังคาร", "พุธ", "พฤหัสฯ", "ศุกร์"];

        for (let r = 0; r < rows; r++) {
            tableHTML += `<tr><th>${days[r] || `Day ${r + 1}`}</th>`;
            for (let c = 0; c < cols; c++) {
                let cellKey = `table-${t}-cell-${r}-${c}`;
                let savedData = localStorage.getItem(cellKey);
                let isLocked = savedData && savedData.includes("[LOCKED]");
                let cellContent = isLocked ? savedData.replace("[LOCKED]", "") : scheduleEntries.pop() || "";

                tableHTML += `
                    <td contenteditable="true"
                        oninput="updateCell('${cellKey}', this)"
                        onclick="toggleLock('${cellKey}', this)"
                        class="${isLocked ? 'locked' : ''}">
                        ${cellContent}
                    </td>`;
            }
            tableHTML += "</tr>";
        }
        tableHTML += "</table><br>";
        container.innerHTML += tableHTML;
    });
}

function toggleLock(cellKey, cell) {
    let currentData = cell.innerText;
    if (cell.classList.contains("locked")) {
        cell.classList.remove("locked");
        localStorage.setItem(cellKey, currentData);
    } else {
        cell.classList.add("locked");
        localStorage.setItem(cellKey, "[LOCKED]" + currentData);
    }
}

function updateCell(cellKey, cell) {
    let currentData = cell.innerText;
    let isLocked = cell.classList.contains("locked");
    localStorage.setItem(cellKey, (isLocked ? "[LOCKED]" : "") + currentData);
}

window.onload = function () {
    if (localStorage.getItem("tableData")) {
        document.getElementById("tableContainer").innerHTML = localStorage.getItem("tableData");
    }
};

function updateTableSelection() {
    const allCheckbox = document.querySelector('input[name="table-selection"][value="all"]');
    const otherCheckboxes = document.querySelectorAll('input[name="table-selection"]:not([value="all"])');

    if (allCheckbox.checked) {
        otherCheckboxes.forEach(cb => cb.checked = true);
    } else {
        otherCheckboxes.forEach(cb => cb.checked = false);
    }
}

function goToSchedulePage() {
    document.getElementById("courseInfo").style.display = "none";
    document.getElementById("schedulePage").style.display = "block";
}

function goToCourseInfoPage() {
    document.getElementById("courseInfo").style.display = "block";
    document.getElementById("schedulePage").style.display = "none";
}
