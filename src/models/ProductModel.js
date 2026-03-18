const mongoose = require('mongoose')
const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        image: { type: String, required: true },
        gallery: {
            type: [String],
            default: [],
            validate: {
                validator: function (arr) {
                    return !arr || arr.length <= 6
                },
                message: 'Gallery can contain at most 6 images'
            }
        },
        type: { type: String, required: true },
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        rating: { type: Number, required: true },
        description: { type: String, required: true },
        discount: { type: Number },
        selled: { type: Number }
    },
    {
        timestamps: true,
    }
);
const Product = mongoose.model('Product', productSchema);
module.exports = Product;