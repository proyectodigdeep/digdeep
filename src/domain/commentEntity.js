var mongoose = require("mongoose")

var commentSchema = new mongoose.Schema({
	dateCommented: 	Date,
	textComments: 	String,
	clientData: {
		fullname: 	String, 
		email: 		String,
		picture: 	String,
		_idclient: 	mongoose.Schema.Types.ObjectId
	},
	digdeeperData: {
		fullname: 		String,
		phone: 			String,
		picture: 		String,
		_idDigdeeper: 	mongoose.Schema.Types.ObjectId
	},
	_idOrder:   mongoose.Schema.Types.ObjectId,
	titleService: 		String
})
module.exports = mongoose.model("Comments",commentSchema)