module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define("Book", {
    BookId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Author: {
      type: DataTypes.STRING
    },
    Publisher: {
      type: DataTypes.STRING
    },
    Year: {
      type: DataTypes.INTEGER
    },
    Status: {
      type: DataTypes.STRING
    },
    Price: {
      type: DataTypes.FLOAT
    },
    File: {
      type: DataTypes.STRING
    },
    Image: {
      type: DataTypes.STRING
    },
    FullContent: {
      type: DataTypes.TEXT
    },
    Stock: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: "books",
    timestamps: false
  });

  return Book;
};
