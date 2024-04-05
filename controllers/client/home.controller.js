const Product = require('../../models/product.model')

// [GET] /
module.exports.index = async (req, res, next) => {
    const featuredProducts = await Product.find({
        status: 'active',
        featured: true
    })
        .sort({
            'position': -1
        })
        .limit(3)
        .lean();
    res.render('client/pages/home/index', {
        pageTitle: 'Trang chủ',
        featuredProducts,
        activeTab: 'home',
    });
}