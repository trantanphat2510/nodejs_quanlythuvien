const renderDashboard = (req, res) => {
    res.render('admin/index.ejs');
}

const renderDashboardBook = (req, res) => {
    res.render('admin/books.ejs');
}

const renderDashboardMember = (req, res) => {
    res.render('admin/members.ejs');
}

const renderAddBook = (req, res) => {
    res.render('admin/addBook.ejs');
}

const renderEditBook = (req, res) => {
    res.render('admin/editBook.ejs');
}

const renderBorrowings = (req, res) => {
    res.render('admin/borrowings.ejs');
}

const renderAddBorrowing = (req, res) => {
    res.render('admin/addRecord.ejs');
}

const renderBorrowingDetail = (req, res) => {
    res.render('admin/recordDetail.ejs');
}

const renderPenalties = (req, res) => {
    res.render('admin/penalties.ejs');
}

const renderCategories = (req, res) => {
    res.render('admin/categories.ejs');
}

module.exports = {
    renderDashboard,
    renderDashboardBook, 
    renderDashboardMember, 
    renderAddBook, 
    renderEditBook, 
    renderBorrowings, 
    renderAddBorrowing,
    renderBorrowingDetail,
    renderPenalties,
    renderCategories
};