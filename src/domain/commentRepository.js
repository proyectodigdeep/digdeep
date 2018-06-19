var commentEntity = require("./commentEntity")

exports.create = function (data,onSuccess,onError) {
	var comment = new commentEntity()
		comment.dateCommented 		= data.dateCommented
		comment.textComments 		= data.textComments
		comment.clientData.fullname = data.nameClient
		comment.clientData.email 	= data.emailClient
		comment.clientData.picture 	= data.pictureClient
		comment.clientData._idclient= data.idClient
		comment.digdeeperData.fullname 	= data.nameDigdeeper
		comment.digdeeperData.phone 	= data.phoneDigdeeper
		comment.digdeeperData.picture 	= data.pictureDigdeeper
		comment.digdeeperData._idDigdeeper = data.idDigdeeper
		comment._idOrder 		= data.idOrder
		comment.titleService 	= data.titleService
	comment.save(function (err,comment) {
		if(err) return onError(err)
		else return onSuccess(comment)
	})
}

exports.find = function(id, onSuccess, onError) {
	commentEntity.findOne({"_id": id}).exec(function(err, comment) {
		if (err) return onError("Hubo un error al obtener un comentario: "+ err)
		else return onSuccess(comment)
	})
}

exports.findAll = function(onSuccess, onError) {
	commentEntity.find({}).exec(function(err, comments) {
		if (err) return onError("Hubo un error al obtener todos los comentarios: "+ err)
		else return onSuccess(comments)
	})
}
exports.findAllByDigdeeper = function(id,onSuccess, onError) {
	commentEntity.find({"digdeeperData._idDigdeeper": id}).exec(function(err, comments) {
		if (err) return onError("Hubo un error al obtener todos los comentarios: "+ err)
		else return onSuccess(comments)
	})
}