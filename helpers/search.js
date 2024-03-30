const convertToSlug = require('./convertToSlug.js');
module.exports = (req) => {
    const search = {};
    if (req.query.search) {
        search['$or'] = [];
        search['$or'].push({
            title: {
                '$regex': req.query.search,
                '$options': 'i'
            }
        });
        search['$or'].push({
            description: {
                '$regex': req.query.search,
                '$options': 'i'
            }
        });
        search['$or'].push({
            slug: {
                '$regex': convertToSlug(req.query.search),
                '$options': 'i'
            }
        });
    }
    return search;
}