var subcategoryRepository   = require("../domain/subcategoryRepository")

exports.create = function (data, onSuccess, onError){	
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
    subcategoryRepository.create(data, function(subcategory) {
		onSuccess(subcategory)
	}, onError)
}

exports.updateSubcategory = function (id, data, onSuccess, onError) {
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
    
    subcategoryRepository.find(id, function(subcategory) {
        if (subcategory != null) {
            subcategoryRepository.update(subcategory, data, onSuccess, onError)
        }else{
            onError("No existe la categoría")
        }
    }, onError)
}

exports.getSubcategory = function(id,onSuccess, onError) {
	subcategoryRepository.find(id,onSuccess, onError)
}

exports.getSubcategoryBySlug = function(slug, onSuccess, onError){
	subcategoryRepository.findBySlug(slug,onSuccess,onError)
}

exports.getSubcategories = function(onSuccess, onError) {
	subcategoryRepository.findAll(onSuccess, onError)
}

exports.deleteSubcategory = function(id, onSuccess, onError) {
	subcategoryRepository.find(id, function(subcategory) {
		if (subcategory != null) {
			subcategoryRepository.delete(subcategory, onSuccess, onError)
		}
		else
			onError("No existe la categoria")
	}, onError)
}
