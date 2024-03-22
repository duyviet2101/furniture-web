

// [GET] /
module.exports.index = async (req, res, next) => {
    res.render('client/pages/home/index');
}