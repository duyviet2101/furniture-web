const Product = require('../../models/product.model')

// [GET] /
module.exports.index = async (req, res, next) => {
    const featuredProducts = await Product.find({
        status: 'active',
        featured: true
    }).lean();
    console.log(featuredProducts);
    res.render('client/pages/home/index', {
        pageTitle: 'Trang chủ',
        featuredProducts
    });
}