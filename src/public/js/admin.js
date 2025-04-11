document.addEventListener('DOMContentLoaded', function () {
    // Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebar = document.getElementById('sidebar');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
        });
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', function () {
            sidebar.classList.remove('active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function (event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        //const isClickOnToggle = sidebarToggle.contains(event.target);

        if (!isClickInsideSidebar && window.innerWidth < 992) {//!isClickOnToggle &&
            sidebar.classList.remove('active');
        }
    });

    // Dropdown functionality
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            const dropdown = this.closest('.dropdown');
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');

            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdownMenu) {
                    menu.style.display = 'none';
                }
            });

            // Toggle current dropdown
            if (dropdownMenu.style.display === 'block') {
                dropdownMenu.style.display = 'none';
            } else {
                dropdownMenu.style.display = 'block';
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function () {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    });

    // Prevent dropdown menu clicks from closing the dropdown
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

    // Responsive table handling
    const tables = document.querySelectorAll('.table');
    tables.forEach(table => {
        if (table.offsetWidth > table.parentElement.offsetWidth) {
            table.parentElement.classList.add('table-responsive');
        }
    });

    // Add active class to current page in sidebar
    const currentPage = window.location.pathname.split('/').pop();
    const sidebarLinks = document.querySelectorAll('.sidebar-menu-item a');

    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.parentElement.classList.add('active');
        }
    });
});


