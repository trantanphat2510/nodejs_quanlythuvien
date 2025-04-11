module.exports = (sequelize, DataTypes) => {
  const RecordDetail = sequelize.define("RecordDetail", {
    Quantity: {
      type: DataTypes.INTEGER
    },
    Price: {
      type: DataTypes.FLOAT
    }
  }, {
    tableName: "recorddetails",
    timestamps: false
  });

  return RecordDetail;
};
