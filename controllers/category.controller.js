const Category = require('../models/category.model');

const categoryCtrl = {
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find();
            res.json(categories);
        } catch (error) {
            return error.status(500).json({ msg: error.message });
        }
    },
    createCategory: async (req, res) => {
        try {
            // Only admin can create, delete and update category
            const { name } = req.body;
            const category = await Category.findOne({ name });
            if(category) return res.status(400).json({ msg: 'This category already exist' });

            const newCategory = new Category({ name });
            await newCategory.save();
            res.json('Check admin success');
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    deleteCategory: async (req, res) => {
        try {
            await Category.findByIdAndDelete(req.params.id);
            res.json({ msg: "Delete a category" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    updateCategory: async (req, res) => {
        try {
            const { name } = req.body;
            await Category.findOneAndUpdate({ _id: req.params.id }, { name });

            res.json({ msg: "Update a category" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }
}

module.exports = categoryCtrl;