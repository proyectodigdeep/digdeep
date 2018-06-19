angular.module('digdeepApp.geocodeService', [])

.service('geocodeService', ['$http',
function(                    $http) {

	this.getLatLong = function(address, onSuccess, onError) {
		var key = "AIzaSyB8KqpxwZbzHORzWUJZ12bX8Yt6_E2Vpd0"
		var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+address.replace(/ /g, "+")+"&key="+key

		$http.get(url)
        .then(function(response) {
			if (response.data.status === "OK") {
				onSuccess(response.data.results[0].geometry.location)
			}
			else
				onError(response.data.status)
        }, onError)

	}

}])
