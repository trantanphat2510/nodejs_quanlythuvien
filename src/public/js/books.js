
// Book data
var booksData = [];
let currentPage = 1;
const booksPerPage = 4; 

const renderCategory = () => {
    fetch('/api/category')
        .then(res => res.json())
        .then(categories => {
            let categoriesHTML = Array.from(categories).map(category => {
                return `<div class="filter-option">
                            <input type="checkbox" id="${category.CategoryName}" class="category-filter">
                            <label for="${category.CategoryName}">${category.CategoryName}</label>
                        </div>`;
            });
            
            document.getElementById('category-options').innerHTML = categoriesHTML.join(' ');
        })
        .catch(error => console.log(error));
}

const renderBook = () => {
    fetch('/api/book')
        .then(res => res.json())
        .then(books => {
            booksData = books.map(book => ({
                id: book.BookId,
                title: book.Title,
                author: book.Author,
                coverImage: book.Image,
                category: book.Categories.map(category => category.CategoryName).join(', '),
                year: book.Year,
                available: book.Stock > 0,
                description: book.Title
            }));

            currentPage = 1;
            applyFiltersAndSort();
        })
        .catch(error => console.log(error));
};

renderCategory();
renderBook();

// DOM Elements
const booksContainer = document.getElementById('books-container');
const filterToggle = document.getElementById('filter-toggle');
const filtersPanel = document.getElementById('filters-panel');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const resultsNumber = document.getElementById('results-number');
const clearFiltersBtn = document.getElementById('clear-filters');
const applyFiltersBtn = document.getElementById('apply-filters');

// State
let currentView = 'grid';
let currentSort = 'newest';
let searchQuery = '';
let activeFilters = {
    categories: [],
    availability: [],
    years: [],
    ratings: []
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderBooks(booksData);
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Toggle filters panel
    filterToggle.addEventListener('click', () => {
        filtersPanel.classList.toggle('active');
        const icon = filterToggle.querySelector('.fa-chevron-down, .fa-chevron-up');
        if (icon.classList.contains('fa-chevron-down')) {
            icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
        } else {
            icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
        }
    });

    // View mode toggle
    gridViewBtn.addEventListener('click', () => {
        setViewMode('grid');
    });

    listViewBtn.addEventListener('click', () => {
        setViewMode('list');
    });

    // Search input
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        applyFiltersAndSort();
    });

    // Sort select
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        applyFiltersAndSort();
    });

    // Filter checkboxes
    document.querySelectorAll('.category-filter').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            collectActiveFilters();
        });
    });

    document.querySelectorAll('.availability-filter').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            collectActiveFilters();
        });
    });

    document.querySelectorAll('.year-filter').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            collectActiveFilters();
        });
    });

    document.querySelectorAll('.rating-filter').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            collectActiveFilters();
        });
    });

    // Clear filters
    clearFiltersBtn.addEventListener('click', () => {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        activeFilters = {
            categories: [],
            availability: [],
            years: [],
            ratings: []
        };
        applyFiltersAndSort();
    });

    // Apply filters
    applyFiltersBtn.addEventListener('click', () => {
        collectActiveFilters();
        applyFiltersAndSort();
    });
}

// Collect active filters from checkboxes
function collectActiveFilters() {
    // Categories
    activeFilters.categories = [];
    document.querySelectorAll('.category-filter:checked').forEach(checkbox => {
        activeFilters.categories.push(checkbox.id);
    });

    // Availability
    activeFilters.availability = [];
    document.querySelectorAll('.availability-filter:checked').forEach(checkbox => {
        activeFilters.availability.push(checkbox.id);
    });

    // Years
    activeFilters.years = [];
    document.querySelectorAll('.year-filter:checked').forEach(checkbox => {
        activeFilters.years.push(checkbox.id.replace('year-', ''));
    });

    // Ratings
    activeFilters.ratings = [];
    document.querySelectorAll('.rating-filter:checked').forEach(checkbox => {
        activeFilters.ratings.push(checkbox.id.replace('rating-', ''));
    });
}

function applyFiltersAndSort() {
    let filteredBooks = booksData;

    // Apply search query
    if (searchQuery) {
        filteredBooks = filteredBooks.filter(book =>
            book.title.toLowerCase().includes(searchQuery) ||
            book.author.toLowerCase().includes(searchQuery) ||
            book.category.toLowerCase().includes(searchQuery)
        );
    }

    // Apply category filters
    if (activeFilters.categories.length > 0) {
        filteredBooks = filteredBooks.filter(book => 
            book.category.split(', ').some(cat => activeFilters.categories.includes(cat))
        );
    }

    // Apply availability filters
    if (activeFilters.availability.length > 0) {
        if (activeFilters.availability.includes('available') && !activeFilters.availability.includes('all-books')) {
            filteredBooks = filteredBooks.filter(book => book.available);
        }
    }

    // Apply year filters
    if (activeFilters.years.length > 0) {
        filteredBooks = filteredBooks.filter(book => {
            if (activeFilters.years.includes('earlier')) {
                return activeFilters.years.includes(book.year.toString()) || book.year < 2020;
            }
            return activeFilters.years.includes(book.year.toString());
        });
    }

    // Apply rating filters
    if (activeFilters.ratings.length > 0) {
        filteredBooks = filteredBooks.filter(book => {
            if (activeFilters.ratings.includes('4')) {
                return book.rating >= 4;
            } else if (activeFilters.ratings.includes('3')) {
                return book.rating >= 3;
            } else if (activeFilters.ratings.includes('2')) {
                return book.rating >= 2;
            }
            return true;
        });
    }

    // Apply sorting
    switch (currentSort) {
        case 'newest':
            filteredBooks.sort((a, b) => b.year - a.year);
            break;
        case 'oldest':
            filteredBooks.sort((a, b) => a.year - b.year);
            break;
        case 'a-z':
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'z-a':
            filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'rating':
            filteredBooks.sort((a, b) => b.rating - a.rating);
            break;
    }

    // Update results count
    resultsNumber.textContent = filteredBooks.length;

    // Render pagination
    renderPagination(filteredBooks.length);

    // Get current page books
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

    // Render filtered books for current page
    renderBooks(currentBooks);
}

function renderPagination(totalBooks) {
    const pageCount = Math.ceil(totalBooks / booksPerPage);
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';

    if (pageCount <= 1) return;

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.classList.add('pagination-btn');
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            applyFiltersAndSort();
        }
    });
    paginationContainer.appendChild(prevButton);

    const maxVisiblePages = 5; 
    let startPage, endPage;

    if (pageCount <= maxVisiblePages) {
        startPage = 1;
        endPage = pageCount;
    } else {
        const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
        const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;
        
        if (currentPage <= maxPagesBeforeCurrent) {
            startPage = 1;
            endPage = maxVisiblePages;
        } else if (currentPage + maxPagesAfterCurrent >= pageCount) {
            startPage = pageCount - maxVisiblePages + 1;
            endPage = pageCount;
        } else {
            startPage = currentPage - maxPagesBeforeCurrent;
            endPage = currentPage + maxPagesAfterCurrent;
        }
    }

    // Nút trang đầu tiên
    if (startPage > 1) {
        const firstPageButton = document.createElement('button');
        firstPageButton.textContent = '1';
        firstPageButton.classList.add('pagination-btn');
        firstPageButton.addEventListener('click', () => {
            currentPage = 1;
            applyFiltersAndSort();
        });
        paginationContainer.appendChild(firstPageButton);

        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.classList.add('pagination-ellipsis');
            paginationContainer.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('pagination-btn');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            applyFiltersAndSort();
        });
        paginationContainer.appendChild(pageButton);
    }

    if (endPage < pageCount) {
        if (endPage < pageCount - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.classList.add('pagination-ellipsis');
            paginationContainer.appendChild(ellipsis);
        }

        const lastPageButton = document.createElement('button');
        lastPageButton.textContent = pageCount;
        lastPageButton.classList.add('pagination-btn');
        lastPageButton.addEventListener('click', () => {
            currentPage = pageCount;
            applyFiltersAndSort();
        });
        paginationContainer.appendChild(lastPageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.classList.add('pagination-btn');
    nextButton.disabled = currentPage === pageCount;
    nextButton.addEventListener('click', () => {
        if (currentPage < pageCount) {
            currentPage++;
            applyFiltersAndSort();
        }
    });
    paginationContainer.appendChild(nextButton);
}

function setViewMode(mode) {
    currentView = mode;

    if (mode === 'grid') {
        booksContainer.className = 'books-grid';
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    } else {
        booksContainer.className = 'books-list';
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    }

    // Re-render with current data
    applyFiltersAndSort();
}

// Render books
function renderBooks(books) {
    booksContainer.innerHTML = '';

    if (books.length === 0) {
        booksContainer.innerHTML = `
            <div class="no-results">
                <h3>No books found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }

    if (currentView === 'grid') {
        books.forEach(book => {
            booksContainer.appendChild(createBookCard(book));
        });
    } else {
        books.forEach(book => {
            booksContainer.appendChild(createBookListItem(book));
        });
    }
}

// Create book card for grid view
function createBookCard(book) {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';

    bookCard.innerHTML = `
        <div class="book-cover">
            <img src="/${book.coverImage}" alt="${book.title}">
            <div class="book-badge ${book.available ? 'badge-available' : 'badge-unavailable'}">
                ${book.available ? 'Available' : 'Unavailable'}
            </div>
        </div>
        <div class="book-details">
            <div class="book-meta">
                <span class="book-category">${book.category}</span>
            </div>
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">by ${book.author}</p>
            <p class="book-year">Published: ${book.year}</p>
            <div class="book-actions">
                <a href="/books/${book.id}" class="btn btn-outline">Details</a>
                <button class="btn btn-primary borrow-btn" data-id="${book.id}" ${!book.available ? 'disabled' : ''}>
                    ${book.available ? 'Borrow' : 'Reserve'}
                </button>
            </div>
        </div>
    `;

    return bookCard;
}

// Create book list item for list view
function createBookListItem(book) {
    const bookListItem = document.createElement('div');
    bookListItem.className = 'book-list-item';

    bookListItem.innerHTML = `
        <div class="book-list-cover">
            <img src="${book.coverImage}" alt="${book.title}">
        </div>
        <div class="book-list-details">
            <div class="book-list-meta">
                <span class="book-category">${book.category}</span>
                <div class="book-badge ${book.available ? 'badge-available' : 'badge-unavailable'}">
                    ${book.available ? 'Available' : 'Unavailable'}
                </div>
            </div>
            <h3 class="book-list-title">${book.title}</h3>
            <p class="book-author">by ${book.author}</p>
            <p class="book-year">Published: ${book.year}</p>
            <p class="book-list-description">${book.description}</p>
            <div class="book-list-actions">
                <button class="btn btn-outline">Details</button>
                <button class="btn btn-primary borrow-btn" data-id="${book.id}" ${!book.available ? 'disabled' : ''}>
                    ${book.available ? 'Borrow' : 'Reserve'}
                </button>
            </div>
        </div>
    `;

    return bookListItem;
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('borrow-btn')) {
        const bookId = parseInt(e.target.getAttribute('data-id'));
        addToCart(bookId);
    }
});

function addToCart(bookId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item[0] === bookId);

    if (index > -1) {
        cart[index][1] += 1;
    } else {
        cart.push([bookId, 1]);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Book added to cart!');
}
