var subcategoryEntity = require("./subcategoryEntity")

exports.create = function (data, onSuccess, onError){
	var subcategory = new subcategoryEntity()
		subcategory.title = data.title
		subcategory.description = data.description
		subcategory.image = data.image
		subcategory.slug = data.slug

	subcategory.save(function(err,subcategory){
		if(err) return onError(err)
		else return onSuccess(subcategory)
	})
}

exports.update = function(subcategory, data, onSuccess, onError) {
	subcategory.description = (data.description != null) ? data.description : subcategory.description
	subcategory.image 			= (data.image != null) ? data.image : subcategory.image
	subcategory.title 			= (data.title != null) ? data.title: subcategory.title
	subcategory.slug 			= (data.slug != null) ? data.slug: subcategory.slug
	subcategory.save(function (err,subcategory){
		if(err) return onError(err)
		else return onSuccess(subcategory)
		})
}

exports.find = function(id, onSuccess, onError) {
	subcategoryEntity.findOne({"_id": id}).exec(function(err, subcategory) {
		if (err) return onError("Hubo un error al obtener una categoria: "+ err)
		else return onSuccess(subcategory)
	})
}

exports.findAll = function(onSuccess, onError) {
	subcategoryEntity.find({}).exec(function(err, subcategories) {
		if (err) return onError("Hubo un error al obtener todas las categorias: "+ err)
		else return onSuccess(subcategories)
	})
}

exports.findBySlug = function (slug, onSuccess, onError) {
	subcategoryEntity.findOne({"slug": slug}).exec(function (err, subcategory) {
		if (err) return onError("Hubo un error al obtener una categoria con slug"+ err)
			else return onSuccess(subcategory)
	})
}

exports.delete = function(subcategory, onSuccess, onError) {
	subcategory.remove(function(err) {
		if (err) return onError("Hubo un error al borrar la categoria "+subcategory._id+": "+err)
		else return onSuccess()
	})

}