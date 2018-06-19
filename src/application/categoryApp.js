var categoryRepository      = require ("../domain/categoryRepository")
var subcategoryRepository   = require("../domain/subcategoryRepository")

exports.create = function (data, onSuccess, onError){	
	// Generar un slug del titulo de la categoria
    data.slug = slugify(data.title)
        function slugify(text)
        {
            return text.toString().toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '');            // Trim - from end of text
        }
    //console.log("slug : "+data.slug)
    categoryRepository.create(data, function(category) {
		onSuccess(category)
	}, onError)
}

exports.updateCategory = function (id, data, onSuccess, onError) {
    if (data.title) {
        data.slug = slugify(data.title)
        function slugify(text)
        {
            return text.toString().toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '');            // Trim - from end of text
        }
    }
    categoryRepository.find(id, function(category) {
        if (category != null) {
            categoryRepository.update(category, data, onSuccess, onError)
        }else{
            onError("No existe la categoría")
        }
    }, onError)
}

exports.getCategory = function(id,onSuccess, onError) {
	categoryRepository.find(id,onSuccess, onError)
}

exports.getCategoryBySlug = function(slug, onSuccess, onError){
	categoryRepository.findBySlug(slug,onSuccess,onError)
}

exports.getCategories = function(onSuccess, onError) {
	categoryRepository.findAll(onSuccess, onError)
}

exports.deleteCategory = function(id, onSuccess, onError) {
	categoryRepository.find(id, function(category) {
		if (category != null) {
			categoryRepository.delete(category, onSuccess, onError)
		}
		else
			onError("No existe la categoria")
	}, onError)
}
