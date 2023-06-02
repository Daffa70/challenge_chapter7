"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Component extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Component.belongsToMany(models.Supplier, {
        through: models.ComponentSupplier,
        foreignKey: "component_id",
      });

      models.Component.belongsToMany(models.Product, {
        through: models.ProductComponent,
        foreignKey: "component_id",
      });
    }
  }
  Component.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Component",
    }
  );
  return Component;
};
