const { BorrowRecord, Book, User, sequelize, RecordDetail } = require('../models');

class BorrowRecordService {
    addRecord = (BorrowDate, ReturnDate, Status, UserId, Arr) => {
        return new Promise(async (resolve, reject) => {
            try {
                const now = new Date();

                const borrowDate = new Date(BorrowDate);
                const returnDate = new Date(ReturnDate);

                if (borrowDate < now) {
                    return reject({ code: 400, error: "Ngày mượn không thể bé hơn ngày hiện tại" });
                }

                if (returnDate < now) {
                    return reject({ code: 400, error: "Ngày trả không thể bé hơn ngày hiện tại" });
                }

                if (!Array.isArray(Arr) || Arr.length === 0) {
                    return reject({ code: 400, error: "Arr phải là mảng và chứa ít nhất một phần tử" });
                }

                const result = await sequelize.transaction(async (t) => {
                    const borrowRecord = await BorrowRecord.create({
                        BorrowDate,
                        ReturnDate,
                        Status,
                        UserId
                    }, { transaction: t });

                    for (const [bookId, quantity] of Arr) {
                        const book = await Book.findByPk(bookId, { transaction: t });

                        if (!book) {
                            return reject({ code: 404, error: `Không tìm thấy sách với ID: ${bookId}` });
                        }

                        if (book.Stock < quantity) {
                            return reject({ code: 400, error: `Sách "${book.Title}" không đủ số lượng. Hiện có: ${book.Stock}, yêu cầu: ${quantity}` });
                        }

                        const price = book.Price * quantity;

                        await RecordDetail.create({
                            Quantity: quantity,
                            Price: price,
                            BorrowRecordRecordId: borrowRecord.RecordId,
                            BookBookId: bookId
                        }, { transaction: t });

                        book.Stock -= quantity;
                        await book.save({ transaction: t });
                    }

                    const fullBorrowRecord = await BorrowRecord.findOne({
                        where: { RecordId: borrowRecord.RecordId },
                        include: [
                            {
                                model: RecordDetail,
                                include: [Book]
                            }
                        ],
                        transaction: t
                    });

                    return fullBorrowRecord;
                });

                return resolve(result);
            } catch (error) {
                console.log(error);
                return reject({ code: 500, error: "Lỗi server", details: error.message });
            }
        });
    }

    getAll = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const records = await BorrowRecord.findAll({
                    include: [
                        {
                            model: RecordDetail,
                            include: [Book]
                        },
                        {
                            model: User,
                            attributes: ['UserId', 'Username', 'Email']
                        }
                    ],
                    order: [['BorrowDate', 'DESC']]
                });

                resolve(records);
            } catch (error) {
                console.log(error);
                reject({ code: 500, error: 'Lỗi server', details: error.message });
            }
        });
    }

    deleteRecord = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id || isNaN(id)) {
                    return reject({ code: 400, error: "ID không hợp lệ" });
                }

                const result = await sequelize.transaction(async (t) => {
                    // Tìm bản ghi mượn
                    const borrowRecord = await BorrowRecord.findOne({
                        where: { RecordId: id },
                        include: [RecordDetail],
                        transaction: t
                    });

                    if (!borrowRecord) {
                        return reject({ code: 404, error: "Không tìm thấy bản ghi mượn" });
                    }

                    if (borrowRecord.Status !== "PENDING") {
                        return reject({ code: 403, error: "Chỉ có thể xóa các bản ghi có trạng thái PENDING" });
                    }

                    // Hoàn trả sách
                    for (const detail of borrowRecord.RecordDetails) {
                        const book = await Book.findByPk(detail.BookBookId, { transaction: t });

                        if (!book) {
                            return reject({ code: 404, error: `Không tìm thấy sách với ID: ${detail.BookBookId}` });
                        }

                        book.Stock += detail.Quantity;
                        await book.save({ transaction: t });
                    }

                    // Xóa RecordDetails
                    await RecordDetail.destroy({
                        where: { BorrowRecordRecordId: id },
                        transaction: t
                    });

                    // Xóa BorrowRecord
                    await BorrowRecord.destroy({
                        where: { RecordId: id },
                        transaction: t
                    });

                    return { message: "Xóa bản ghi thành công và hoàn trả sách về kho" };
                });

                return resolve(result);
            } catch (error) {
                console.error(error);
                return reject({ code: 500, error: "Lỗi server", details: error.message });
            }
        });
    }

    getRecordById = (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id || isNaN(id)) {
                    return reject({ code: 400, error: "ID không hợp lệ" });
                }

                const record = await BorrowRecord.findOne({
                    where: { RecordId: id },
                    include: [
                        {
                            model: RecordDetail,
                            include: [Book]
                        },
                        {
                            model: User,
                            attributes: ['UserId', 'Username', 'Email']
                        }
                    ]
                });

                if (!record) {
                    return reject({ code: 404, error: "Không tìm thấy bản ghi mượn" });
                }

                return resolve(record);
            } catch (error) {
                console.error(error);
                return reject({ code: 500, error: "Lỗi server", details: error.message });
            }
        });
    }

    updateStatus = (RecordId, Status) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!RecordId || isNaN(RecordId)) {
                    return reject({ code: 400, error: "ID không hợp lệ" });
                }

                const validStatuses = ["PENDING", "BORROWING", "DONE"];
                if (!validStatuses.includes(Status)) {
                    return reject({ code: 400, error: `Trạng thái không hợp lệ. Các trạng thái hợp lệ: ${validStatuses.join(', ')}` });
                }

                const result = await sequelize.transaction(async (t) => {
                    const record = await BorrowRecord.findOne({
                        where: { RecordId },
                        include: [RecordDetail],
                        transaction: t
                    });

                    if (!record) {
                        return reject({ code: 404, error: "Không tìm thấy bản ghi mượn" });
                    }

                    // Nếu chuyển sang DONE thì hoàn trả sách về kho
                    if (Status === "DONE") {
                        for (const detail of record.RecordDetails) {
                            const book = await Book.findByPk(detail.BookBookId, { transaction: t });

                            if (!book) {
                                return reject({ code: 404, error: `Không tìm thấy sách với ID: ${detail.BookBookId}` });
                            }

                            book.Stock += detail.Quantity;
                            await book.save({ transaction: t });
                        }
                    }

                    // Cập nhật trạng thái
                    record.Status = Status;
                    await record.save({ transaction: t });

                    // Trả về record đầy đủ thông tin sau khi cập nhật
                    const updatedRecord = await BorrowRecord.findOne({
                        where: { RecordId },
                        include: [
                            {
                                model: RecordDetail,
                                include: [Book]
                            },
                            {
                                model: User,
                                attributes: ['UserId', 'Username', 'Email']
                            }
                        ],
                        transaction: t
                    });

                    return updatedRecord;
                });

                return resolve({ message: "Cập nhật trạng thái thành công", data: result });

            } catch (error) {
                console.log(error);
                reject({ code: 500, error: 'Lỗi server', details: error.message });
            }
        });
    }



    getRecordsByStatus = (status) => {
        return new Promise(async (resolve, reject) => {
            try {
                const records = await BorrowRecord.findAll({
                    where: { Status: status },
                    include: [
                        {
                            model: RecordDetail,
                            include: [Book]
                        },
                        {
                            model: User,
                            attributes: ['UserId', 'Username', 'Email']
                        }
                    ],
                    order: [['BorrowDate', 'DESC']]
                });

                resolve(records);
            } catch (error) {
                console.log(error);
                reject({ code: 500, error: 'Lỗi server', details: error.message });
            }
        });
    }
}

module.exports = new BorrowRecordService();
