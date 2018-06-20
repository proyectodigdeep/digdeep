var categoryEntity = require("./categoryEntity")

exports.create = function (data, onSuccess, onError){
	var category = new categoryEntity()
		category.title = data.title
		category.description = data.description
		category.image = data.image
		category.subcategories = data.subcategories
		category.slug = data.slug

	category.save(function(err,category){
		if(err) return onError(err)
		else return onSuccess(category)
	})
}

exports.update = function(category, data, onSuccess, onError) {
	category.description = (data.description != null) ? data.description : category.description
	category.image 			= (data.image != null) ? data.image : category.image
	category.title 			= (data.title != null) ? data.title: category.title
	category.subcategories 	= (data.subcategories != null) ? data.subcategories: category.subcategories
	category.slug 			= (data.slug != null) ? data.slug: category.slug
	category.save(function (err,category){
		if(err) return onError(err)
		else return onSuccess(category)
		})
}

exports.find = function(id, onSuccess, onError) {
	categoryEntity.findOne({"_id": id}).exec(function(err, category) {
		if (err) return onError("Hubo un error al obtener una categoria: "+ err)
		else return onSuccess(category)
	})
}

exports.findAll = function(onSuccess, onError) {
	categoryEntity.find({}).exec(function(err, categories) {
		if (err) return onError("Hubo un error al obtener todas las categorias: "+ err)
		else return onSuccess(categories)
	})
}

exports.findBySlug = function (slug, onSuccess, onError) {
	categoryEntity.findOne({"slug": slug}).exec(function (err, category) {
		if (err) return onError("Hubo un error al obtener una categoria con slug"+ err)
			else return onSuccess(category)
	})
}

exports.delete = function(category, onSuccess, onError) {
	category.remove(function(err) {
		if (err) return onError("Hubo un error al borrar la categoria "+category._id+": "+err)
		else return onSuccess()
	})

}