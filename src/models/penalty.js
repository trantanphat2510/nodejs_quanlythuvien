module.exports = (sequelize, DataTypes) => {
  const Penalty = sequelize.define("Penalty", {
    PenaltyId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Amount: {
      type: DataTypes.FLOAT
    },
    Reason: {
      type: DataTypes.STRING
    },
    Status: {
      type: DataTypes.STRING
    }
  }, {
    tableName: "penalties",
    timestamps: false
  });

  return Penalty;
};
