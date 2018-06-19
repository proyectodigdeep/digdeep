var mongoose = require("mongoose")

var subcategorySchema = new mongoose.Schema({
	title: String,
	description: String,
	image: String,
	slug: String
})

module.exports = mongoose.model("Subcategory",subcategorySchema)