const { Category } = require('../models');

class CategoryService {
    addCategory = async (categoryName) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!categoryName || categoryName.trim().length === 0) {
                    return reject({ code: 400, error: "Tên thể loại không được để trống" });
                }

                const category = await Category.create({ CategoryName: categoryName });

                resolve(category);
            } catch (error) {
                reject({ code: 500, error: "Internal Server Error", details: error.message });
            }
        });
    }

    updateCategory = async (categoryId, categoryName) => {
        return new Promise(async (resolve, reject) => {
            try {
                
                const category = await Category.findByPk(categoryId);
                if (!category) {
                    return reject({ code: 404, error: "Thể loại không tồn tại" });
                }

                if (!categoryName || categoryName.trim().length === 0) {
                    return reject({ code: 400, error: "Tên thể loại không được để trống" });
                }

                await category.update({ CategoryName: categoryName });

                resolve(category);
            } catch (error) {
                reject({ code: 500, error: "Internal Server Error", details: error.message });
            }
        });
    }

    getCategories = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await Category.findAll());
            } catch (error) {
                reject({ code: 500, error: "Internal Server Error", details: error.message });
            }
        });
    }

    getCategoryById = async (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id || isNaN(id)) {
                    return reject({ code: 400, error: "ID không hợp lệ" });
                }
                
                const category = await Category.findByPk(id);
                if (!category) {
                    return reject({ code: 404, error: "Thể loại không tồn tại" });
                }

                return resolve(category);

            } catch (error) {
                reject({ code: 500, error: "Internal Server Error", details: error.message });
            }
        });
    }

    deleteCategory = async (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id || isNaN(id)) {
                    return reject({ code: 400, error: "ID không hợp lệ" });
                }

                const category = await Category.findByPk(id);
                if (!category) {
                    return reject({ code: 404, error: "Thể loại không tồn tại" });
                }

                await category.destroy();

                resolve();
            } catch (error) {
                reject({ code: 500, error: "Lỗi khi xóa thể loại", details: error.message });
            }
        });
    }
}

module.exports = new CategoryService();