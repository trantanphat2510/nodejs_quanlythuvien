const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/api/categoryController');

router.post('/', categoryController.addCategory);
router.get('/', categoryController.getCategories);
router.put('/', categoryController.updateCategory);
router.get('/:id', categoryController.getCategoryById);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;