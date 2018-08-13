angular.module('digdeepApp.contactDDCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('contactdigdeep', {
		url: '/contactdigdeep',
		templateUrl: '/app/templates/contactdigdeep.html',
		controller: 'contactDDCtrl'
	})
}])

.controller('contactDDCtrl', [ '$scope', '$state', '$rootScope', '$interval', '$http',
function (                  	$scope,   $state,	$rootScope,   $interval,   $http) {
	
   	// Obtener los datos del usuario para mostrar su perfil
	$rootScope.$emit('reloadUser',{done: function() {
	}})
    // Verificar el tipo de usuario para mostrar la barra de navegación acorde a el
    $rootScope.$emit('checkRollUser',{done: function() {
    }})
    $scope.typeUser = $rootScope.typeUser
    // Recargar órdenes cada 5 segundos
    $interval(function(){
        //verificar el tipo de usuario para mostrar la barra de navegación acorde a el
        $rootScope.$emit('checkRollUser',{done: function() {
        }})
    }, 5000)

	$scope.contact = {
		name: 		"",
		lastname: 	"",
		email: 		"",
		phone: 		"",
		message: 	""
	}

	$scope.sendMessage = function () {
        // Recolección y validación de campos del formulario para enviar el mensaje
		var formValid = formIsValid($scope.contact)
        if (formValid === true) {
        	// Configurando datos para genarar el correo a enviar a digdeep
            var html =  "<p><h3>DATOS DE CONTACTO</h3></p>"+
                        "<div><ul style='list-style-type: none'>"+
                            "<li><strong>Nombre:</strong> "+$scope.contact.name+"</li>"+
                            "<li><strong>Apellido:</strong> "+$scope.contact.lastname+"</li>"+
                            "<li><strong>Telefono:</strong> "+$scope.contact.phone+"</li>"+
                            "<li><strong>Email de contacto:</strong> "+$scope.contact.email+"</li>"+
                            "</ul>"+
                            "<p><h3>MENSAJE</h3></p>"+
                            "<p><ul style='list-style-type: none'><li>"+$scope.contact.message+"</li></ul></p>"+
                        "</div>"
            var dataEmail ={
                name: $scope.contact.name,
                lastname: $scope.contact.lastname,
                phone: $scope.contact.phone,
                email: $scope.contact.email,
                message: $scope.contact.message
            }
            var data = {
                HTML:       html,
                subject:    "Mensaje de contacto",
                to:         $scope.emailDigdeep,//Correo de digdeep a quien va llegar los correos que manda el contacto
                text:       $scope.contact.message,
                dataEmail: dataEmail
            }
            $http.post("v1/emailscontact", dataEmail)
            .then(function(response) {
                console.log("here")
                if(response.data.status === "success"){
                    $scope.contact = {
                        name:       "",
                        lastname:   "",
                        email:      "",
                        phone:      "",
                        message:    ""
                    }
                    $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Mensaje enviado correctamente, espera a que te contacte DIGDEEP, gracias."})
                }
                else{
                    $scope.contact = {
                        name:       "",
                        lastname:   "",
                        email:      "",
                        phone:      "",
                        message:    ""
                    }
                    $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Mensaje NO enviado, Inténtalo más tarde."})
                }
            })
        }
	}

	function formIsValid(dataUser) {
         if (angular.isDefined(dataUser.name)) {
            if(dataUser.name.length === 0) {
                $scope.nameFailed = true
                return false
            }
            else $scope.nameFailed = false
        }
        else {
            $scope.nameFailed = true
            return false
        }

        if (angular.isDefined(dataUser.lastname)) {
            if(dataUser.lastname.length === 0) {
                $scope.lastnameFailed = true
                return false
            }
            else $scope.lastnameFailed = false
        }
        else {
            $scope.lastnameFailed = true
            return false
        }

        if (angular.isDefined(dataUser.email)) {
            if(dataUser.email.length === 0) {
                $scope.emailFailed = true
                return false
            }
            else $scope.emailFailed = false
        }
        else {
            $scope.emailFailed = true
            return false
        }

        if (angular.isDefined(dataUser.phone)) {
            if(dataUser.phone.length === 0) {
                $scope.phoneFailed = true
                return false
            }
            else $scope.phoneFailed = false
        }
        else {
            $scope.phoneFailed = true
            return false
        }

        if (angular.isDefined(dataUser.message)) {
            if(dataUser.message.length === 0) {
                $scope.messageFailed = true
                return false
            }
            else $scope.messageFailed = false
        }
        else {
            $scope.messageFailed = true
            return false
        }

        return true
    }
}])
