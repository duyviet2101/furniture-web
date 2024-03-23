// [GET] /admin
module.exports.index = async (req, res, next) => {
  res.render('admin/pages/dashboard/index', {
    pageTitle: 'Dashboard',
    activeTab: 'dashboard'
  });
}