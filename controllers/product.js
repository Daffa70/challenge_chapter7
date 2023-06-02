const { Product, Component, ProductComponent } = require("../db/models");

module.exports = {
  index: async (req, res, next) => {
    try {
      const product = await Product.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        order: [["id", "ASC"]],
      });

      return res.status(200).json({
        status: true,
        message: "success",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  show: async (req, res, next) => {
    try {
      const { product_id } = req.params;

      const product = await Product.findOne({
        where: {
          id: product_id,
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

      if (!product) {
        return res.status(404).json({
          status: false,
          message: `can't find product with id ${product_id}`,
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "success",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  store: async (req, res, next) => {
    try {
      let message = "";
      const { name, quantity, component_id } = req.body;

      if (name == null || name == "") {
        return res.status(401).json({
          status: false,
          message: "name must be provided",
          data: null,
        });
      }

      if (!req.body.hasOwnProperty("component_id")) {
        return res.status(401).json({
          status: false,
          message: `component_id cannot be null`,
          data: null,
        });
      }

      if (!component_id) {
        return res.status(401).json({
          status: false,
          message: `component_id cannot be null`,
          data: null,
        });
      }

      const componentPromises = component_id.map((componentId) => {
        return Component.findOne({
          where: {
            id: componentId,
          },
        });
      });

      const components = await Promise.all(componentPromises);

      if (components.includes(null)) {
        return res.status(404).json({
          status: false,
          message: "One or more component IDs not found",
          data: null,
        });
      }

      const product = await Product.create({
        name: name,
        quantity: quantity,
      });

      const componentProductPromises = component_id.map((componentId) => {
        return ProductComponent.create({
          product_id: product.id,
          component_id: componentId,
        });
      });

      await Promise.all(componentProductPromises);

      return res.status(201).json({
        status: true,
        message: "success",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { product_id } = req.params;
      const { name, quantity, component_id } = req.body;

      const check_product = await Product.findOne({
        where: {
          id: product_id,
        },
      });

      if (!check_product) {
        return res.status(404).json({
          status: false,
          message: `cannot find product with id ${product_id}`,
          data: null,
        });
      }

      if (!req.body.hasOwnProperty("component_id")) {
        return res.status(400).json({
          status: false,
          message: `component_id cannot be null`,
          data: null,
        });
      }

      const componentPromises = component_id.map((componentId) => {
        return Component.findOne({
          where: {
            id: componentId,
          },
        });
      });

      const components = await Promise.all(componentPromises);

      if (components.includes(null)) {
        return res.status(404).json({
          status: false,
          message: "One or more component IDs not found",
          data: null,
        });
      }

      const updated = await Product.update(req.body, {
        where: { id: product_id },
      });

      const componentProductPromises = component_id.map((componentId) => {
        return ProductComponent.create({
          product_id: product_id,
          component_id: componentId,
        });
      });

      await Promise.all(componentProductPromises);

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
      const { product_id } = req.params;

      const deleted = await Product.destroy({
        where: { id: product_id },
      });

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: `can't find product with id ${product_id}`,
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

  storeProductComponent: async (req, res, next) => {
    try {
      const { product_id, component_id } = req.body;

      if (!product_id || !req.body.hasOwnProperty("product_id")) {
        return res.status(401).json({
          status: false,
          message: `product_id cannot be null`,
          data: null,
        });
      }

      if (!component_id || !req.body.hasOwnProperty("component_id")) {
        return res.status(401).json({
          status: false,
          message: `component_id cannot be null`,
          data: null,
        });
      }

      const check_productid = await Product.findOne({
        where: {
          id: product_id,
        },
      });

      const check_componentid = await Component.findOne({
        where: {
          id: component_id,
        },
      });

      if (!check_productid) {
        return res.status(404).json({
          status: false,
          message: `can't find product with id ${product_id}`,
          data: null,
        });
      }

      if (!check_componentid) {
        return res.status(404).json({
          status: false,
          message: `can't find component with id ${component_id}`,
          data: null,
        });
      }

      const checkDataExist = await ProductComponent.findOne({
        where: {
          product_id: product_id,
          component_id: component_id,
        },
      });

      if (checkDataExist) {
        return res.status(401).json({
          status: false,
          message: `data already exist`,
          data: null,
        });
      }

      const add = await ProductComponent.create({
        product_id,
        component_id,
      });

      return res.status(201).json({
        status: true,
        message: "success",
        data: add,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteProductComponent: async (req, res, next) => {
    try {
      const { component_id, product_id } = req.params;

      if (!product_id || !req.params.hasOwnProperty("product_id")) {
        return res.status(401).json({
          status: false,
          message: `product_id cannot be null`,
          data: null,
        });
      }

      if (!component_id || !req.params.hasOwnProperty("component_id")) {
        return res.status(401).json({
          status: false,
          message: `component_id cannot be null`,
          data: null,
        });
      }

      const checkDataExist = await ProductComponent.findOne({
        where: {
          product_id: product_id,
          component_id: component_id,
        },
      });

      if (!checkDataExist) {
        return res.status(404).json({
          status: false,
          message: `data not exist`,
          data: null,
        });
      }

      const deleted = await ProductComponent.destroy({
        where: { product_id: product_id, component_id: component_id },
      });

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
