const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const db = { sequelize };

db.User = require('./user')(sequelize, DataTypes);
db.Role = require('./role')(sequelize, DataTypes);
db.Book = require('./book')(sequelize, DataTypes);
db.Category = require('./categories')(sequelize, DataTypes);
db.BookCategory = require('./bookCategory')(sequelize, DataTypes);
db.   BorrowRecord = require('./borrowRecord')(sequelize, DataTypes);
db.RecordDetail = require('./recordDetail')(sequelize, DataTypes);
db.Penalty = require('./penalty')(sequelize, DataTypes);

// Thiết lập quan hệ
db.User.belongsTo(db.Role, { foreignKey: 'RoleId' });
db.Role.hasMany(db.User, { foreignKey: 'RoleId' });

db.User.hasMany(db.BorrowRecord, { foreignKey: 'UserId' });
db.BorrowRecord.belongsTo(db.User, { foreignKey: 'UserId' });

db.Book.belongsToMany(db.Category, { through: db.BookCategory });
db.Category.belongsToMany(db.Book, { through: db.BookCategory });

db.BorrowRecord.hasMany(db.RecordDetail);
db.RecordDetail.belongsTo(db.BorrowRecord);

db.Book.hasMany(db.RecordDetail);
db.RecordDetail.belongsTo(db.Book);

db.User.hasMany(db.Penalty);
db.Penalty.belongsTo(db.User);

db.BorrowRecord.hasMany(db.Penalty);
db.Penalty.belongsTo(db.BorrowRecord);

module.exports = db;
