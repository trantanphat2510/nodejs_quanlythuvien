module.exports = (sequelize, DataTypes) => {
  const BorrowRecord = sequelize.define("BorrowRecord", {
    RecordId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    BorrowDate: {
      type: DataTypes.DATE
    },
    ReturnDate: {
      type: DataTypes.DATE
    },
    Status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    }
  }, {
    tableName: "borrowrecords",
    timestamps: false
  });

  return BorrowRecord;
};
