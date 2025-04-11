module.exports = (sequelize, DataTypes) => {
  const BookCategory = sequelize.define("BookCategory", {}, {
    tableName: "bookcategories",
    timestamps: false
  });

  return BookCategory;
};
