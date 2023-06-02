const { Supplier, Component } = require("../db/models");

module.exports = {
  index: async (req, res, next) => {
    try {
      const suppliers = await Supplier.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        order: [["id", "ASC"]],
      });

      return res.status(200).json({
        status: true,
        message: "success",
        data: suppliers,
      });
    } catch (error) {
      next(error);
    }
  },

  show: async (req, res, next) => {
    try {
      const { supplier_id } = req.params;

      const supplier = await Supplier.findOne({
        where: {
          id: supplier_id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: Component,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            through: {
              attributes: [],
            },
          },
        ],
      });

      if (!supplier) {
        return res.status(404).json({
          status: false,
          message: `can't find supplier with id ${supplier_id}`,
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "success",
        data: supplier,
      });
    } catch (error) {
      next(error);
    }
  },

  store: async (req, res, next) => {
    try {
      const { name, address } = req.body;

      const supplier = await Supplier.create({
        name: name,
        address: address,
      });

      return res.status(201).json({
        status: true,
        message: "success",
        data: supplier,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { supplier_id } = req.params;

      const updated = await Supplier.update(req.body, {
        where: { id: supplier_id },
      });

      if (updated[0] == 0) {
        return res.status(404).json({
          status: false,
          message: `can't find supplier with id ${supplier_id}`,
          data: null,
        });
      }

      return res.status(201).json({
        status: true,
        message: "success",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },

  destroy: async (req, res, next) => {
    try {
      const { supplier_id } = req.params;

      const deleted = await Supplier.destroy({
        where: { id: supplier_id },
      });

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: `can't find supplier with id ${supplier_id}`,
          data: null,
        });
      }

      return res.status(201).json({
        status: true,
        message: "success",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
};
