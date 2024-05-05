const { priceNewProducts } = require('../../helpers/product');
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

    //! newPrice
    const productsNewPrice = priceNewProducts(featuredProducts);
    //! end newPrice

    res.render('client/pages/home/index', {
        pageTitle: 'Furniture shop',
        featuredProducts: productsNewPrice,
        activeTab: 'home',
    });
}

// [GET] /introduction
module.exports.introduction = (req, res, next) => {
    res.render('client/pages/home/introduction', {
        pageTitle: 'Giới thiệu',
        activeTab: 'introduction',
    });
}

// [GET] /contact
module.exports.contact = (req, res, next) => {
    res.render('client/pages/home/contact', {
        pageTitle: 'Liên hệ',
        activeTab: 'contact',
    });
}