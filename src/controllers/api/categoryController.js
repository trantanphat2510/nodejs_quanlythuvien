const CategoryService = require('../../services/CategoryServices');

class CategoryController{
    addCategory = (req, res) => {
        let { categoryName } = req.body;
        CategoryService.addCategory(categoryName)
            .then(category => res.status(200).json(category))
            .catch(error => res.status(error.code).json({error : error.error}));
    }

    getCategories = (req, res) => {
        CategoryService.getCategories()
            .then(categories => res.status(200).json(categories))
            .catch(error => res.status(error.code).json({error : error.error}));
    }

    updateCategory = (req, res) => {
        let { categoryId, categoryName } = req.body;
        CategoryService.updateCategory(categoryId, categoryName)
            .then(category => res.status(200).json(category))
            .catch(error => res.status(error.code).json({error : error.error}));
    }

    getCategoryById = (req, res) => {
        let { id } = req.params;
        CategoryService.getCategoryById(id)
            .then(category => res.status(200).json(category))
            .catch(error => res.status(error.code).json({error : error.error}));
    }

    deleteCategory = (req, res) => {
        let { id } = req.params;
        CategoryService.deleteCategory(id)
            .then(() => res.status(200).json({message: "Đã xóa thể loại"}))
            .catch(error => res.status(error.code).json({error : error.error}));
    }
}

module.exports = new CategoryController();