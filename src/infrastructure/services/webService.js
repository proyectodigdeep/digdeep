var swig = require("swig")

exports.home = function(req, res) {
	res.send(swig.renderFile('./src/presenter/home.html'))
}
