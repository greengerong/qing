var url = require('url');

exports.index = function (req, res) {
    var url_parts = url.parse(req.url, true);
    console.log(JSON.stringify(url_parts), "url_parts.isDesign ")
    res.render('index', { isDesign: url_parts.query.hasOwnProperty("design")});
};