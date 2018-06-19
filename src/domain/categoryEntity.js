var mongoose = require("mongoose")

var categorySchema = new mongoose.Schema({
	title: String,
	description: String,
	image: String,
	subcategories: [mongoose.Schema.Types.ObjectId], 
	slug: String
})

module.exports = mongoose.model("Categories",categorySchema)