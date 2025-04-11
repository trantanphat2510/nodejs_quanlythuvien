module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    UserId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    CardNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: "users",
    timestamps: false
  });

  return User;
};
