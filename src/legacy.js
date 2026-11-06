// ============================================================
// CAMPUSFLOW CMS
// Complete Frontend JavaScript
// HTML + CSS + JavaScript + LocalStorage
// ============================================================

function initCampusFlow() {

    // ========================================================
    // 1. GLOBAL VARIABLES
    // ========================================================

    const STORAGE_KEY = "campusflow_content";

    let contents = [];
    let currentFilter = "all";
    let currentSearch = "";
    let currentCategory = "all";
    let currentPage = 1;
    const ITEMS_PER_PAGE = 10;

    let editingId = null;


    // ========================================================
    // 2. DOM ELEMENTS
    // ========================================================

    const sidebar = document.getElementById("sidebar");
    const mobileMenu = document.getElementById("mobileMenu");

    const menuItems = document.querySelectorAll(".menu-item");
    const pageSections = document.querySelectorAll(".page-section");
    const breadcrumbTitle = document.getElementById("breadcrumbTitle");

    const themeToggle = document.getElementById("themeToggle");

    const globalSearch = document.getElementById("globalSearch");

    const contentSearch = document.getElementById("contentSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const contentTabs = document.querySelectorAll(".content-tab");

    const contentTable = document.getElementById("contentTable");

    const contentModal = document.getElementById("contentModal");
    const contentForm = document.getElementById("contentForm");

    const createPostButton =
        document.getElementById("createPostButton");

    const newContentButton =
        document.getElementById("newContentButton");

    const closeContentModal =
        document.getElementById("closeContentModal");

    const cancelContentModal =
        document.getElementById("cancelContentModal");

    const contentTitle =
        document.getElementById("contentTitle");

    const contentCategory =
        document.getElementById("contentCategory");

    const contentStatus =
        document.getElementById("contentStatus");

    const contentDescription =
        document.getElementById("contentDescription");

    const modalHeading =
        contentModal.querySelector("h2");

    const modalDescription =
        contentModal.querySelector(".modal-header p");

    const modalSubmitButton =
        contentForm.querySelector('button[type="submit"]');


    // ========================================================
    // 3. SAMPLE CMS DATA
    // ========================================================

    const sampleContents = [
        {
            id: 1,
            title: "Annual Tech Fest 2026",
            description: "Annual technology festival announcement for students.",
            author: "Rahul Kumar",
            category: "Events",
            status: "Published",
            updated: "2 hours ago",
            icon: "fa-calendar-days"
        },

        {
            id: 2,
            title: "Semester Examination Schedule",
            description: "Semester examination timetable and important instructions.",
            author: "Priya Singh",
            category: "Academic",
            status: "In Review",
            updated: "5 hours ago",
            icon: "fa-graduation-cap"
        },

        {
            id: 3,
            title: "New Library Resources Available",
            description: "New books, journals and digital resources are now available.",
            author: "Arjun Mehta",
            category: "News",
            status: "Draft",
            updated: "Yesterday",
            icon: "fa-newspaper"
        },

        {
            id: 4,
            title: "Coding Club Workshop",
            description: "Hands-on programming workshop organized by the Coding Club.",
            author: "Neha Sharma",
            category: "Clubs",
            status: "Published",
            updated: "2 days ago",
            icon: "fa-code"
        },

        {
            id: 5,
            title: "Inter College Sports Meet",
            description: "Registration details for the annual inter college sports meet.",
            author: "Rahul Kumar",
            category: "Events",
            status: "Published",
            updated: "3 days ago",
            icon: "fa-trophy"
        },

        {
            id: 6,
            title: "Mid Semester Results",
            description: "Important information regarding mid semester results.",
            author: "Priya Singh",
            category: "Academic",
            status: "Published",
            updated: "4 days ago",
            icon: "fa-chart-column"
        },

        {
            id: 7,
            title: "Student Innovation Awards",
            description: "Applications are open for the Student Innovation Awards.",
            author: "Arjun Mehta",
            category: "News",
            status: "Draft",
            updated: "5 days ago",
            icon: "fa-award"
        },

        {
            id: 8,
            title: "Photography Club Exhibition",
            description: "Annual photography exhibition by the campus photography club.",
            author: "Neha Sharma",
            category: "Clubs",
            status: "In Review",
            updated: "6 days ago",
            icon: "fa-camera"
        },

        {
            id: 9,
            title: "Freshers Welcome Event",
            description: "Welcome event details for newly admitted students.",
            author: "Rahul Kumar",
            category: "Events",
            status: "Published",
            updated: "1 week ago",
            icon: "fa-users"
        },

        {
            id: 10,
            title: "Academic Calendar 2026",
            description: "Complete academic calendar for the 2026 session.",
            author: "Priya Singh",
            category: "Academic",
            status: "Published",
            updated: "1 week ago",
            icon: "fa-calendar"
        },

        {
            id: 11,
            title: "Campus Sustainability Drive",
            description: "Campus-wide environmental awareness and sustainability campaign.",
            author: "Arjun Mehta",
            category: "News",
            status: "In Review",
            updated: "1 week ago",
            icon: "fa-leaf"
        },

        {
            id: 12,
            title: "Robotics Club Recruitment",
            description: "Applications are open for new Robotics Club members.",
            author: "Neha Sharma",
            category: "Clubs",
            status: "Draft",
            updated: "2 weeks ago",
            icon: "fa-robot"
        }
    ];


    // ========================================================
    // 4. LOCAL STORAGE
    // ========================================================

    function loadContents() {

        const savedData =
            localStorage.getItem(STORAGE_KEY);

        if (savedData) {

            try {

                contents = JSON.parse(savedData);

            } catch (error) {

                console.error(
                    "Could not load saved content:",
                    error
                );

                contents = [...sampleContents];
                saveContents();
            }

        } else {

            contents = [...sampleContents];
            saveContents();

        }
    }


    function saveContents() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(contents)
        );

    }


    // ========================================================
    // 5. HELPER FUNCTIONS
    // ========================================================

    function escapeHTML(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    function getStatusClass(status) {

        if (status === "Published") {
            return "published";
        }

        if (status === "Draft") {
            return "draft";
        }

        return "review";
    }


    function getCategoryClass(category) {

        return category
            .toLowerCase()
            .replaceAll(" ", "-");

    }


    function getFilteredContents() {

        return contents.filter((item) => {

            const matchesStatus =
                currentFilter === "all" ||
                item.status.toLowerCase() === currentFilter;

            const matchesCategory =
                currentCategory === "all" ||
                item.category.toLowerCase() === currentCategory;

            const searchText =
                currentSearch.toLowerCase();

            const matchesSearch =
                item.title.toLowerCase().includes(searchText) ||
                item.description.toLowerCase().includes(searchText) ||
                item.author.toLowerCase().includes(searchText) ||
                item.category.toLowerCase().includes(searchText);

            return (
                matchesStatus &&
                matchesCategory &&
                matchesSearch
            );

        });

    }


    // ========================================================
    // 6. RENDER CONTENT TABLE
    // ========================================================

    function renderContentTable() {

        const filteredContents =
            getFilteredContents();

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    filteredContents.length /
                    ITEMS_PER_PAGE
                )
            );


        if (currentPage > totalPages) {
            currentPage = totalPages;
        }


        const startIndex =
            (currentPage - 1) *
            ITEMS_PER_PAGE;

        const endIndex =
            startIndex +
            ITEMS_PER_PAGE;

        const pageContents =
            filteredContents.slice(
                startIndex,
                endIndex
            );


        contentTable.innerHTML = "";


        // No results
        if (pageContents.length === 0) {

            contentTable.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center; padding:50px;">
                        <div style="opacity:0.7;">
                            <i class="fa-solid fa-file-circle-xmark"
                               style="font-size:40px; margin-bottom:15px;">
                            </i>

                            <h3>No content found</h3>

                            <p>
                                Try changing your search or filters.
                            </p>
                        </div>
                    </td>
                </tr>
            `;

            updatePagination(
                filteredContents.length,
                totalPages
            );

            return;
        }


        pageContents.forEach((item) => {

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>
                    <input
                        type="checkbox"
                        class="content-checkbox"
                        data-id="${item.id}"
                    >
                </td>

                <td>

                    <div class="content-title-cell">

                        <div class="content-icon">

                            <i class="fa-solid ${escapeHTML(item.icon)}"></i>

                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(item.title)}
                            </strong>

                            <span>
                                ${escapeHTML(item.description)}
                            </span>

                        </div>

                    </div>

                </td>

                <td>
                    ${escapeHTML(item.author)}
                </td>

                <td>

                    <span class="category-tag ${getCategoryClass(item.category)}">
                        ${escapeHTML(item.category)}
                    </span>

                </td>

                <td>

                    <span class="status ${getStatusClass(item.status)}">
                        ${escapeHTML(item.status)}
                    </span>

                </td>

                <td>
                    ${escapeHTML(item.updated)}
                </td>

                <td>

                    <div class="action-buttons">

                        <button
                            class="table-action edit-content"
                            data-id="${item.id}"
                            title="Edit"
                        >
                            <i class="fa-solid fa-pen"></i>
                        </button>

                        <button
                            class="table-action delete-content"
                            data-id="${item.id}"
                            title="Delete"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </td>
            `;


            contentTable.appendChild(row);

        });


        updatePagination(
            filteredContents.length,
            totalPages
        );

        updateContentCounters();

    }


    // ========================================================
    // 7. PAGINATION
    // ========================================================

    function updatePagination(
        totalItems,
        totalPages
    ) {

        const pagination =
            document.querySelector(
                "#postsSection .pagination"
            );

        if (!pagination) return;


        const text =
            pagination.querySelector("span");

        const buttonsContainer =
            pagination.querySelector(
                ".pagination-buttons"
            );


        if (totalItems === 0) {

            text.textContent =
                "Showing 0 results";

        } else {

            const start =
                ((currentPage - 1) *
                ITEMS_PER_PAGE) + 1;

            const end =
                Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    totalItems
                );

            text.textContent =
                `Showing ${start}–${end} of ${totalItems} results`;

        }


        buttonsContainer.innerHTML = "";


        // Previous button

        const previous =
            document.createElement("button");

        previous.innerHTML =
            `<i class="fa-solid fa-chevron-left"></i>`;

        previous.disabled =
            currentPage === 1;

        previous.addEventListener(
            "click",
            () => {

                if (currentPage > 1) {

                    currentPage--;

                    renderContentTable();

                }

            }
        );

        buttonsContainer.appendChild(previous);


        // Page buttons

        for (
            let page = 1;
            page <= totalPages;
            page++
        ) {

            if (
                totalPages > 6 &&
                page > 3 &&
                page < totalPages
            ) {

                if (page === 4) {

                    const dots =
                        document.createElement("span");

                    dots.textContent = "...";

                    buttonsContainer.appendChild(dots);

                }

                continue;

            }


            const button =
                document.createElement("button");

            button.textContent = page;


            if (page === currentPage) {
                button.classList.add("active");
            }


            button.addEventListener(
                "click",
                () => {

                    currentPage = page;

                    renderContentTable();

                }
            );


            buttonsContainer.appendChild(button);

        }


        // Next button

        const next =
            document.createElement("button");

        next.innerHTML =
            `<i class="fa-solid fa-chevron-right"></i>`;

        next.disabled =
            currentPage === totalPages;

        next.addEventListener(
            "click",
            () => {

                if (currentPage < totalPages) {

                    currentPage++;

                    renderContentTable();

                }

            }
        );

        buttonsContainer.appendChild(next);

    }


    // ========================================================
    // 8. CONTENT COUNTERS
    // ========================================================

    function updateContentCounters() {

        // Sidebar badge

        const badge =
            document.querySelector(
                '.menu-item[data-section="posts"] .menu-badge'
            );

        if (badge) {

            badge.textContent =
                contents.length;

        }


        // Dashboard Total Content

        const dashboardCards =
            document.querySelectorAll(
                ".stat-card"
            );


        dashboardCards.forEach((card) => {

            const label =
                card.querySelector(".stat-label");

            const value =
                card.querySelector(".stat-value");

            if (!label || !value) return;


            const labelText =
                label.textContent.trim();


            if (labelText === "Total Content") {

                value.textContent =
                    contents.length;

            }


            if (labelText === "Pending Review") {

                const reviewCount =
                    contents.filter(
                        item =>
                            item.status === "In Review"
                    ).length;

                value.textContent =
                    reviewCount;

            }

        });

    }


    // ========================================================
    // 9. SIDEBAR NAVIGATION
    // ========================================================

    menuItems.forEach((item) => {

        item.addEventListener(
            "click",
            (event) => {

                event.preventDefault();


                const sectionName =
                    item.dataset.section;


                menuItems.forEach((menu) => {

                    menu.classList.remove(
                        "active"
                    );

                });


                item.classList.add("active");


                pageSections.forEach((section) => {

                    section.classList.remove(
                        "active-section"
                    );

                });


                const selectedSection =
                    document.getElementById(
                        sectionName + "Section"
                    );


                if (selectedSection) {

                    selectedSection.classList.add(
                        "active-section"
                    );

                }


                const title =
                    item.querySelector("span");

                if (title) {

                    breadcrumbTitle.textContent =
                        title.textContent.trim();

                }


                sidebar.classList.remove(
                    "open"
                );

            }
        );

    });


    // ========================================================
    // 10. DASHBOARD "VIEW ALL"
    // ========================================================

    document.querySelectorAll(
        "[data-section-link]"
    ).forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const sectionName =
                    button.dataset.sectionLink;

                const target =
                    document.querySelector(
                        `.menu-item[data-section="${sectionName}"]`
                    );

                if (target) {

                    target.click();

                }

            }
        );

    });


    // ========================================================
    // 11. MOBILE MENU
    // ========================================================

    if (mobileMenu) {

        mobileMenu.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle(
                    "open"
                );

            }
        );

    }


    // ========================================================
    // 12. DARK / LIGHT MODE
    // ========================================================

    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "dark-mode"
                );


                const icon =
                    themeToggle.querySelector("i");


                const darkMode =
                    document.body.classList.contains(
                        "dark-mode"
                    );


                if (darkMode) {

                    icon.classList.remove(
                        "fa-moon"
                    );

                    icon.classList.add(
                        "fa-sun"
                    );


                    showToast(
                        "Dark Mode",
                        "Dark theme enabled."
                    );

                } else {

                    icon.classList.remove(
                        "fa-sun"
                    );

                    icon.classList.add(
                        "fa-moon"
                    );


                    showToast(
                        "Light Mode",
                        "Light theme enabled."
                    );

                }

            }
        );

    }


    // ========================================================
    // 13. CONTENT TABS
    // ========================================================

    contentTabs.forEach((tab) => {

        tab.addEventListener(
            "click",
            () => {

                contentTabs.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                tab.classList.add("active");


                const text =
                    tab.textContent.trim();


                if (text === "All Content") {

                    currentFilter = "all";

                } else if (text === "Published") {

                    currentFilter = "published";

                } else if (text === "Drafts") {

                    currentFilter = "draft";

                } else if (text === "In Review") {

                    currentFilter = "in review";

                }


                currentPage = 1;

                renderContentTable();

            }
        );

    });


    // ========================================================
    // 14. CONTENT SEARCH
    // ========================================================

    if (contentSearch) {

        contentSearch.addEventListener(
            "input",
            () => {

                currentSearch =
                    contentSearch.value.trim();

                currentPage = 1;

                renderContentTable();

            }
        );

    }


    // ========================================================
    // 15. CATEGORY FILTER
    // ========================================================

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            () => {

                currentCategory =
                    categoryFilter.value;

                currentPage = 1;

                renderContentTable();

            }
        );

    }


    // ========================================================
    // 16. OPEN CREATE MODAL
    // ========================================================

    function openCreateModal() {

        editingId = null;

        contentForm.reset();


        modalHeading.textContent =
            "Create New Content";


        modalDescription.textContent =
            "Add a new article, announcement or page.";


        modalSubmitButton.innerHTML = `
            <i class="fa-solid fa-check"></i>
            Create Content
        `;


        contentModal.classList.add("show");


        setTimeout(() => {

            contentTitle.focus();

        }, 100);

    }


    // ========================================================
    // 17. OPEN EDIT MODAL
    // ========================================================

    function openEditModal(id) {

        const item =
            contents.find(
                content => content.id === id
            );


        if (!item) return;


        editingId = id;


        contentTitle.value =
            item.title;

        contentCategory.value =
            item.category;

        contentStatus.value =
            item.status;

        contentDescription.value =
            item.description;


        modalHeading.textContent =
            "Edit Content";


        modalDescription.textContent =
            "Update your campus content information.";


        modalSubmitButton.innerHTML = `
            <i class="fa-solid fa-floppy-disk"></i>
            Save Changes
        `;


        contentModal.classList.add("show");


        setTimeout(() => {

            contentTitle.focus();

        }, 100);

    }


    // ========================================================
    // 18. CLOSE MODAL
    // ========================================================

    function closeModal() {

        contentModal.classList.remove(
            "show"
        );

        editingId = null;

        contentForm.reset();

    }


    if (createPostButton) {

        createPostButton.addEventListener(
            "click",
            openCreateModal
        );

    }


    if (newContentButton) {

        newContentButton.addEventListener(
            "click",
            openCreateModal
        );

    }


    if (closeContentModal) {

        closeContentModal.addEventListener(
            "click",
            closeModal
        );

    }


    if (cancelContentModal) {

        cancelContentModal.addEventListener(
            "click",
            closeModal
        );

    }


    // Click outside modal

    contentModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === contentModal
            ) {

                closeModal();

            }

        }
    );


    // Escape key

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                contentModal.classList.contains(
                    "show"
                )
            ) {

                closeModal();

            }

        }
    );


    // ========================================================
    // 19. CREATE / EDIT CONTENT
    // ========================================================

    contentForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const title =
                contentTitle.value.trim();

            const category =
                contentCategory.value;

            const status =
                contentStatus.value;

            const description =
                contentDescription.value.trim();


            if (!title) {

                showToast(
                    "Missing Title",
                    "Please enter a content title."
                );

                contentTitle.focus();

                return;

            }


            // EDIT EXISTING CONTENT

            if (editingId !== null) {

                const index =
                    contents.findIndex(
                        item =>
                            item.id === editingId
                    );


                if (index !== -1) {

                    contents[index] = {

                        ...contents[index],

                        title,

                        category,

                        status,

                        description,

                        updated: "Just now"

                    };

                }


                saveContents();

                renderContentTable();

                closeModal();


                showToast(
                    "Content Updated",
                    `"${title}" was updated successfully.`
                );


                return;

            }


            // CREATE NEW CONTENT

            const newContent = {

                id: Date.now(),

                title,

                description:
                    description ||
                    "No description provided.",

                author:
                    "Arjeet Sharma",

                category,

                status,

                updated: "Just now",

                icon:
                    getCategoryIcon(category)

            };


            contents.unshift(
                newContent
            );


            saveContents();

            currentFilter = "all";
            currentCategory = "all";
            currentSearch = "";
            currentPage = 1;


            // Reset filters

            if (contentSearch) {

                contentSearch.value = "";

            }

            if (categoryFilter) {

                categoryFilter.value = "all";

            }


            contentTabs.forEach(
                tab => {

                    tab.classList.remove(
                        "active"
                    );


                    if (
                        tab.textContent.trim() ===
                        "All Content"
                    ) {

                        tab.classList.add(
                            "active"
                        );

                    }

                }
            );


            renderContentTable();

            closeModal();


            showToast(
                "Content Created",
                `"${title}" has been added successfully.`
            );

        }
    );


    // ========================================================
    // 20. CATEGORY ICON
    // ========================================================

    function getCategoryIcon(category) {

        const icons = {

            Events: "fa-calendar-days",

            News: "fa-newspaper",

            Academic: "fa-graduation-cap",

            Clubs: "fa-users"

        };


        return (
            icons[category] ||
            "fa-file-lines"
        );

    }


    // ========================================================
    // 21. EDIT / DELETE BUTTONS
    // ========================================================

    contentTable.addEventListener(
        "click",
        (event) => {

            const editButton =
                event.target.closest(
                    ".edit-content"
                );


            const deleteButton =
                event.target.closest(
                    ".delete-content"
                );


            if (editButton) {

                const id =
                    Number(
                        editButton.dataset.id
                    );

                openEditModal(id);

            }


            if (deleteButton) {

                const id =
                    Number(
                        deleteButton.dataset.id
                    );

                deleteContent(id);

            }

        }
    );


    // ========================================================
    // 22. DELETE CONTENT
    // ========================================================

    function deleteContent(id) {

        const item =
            contents.find(
                content => content.id === id
            );


        if (!item) return;


        const confirmed =
            confirm(
                `Are you sure you want to delete "${item.title}"?`
            );


        if (!confirmed) return;


        contents =
            contents.filter(
                content => content.id !== id
            );


        saveContents();

        renderContentTable();


        showToast(
            "Content Deleted",
            `"${item.title}" has been removed.`
        );

    }


    // ========================================================
    // 23. GLOBAL SEARCH
    // ========================================================

    if (globalSearch) {

        globalSearch.addEventListener(
            "input",
            () => {

                const query =
                    globalSearch.value
                        .trim()
                        .toLowerCase();


                if (!query) return;


                const matchingContent =
                    contents.find(
                        item =>
                            item.title
                                .toLowerCase()
                                .includes(query)
                    );


                if (matchingContent) {

                    showToast(
                        "Content Found",
                        matchingContent.title
                    );

                }

            }
        );


        // Ctrl + K

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.ctrlKey &&
                    event.key.toLowerCase() === "k"
                ) {

                    event.preventDefault();

                    globalSearch.focus();

                }

            }
        );

    }


    // ========================================================
    // 24. NOTIFICATION BUTTON
    // ========================================================

    const notificationButton =
        document.getElementById(
            "notificationButton"
        );


    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            () => {

                const reviewCount =
                    contents.filter(
                        item =>
                            item.status ===
                            "In Review"
                    ).length;


                showToast(
                    "Notifications",
                    `${reviewCount} content item(s) waiting for review.`
                );

            }
        );

    }


    // ========================================================
    // 25. PERFORMANCE FILTER
    // ========================================================

    const performanceFilter =
        document.getElementById(
            "performanceFilter"
        );


    if (performanceFilter) {

        performanceFilter.addEventListener(
            "change",
            () => {

                showToast(
                    "Chart Updated",
                    `Showing ${performanceFilter.value}.`
                );

            }
        );

    }


    // ========================================================
    // 26. SETTINGS BUTTONS
    // ========================================================

    document.querySelectorAll(
        ".settings-option"
    ).forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                document.querySelectorAll(
                    ".settings-option"
                ).forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                showToast(
                    "Settings",
                    `${button.textContent.trim()} settings selected.`
                );

            }
        );

    });


    // ========================================================
    // 27. SAVE SETTINGS DEMO
    // ========================================================

    document.querySelectorAll(
        ".primary-button"
    ).forEach((button) => {

        if (
            button.textContent.includes(
                "Save Changes"
            )
        ) {

            button.addEventListener(
                "click",
                () => {

                    showToast(
                        "Settings Saved",
                        "Your CMS settings have been updated."
                    );

                }
            );

        }

    });


    // ========================================================
    // 28. TOAST SYSTEM
    // ========================================================

    const toast =
        document.getElementById("toast");

    const toastTitle =
        document.getElementById("toastTitle");

    const toastMessage =
        document.getElementById("toastMessage");

    const closeToast =
        document.getElementById("closeToast");


    let toastTimer;


    function showToast(
        title,
        message
    ) {

        if (
            !toast ||
            !toastTitle ||
            !toastMessage
        ) {
            return;
        }


        toastTitle.textContent =
            title;

        toastMessage.textContent =
            message;


        toast.classList.add(
            "show"
        );


        clearTimeout(
            toastTimer
        );


        toastTimer =
            setTimeout(
                () => {

                    toast.classList.remove(
                        "show"
                    );

                },
                3500
            );

    }


    if (closeToast) {

        closeToast.addEventListener(
            "click",
            () => {

                toast.classList.remove(
                    "show"
                );

            }
        );

    }


    // ========================================================
    // 29. PROFILE CLICK
    // ========================================================

    const profileDropdown =
        document.querySelector(
            ".profile-dropdown"
        );


    if (profileDropdown) {

        profileDropdown.addEventListener(
            "click",
            () => {

                showToast(
                    "Administrator",
                    "Logged in as Arjeet Sharma."
                );

            }
        );

    }


    // ========================================================
    // 30. INITIALIZE APPLICATION
    // ========================================================

    loadContents();

    renderContentTable();

    updateContentCounters();


    console.log(
        "CampusFlow CMS loaded successfully."
    );

}

export default initCampusFlow;
