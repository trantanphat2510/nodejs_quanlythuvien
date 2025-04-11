module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define("Role", {
    RoleId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    RoleName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: "roles",
    timestamps: false
  });

  return Role;
};
