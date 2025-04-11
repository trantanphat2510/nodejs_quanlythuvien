const { getUsers, renderBooksPage, renderBookDetail,renderBookRecord, renderFullTextSearch, renderCart} = require('../controllers/homeController')
const express = require('express');
const router = express.Router();
const { register, login, getUserSession, requireAuth} = require("../controllers/authController");
const { renderDashboard, renderDashboardBook, renderDashboardMember, renderAddBook, renderEditBook, renderBorrowings, renderAddBorrowing, renderBorrowingDetail, renderPenalties, renderCategories } = require('../controllers/adminController');
const IsAdmin = require('../middlewares/IsAdmin');


router.use('/api', require('./api'));
  
  router.get("/", (req, res) => {
    res.render("homepage.ejs", { user: req.session.user || null });
  });
  
  router.get('/dashboard' ,renderDashboard);
  router.get('/dashboard/book' , renderDashboardBook);
  router.get('/dashboard/member' , renderDashboardMember);
  router.get('/dashboard/borrowings' , renderBorrowings);
  router.get('/dashboard/book/add', renderAddBook);
  router.get('/dashboard/book/edit/:id', renderEditBook);
  router.get('/books', renderBooksPage);
  router.get('/books/search', renderFullTextSearch);
  router.get('/books/:id', renderBookDetail);
  router.get('/borrowrecords', renderBookRecord);
  router.get('/dashboard/borrowings/add', renderAddBorrowing);
  router.get('/dashboard/borrowings/:id', renderBorrowingDetail);
  router.get('/dashboard/penalties', renderPenalties);
  router.get('/dashboard/categories', renderCategories);
  router.get('/cart', renderCart);

  router.post("/login", login);
  router.get("/login", requireAuth, (req, res) => { 
    if (req.session.user) {
      return res.redirect("/"); 
    }
    res.render("login");
  });
  
  router.post("/register", register);
  router.get('/register', (req, res) => {
    res.render('register.ejs')
  });
  router.get("/getUserSession",  (req, res) => {
    res.json({
        user: req.user
    });
});
  
  router.get("/logout-confirm", (req, res) => {
    res.render("logout");
  });
  router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Không thể đăng xuất!" });
        }
        res.redirect("/login");
    });
  });

  router.get("/get-user", (req, res) => {
    if (req.session.user) {
      return res.json({ user: req.session.user });
    } else {
      return res.status(401).json({ error: "Người dùng chưa đăng nhập!" });
    }
  });

module.exports = router;