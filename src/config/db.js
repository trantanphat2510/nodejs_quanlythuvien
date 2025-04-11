const { Sequelize } = require('sequelize');
const config = require('./config.json').development;

// Tạo kết nối Sequelize với cấu hình từ `config.json`
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  dialectOptions: {
    connectTimeout: 60000 // Tăng timeout để tránh lỗi kết nối chậm
  },
  pool: {
    max: 10, // Giới hạn số kết nối tối đa
    min: 0,
    acquire: 30000, // Thời gian tối đa để lấy kết nối
    idle: 10000 // Thời gian chờ trước khi giải phóng kết nối
  },
  logging: false // Tắt log SQL (nếu cần debug thì đổi thành `console.log`)
});

// Kiểm tra kết nối
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(' Kết nối MySQL thành công!');
  } catch (error) {
    console.error(' Lỗi kết nối MySQL:', error);
  }
}

// Gọi kiểm tra kết nối khi khởi động server
testConnection();

module.exports = sequelize;
