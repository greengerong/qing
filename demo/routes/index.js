var url = require('url');

exports.index = function (req, res) {
    var url_parts = url.parse(req.url, true);
    res.render('index', { isDesign: url_parts.isDesign || true });
};