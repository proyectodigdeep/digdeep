angular.module('digdeepApp.notePrivacyCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('noteprivacy', {
		url: '/noteprivacy',
		templateUrl: '/app/templates/noteprivacy.html',
		controller: 'notePrivacyCtrl'
	})
}])

.controller('notePrivacyCtrl', [ '$scope', '$state', '$rootScope', '$interval',
function (                 	   $scope,   $state,   $rootScope,   $interval) {
	
}])