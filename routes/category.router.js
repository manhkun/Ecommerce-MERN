const router = require("express").Router();
const categoryCtrl = require("../controllers/category.controller");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/auth.admin");

router
  .route("/category")
  .get(categoryCtrl.getCategories)
  .post(auth, authAdmin, categoryCtrl.createCategory);

router
  .route("/category/:id")
  .delete(auth, authAdmin, categoryCtrl.deleteCategory)
  .put(auth, authAdmin, categoryCtrl.updateCategory);

module.exports = router;
