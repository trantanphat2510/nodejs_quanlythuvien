const upload = require("../../middlewares/uploadService");
const BookService = require("../../services/BookService");
const path = require('path');

class BookController{

    getBooks = (req, res) => {
        BookService.getBooks()
            .then(books => res.status(200).json(books))
            .catch(error => res.status(error.code).json({error : error.error}));
    }

    addBook = (req, res) => {
        upload(req, res, (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            if (!req.files || !req.files['image'] || !req.files['file']) {
                return res.status(400).json({ error: 'Cần tải lên cả file ảnh và file PDF.' });
            }
            let {title, author, publisher, year, status, price, stock, categoryIds} = req.body;
            BookService.addBook(title, author, publisher, year, status, price, stock, categoryIds, req.files['image'][0].filename, req.files['file'][0].filename)
                .then(book => res.status(200).json(book))
                .catch(error => res.status(error.code).json({error : error.error}));
        })
    }

    updateBook = (req, res) => {
        upload(req, res, (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            let { id } = req.params;
            let {title, author, publisher, year, status, price, stock, categoryIds} = req.body;
            BookService.updateBook(id, title, author, publisher, year, status[1], price, stock, categoryIds, req.files['image'] ? req.files['image'][0].filename : null, req.files['file'] ? req.files['file'][0].filename : null)
                .then(book => res.status(200).json(book))
                .catch(error => res.status(error.code).json({error : error.error}));
        })
    }

    getBookImage = (req, res) => {
        const { imageName } = req.params; 
        const imagePath = path.join(__dirname, "../../public/uploads", imageName);

        res.sendFile(imagePath, (err) => {
            if (err) {
                res.status(404).json({ error: "Hình ảnh không tồn tại" });
            }
        });
    }

    getBookFile = (req, res) => {
        const { fileName } = req.params;
        const filePath = path.join(__dirname, "../../public/uploads", fileName);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${fileName}"`); 
        res.sendFile(filePath, (err) => {
            if (err) {
                res.status(404).json({ error: "Không tìm thấy file." });
            }
        });
    };

    deleteBook = (req, res) => {
        const { id } = req.params;
        BookService.deleteBook(id)
            .then(book => res.status(200).json({message: 'Xóa thành công'}))
            .catch(error => res.status(error.code).json({error : error.error}));
    }

    getBookById = (req, res) => {
        const { id } = req.params;
        BookService.getBookById(id)
            .then(book => res.status(200).json(book))
            .catch(error => res.status(error.code).json({error : error.error}));
    }
    
}

module.exports = new BookController();