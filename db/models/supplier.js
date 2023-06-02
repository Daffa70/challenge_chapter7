"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Supplier.belongsToMany(models.Component, {
        through: models.ComponentSupplier,
        foreignKey: "supplier_id",
      });
    }
  }
  Supplier.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Supplier",
    }
  );
  return Supplier;
};
