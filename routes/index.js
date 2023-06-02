const express = require("express");
const router = express.Router();
const component = require("../controllers/component");
const supplier = require("../controllers/supplier");
const product = require("../controllers/product");
const user = require("../controllers/user");
const middlewares = require("../utils/middlewares");

const media = require("../controllers/media");
const storage = require("../utils/storage");
const multer = require("multer")();

router.get("/", (req, res) => {
  return res.render("index");
});

router.get("/home", (req, res) => {
  return res.render("home");
});

//
router.get("/register", user.registerPage);
router.get("/login", user.loginPage);
router.get("/edit-profile", middlewares.auth, user.editPage);
router.post(
  "/update-profile",
  middlewares.auth,
  multer.single("media"),
  user.update
);
router.post("/auth/register", user.register);
router.post("/auth/login", user.login);
router.get("/whoami", middlewares.auth, user.whoami);

// components
router.get("/components", middlewares.auth, component.index);
router.get("/components/:component_id", middlewares.auth, component.show);
router.post("/components", middlewares.isAdmin, component.store);
router.put("/components/:component_id", middlewares.isAdmin, component.update);
router.delete(
  "/components/:component_id",
  middlewares.isAdmin,
  component.destroy
);
router.post(
  "/add-supplier-component",
  middlewares.isAdmin,
  component.storeSupplierComponent
);
router.delete(
  "/delete-supplier-component/:component_id/:supplier_id",
  middlewares.isAdmin,
  component.deleteProductComponent
);

//supplier
router.get("/suppliers", middlewares.auth, supplier.index);
router.get("/suppliers/:supplier_id", middlewares.auth, supplier.show);
router.post("/suppliers", middlewares.isAdmin, supplier.store);
router.put("/suppliers/:supplier_id", middlewares.isAdmin, supplier.update);
router.delete("/suppliers/:supplier_id", middlewares.isAdmin, supplier.destroy);

//product
router.get("/products", middlewares.auth, product.index);
router.get("/products/:product_id", middlewares.auth, product.show);
router.post("/products", middlewares.isAdmin, product.store);
router.put("/products/:product_id", middlewares.isAdmin, product.update);
router.delete("/products/:product_id", middlewares.isAdmin, product.destroy);
router.post(
  "/add-product-component",
  middlewares.isAdmin,
  product.storeProductComponent
);
router.delete(
  "/delete-product-component/:component_id/:product_id",
  middlewares.isAdmin,
  product.deleteProductComponent
);

router.get("/error", (req, res) => {
  let data = {
    status: false,
    message: "error!",
    data: null,
  };
  return res.status(500).json(data);
});

module.exports = router;
