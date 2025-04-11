const { Sequelize } = require('sequelize');
const config = require('./config.json').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  port: config.port,
  dialectOptions: config.dialectOptions,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
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
