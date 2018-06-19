var commentRepository   = require("../domain/commentRepository")
var orderRepository     = require("../domain/orderRepository")

exports.create = function (data, onSuccess, onError){	
    commentRepository.create(data, function(comment) {
		onSuccess(comment)
	}, onError)
}

exports.getComment = function(id,onSuccess, onError) {
	commentRepository.find(id,onSuccess, onError)
}

exports.getComments = function(onSuccess, onError) {
	commentRepository.findAll(function (comments) {
		onSuccess(comments)
	}, onError)
}
exports.findAllByDigdeeper = function(id,onSuccess, onError) {
	commentRepository.findAllByDigdeeper(id,function (comments) {
		onSuccess(comments)
	}, onError)
}
