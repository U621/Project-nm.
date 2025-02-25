'use strict';

document.addEventListener("DOMContentLoaded", () => {
    initSidebar();
    initTestimonials();
    initFilter();
    initForm();
    initNavigation();
    loadData();
    loadTitle();
});

// Sidebar Toggle
function initSidebar() {
    const sidebar = document.querySelector("[data-sidebar]");
    const sidebarBtn = document.querySelector("[data-sidebar-btn]");
    if (sidebar && sidebarBtn) {
        sidebarBtn.addEventListener("click", () => sidebar.classList.toggle("active"));
    }
}

// Testimonials Modal
function initTestimonials() {
    const modalContainer = document.querySelector('[data-modal-container]');
    const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
    const overlay = document.querySelector('[data-overlay]');
    const testimonialsItem = document.querySelectorAll('[data-testimonials-item]');
    
    const toggleModal = () => {
        modalContainer.classList.toggle('active');
        overlay.classList.toggle('active');
    };
    
    testimonialsItem.forEach(item => {
        item.addEventListener('click', function () {
            document.querySelector('[data-modal-img]').src = this.querySelector('[data-testimonials-avatar]').src;
            document.querySelector('[data-modal-title]').innerText = this.querySelector('[data-testimonials-title]').innerText;
            document.querySelector('[data-modal-text]').innerText = this.querySelector('[data-testimonials-text]').innerText;
            toggleModal();
        });
    });
    
    modalCloseBtn?.addEventListener('click', toggleModal);
    overlay?.addEventListener('click', toggleModal);
}

// Filter Functionality
function initFilter() {
    const select = document.querySelector('[data-select]');
    const selectItems = document.querySelectorAll('[data-select-item]');
    const selectValue = document.querySelector('[data-select-value]');
    const filterItems = document.querySelectorAll('[data-filter-item]');
    const filterBtns = document.querySelectorAll('[data-filter-btn]');
    let lastClickedBtn = filterBtns[0];

    select?.addEventListener('click', () => select.classList.toggle('active'));

    selectItems.forEach(item => {
        item.addEventListener('click', function() {
            let selectedValue = this.innerText.toLowerCase();
            selectValue.innerText = this.innerText;
            select.classList.remove('active');
            filterFunc(selectedValue, filterItems);
        });
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            let selectedValue = this.innerText.toLowerCase();
            selectValue.innerText = this.innerText;
            filterFunc(selectedValue, filterItems);
            lastClickedBtn.classList.remove('active');
            this.classList.add('active');
            lastClickedBtn = this;
        });
    });
}

function filterFunc(selectedValue, items) {
    items.forEach(item => {
        item.classList.toggle('active', selectedValue === 'all' || selectedValue === item.dataset.category);
    });
}

// Form Validation
function initForm() {
    const form = document.querySelector('[data-form]');
    const formInputs = document.querySelectorAll('[data-form-input]');
    const formBtn = document.querySelector('[data-form-btn]');

    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            formBtn.disabled = !form.checkValidity();
        });
    });
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('[data-nav-link]');
    const pages = document.querySelectorAll('[data-page]');

    navLinks.forEach((link, index) => {
        link.addEventListener('click', function () {
            pages.forEach(page => page.classList.remove('active'));
            navLinks.forEach(nav => nav.classList.remove('active'));
            pages[index].classList.add('active');
            this.classList.add('active');
            window.scrollTo(0, 0);
        });
    });
}

// Load and Save Data
function updateTitle() {
    const title = document.getElementById("schedule-title").value.trim();
    document.getElementById("schedule-display-title").textContent = title || "Your Schedule";
    localStorage.setItem("scheduleTitle", title);
}

function loadTitle() {
    const titleInput = document.getElementById("schedule-title");
    const titleDisplay = document.getElementById("schedule-display-title");
    if (titleInput && titleDisplay) {
        const savedTitle = localStorage.getItem("scheduleTitle") || "Your Schedule";
        titleInput.value = savedTitle;
        titleDisplay.textContent = savedTitle;
    }
}

function loadData() {
    const container = document.getElementById("data-container");
    if (!container) return;
    container.innerHTML = "";
    const courses = JSON.parse(localStorage.getItem("courses") || "[]");

    courses.forEach((course, index) => {
        const item = document.createElement("div");
        item.className = "data-item";
        item.innerHTML = `
            <input type="text" value="${course.subject}" onchange="updateItem(${index}, 'subject', this.value)">
            <input type="text" value="${course.teacher}" onchange="updateItem(${index}, 'teacher', this.value)">
            <input type="text" value="${course.classInfo}" onchange="updateItem(${index}, 'classInfo', this.value)">
            <input type="number" step="0.5" min="0.5" value="${course.credit}" onchange="updateItem(${index}, 'credit', parseFloat(this.value))">
            <span>Tables: ${course.tables.join(", ")}</span>
            <button onclick="deleteItem(${index})">Delete</button>
        `;
        container.appendChild(item);
    });
}

function deleteItem(index) {
    const courses = JSON.parse(localStorage.getItem("courses") || "[]");
    courses.splice(index, 1);
    localStorage.setItem("courses", JSON.stringify(courses));
    loadData();
}
