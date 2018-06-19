var mongoose = require("mongoose")

var calendarSchema = new mongoose.Schema({
	title: String,
	date: Date,
	hourInit: Date,
	hourFinal: Date,
	_digdeeper: mongoose.Schema.Types.ObjectId
})

module.exports = mongoose.model("Calendar_events",calendarSchema)