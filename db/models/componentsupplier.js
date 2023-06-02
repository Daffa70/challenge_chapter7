"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ComponentSupplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Component.belongsToMany(models.Supplier, {
        through: models.ComponentSupplier,
        foreignKey: "component_id",
      });
      models.Supplier.belongsToMany(models.Component, {
        through: models.ComponentSupplier,
        foreignKey: "supplier_id",
      });
    }
  }
  ComponentSupplier.init(
    {
      supplier_id: DataTypes.INTEGER,
      component_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ComponentSupplier",
    }
  );
  return ComponentSupplier;
};
