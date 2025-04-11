const db = require('./src/models');

async function syncDatabase() {
  try {
    await db.sequelize.sync({ force: true }); // `force: true` sẽ xóa và tạo lại bảng
    console.log("✅ Database & tables created successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error syncing database:", error);
    process.exit(1);
  }
}

syncDatabase();
