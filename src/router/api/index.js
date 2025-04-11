const express = require('express');
const router = express.Router();

router.use('/user', require('./user'));
router.use('/category', require('./category'));
router.use('/book', require('./book'));
router.use("/borrowrecords",require('./BorrowRecordRouter'));
router.use('/penalty', require('./penalty'));

module.exports = router;
