var mongoose = require("mongoose")

var serviceSchema = new mongoose.Schema({
	title: 				String,
	pictures:  			[String], 
	_category: 			mongoose.Schema.Types.ObjectId,
	_subcategory: 		mongoose.Schema.Types.ObjectId,
	price_athome: 		Number,
	price_presencial:   Number,
	description: 		String,
	_digdeeper: 		mongoose.Schema.Types.ObjectId,
	filters: 			[String],
	values: 			[Number],
	comments: 			[mongoose.Schema.Types.ObjectId]
})

module.exports = mongoose.model("Services",serviceSchema)