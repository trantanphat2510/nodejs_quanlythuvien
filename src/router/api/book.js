const express = require('express');
const bookController = require('../../controllers/api/bookController');
const IsAdmin = require('../../middlewares/IsAdmin');
const router = express.Router();

router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);
router.post('/', IsAdmin, bookController.addBook);
router.put('/:id', IsAdmin, bookController.updateBook);
router.get('/image/:imageName', bookController.getBookImage);
router.get('/file/:fileName', bookController.getBookFile);
router.delete('/:id', IsAdmin, bookController.deleteBook);

module.exports = router;