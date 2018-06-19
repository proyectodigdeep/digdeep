angular.module('digdeepApp.registerUserCtrl', ['digdeepApp.userService'])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('registeruser', {
		url: '/registeruser',
		templateUrl: '/app/templates/registerUser.html',
		controller: 'registerUserCtrl'
	})
}])

.controller('registerUserCtrl', [ '$scope', '$state', 'userService', '$rootScope', '$http', '$localStorage',
	function (                     $scope,   $state,   userService,	  $rootScope,   $http,   $localStorage) {
	
	//verificar el tipo de usuario para mostrar la barra de navegación acorde a el
    $rootScope.$emit('checkRollUser',{done: function() {
    }})
    $scope.typeUser = $rootScope.typeUser
    
    // Obtener los datos del usuario para mostrar su perfil
    $rootScope.$emit('reloadUser',{done: function() {
    }})

    // Recolección de datos del formulario registro para ser Digdeeper
	$scope.dataUser = {
		name: 				"", birthdate: 			"", email: 		"", 
		password: 			"",	confirmPassword: 	"", phone: 		"", 
		address: 			"",	numberHouse: 		"",	postalCode: "",
		dateDay: 			"", dateMonth: 			"",	dateYear: 	"", 
		city: 	            "",	state:              "", colony: 	"", 
        roll:               "user", urlImg:         "img/userDefault.png"		
	}
	$scope.dataUserTemp = {
		name: 		"",	lastname: 	"",
		dateDay: 	"", dateMonth: 	"",	dateYear: 	""
	}
    $scope.privacitypolitics = false
    $scope.privacityFailed = false
    
    function sendEmailClient(dataUser) {
        // Configurando datos para genarar el correo a enviar a digdeep
        var html =  "<div style='text-align:center'><h3>Bienvenido a DIGDEEP</h3></div>"+
                    "<div style='text-align:center'><p>Esto solo es un mensaje para confirmar tus datos,"+ 
                    "y darte a conocer los pasos que siguen, para tu proceso</p></div>"+
                    "<div style='text-align:center'>"+
                        "<p>Nombre: "+dataUser.fullname+"</p>"+
                        "<p>Telefono: "+dataUser.phone+"</p>"+
                        "<p>E-mail de contacto: "+dataUser.email+"</p>"+
                        "<p>No es necesario contestar este correo disfruta ahora de nuestros servicios a tu disposición.</p>"+
                    "</div>"
        var data = {
            HTML:       html,
            subject:    "confirmación de registro a DIGDEEP WEB",
            to:         dataUser.email //Correo del nuevo cliente 
        }
        $http.post("v1/emails", data)
        .then(function(response) {
        },function (response) {
             $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Mensaje NO enviado, no se le pudo enviar su correo de confirmación comuniquese al télefono o por correo con DIGDEEP porfavor."})
        })
    }

	$scope.registerUser = function () {
		//concatenar valores recolectados del formulario
		$scope.dataUser.name 		= $scope.dataUserTemp.name +" "+$scope.dataUserTemp.lastname
		$scope.dataUser.birthdate	= $scope.dataUserTemp.dateDay+"/"+$scope.dataUserTemp.dateMonth+"/"+$scope.dataUserTemp.dateYear
		
        //	Hace la validación del formulario de campos vacios 
        var formValid = formIsValid($scope.dataUserTemp, $scope.dataUser)
        if (formValid === true) {
        	var password1 = $scope.dataUser.password
        	var password2 = $scope.dataUser.confirmPassword
        	if (password1 === password2 && password1 !==null && password2 !==null ) {
        		userService.registerUser($scope.dataUser, function (user) {
                    $http({
                        method: 'POST',
                        url: "v1/authenticate",
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function(obj) {
                            var str = []
                            for(var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
                            return str.join("&")
                        },
                        data: {email: $scope.dataUser.email, password: $scope.dataUser.password}
                    }).then(function (response) {
                        sendEmailClient(user)
                        $localStorage.token = response.data.token //guardar token en local storage response.data.token
                        // Obtener los datos del usuario para mostrar su perfil
                        // Verificar el tipo de usuario para mostrar la barra de navegación acorde a el
                        $rootScope.$emit('checkRollUser',{done: function() {
                        }})
                        $scope.typeUser = $rootScope.typeUser
                        $rootScope.$emit('reloadUser',{done: function() {
                        }})
                        $rootScope.$emit('openRegisterUserModal',{
                            idUsr: user._id
                        })
                    },function (err){
                        //console.log(err)
                        //alert("Error al iniciar sesión")
                        $rootScope.$emit("openAlertDigdeepModal",{
                            textAlert: "Error al iniciar sesión"
                        })
                    })
        		},function (error) {
        			console.log(error)
                    if(String(error) === "Password is too weak"){
                        $rootScope.$emit("openAlertDigdeepModal",{
                            textAlert: "La contraseña debe contener mayusculas, minusculas, números y caracteres especiales como @&# etc."
                        })    
                    }else{
                        console.log(error)
                        $rootScope.$emit("openAlertDigdeepModal",{
                            textAlert: "Ya existe un usuario con ese correo registrado"
                        })    
                    }   
        		})
        	}else {
        		//alert("Las contraseñas no coinciden")
                $rootScope.$emit("openAlertDigdeepModal",{
                    textAlert: "Las contraseñas no coinciden"
                })
        		$scope.dataUser.password = ""
        		$scope.dataUser.confirmPassword = ""
        	}
        }
	}
    
	function formIsValid (userTemp, dataUser) {
        if (angular.isDefined(userTemp.name)) {
            if(userTemp.name.length === 0){
            	$scope.nameFailed = true
            	return false
            }else $scope.nameFailed = false
        }
        else{
        	$scope.nameFailed = true
        	return false
        }

        if (angular.isDefined(userTemp.lastname)) {
            if(userTemp.lastname.length === 0){
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
            if(dataUser.email.length === 0){
            	$scope.emailFailed = true
            	return false
            } 	
            else $scope.emailFailed = false
        }
        else {
        	$scope.emailFailed = true
        	return false
        }

        if (angular.isDefined(dataUser.password)) {
            if(dataUser.password.length === 0){
            	$scope.passwordFailed = true
            	return false
            } 
            else $scope.passwordFailed = false
        }
        else {
        	$scope.passwordFailed = true
        	return false
        }

        if (angular.isDefined(dataUser.confirmPassword)) {
            if(dataUser.confirmPassword.length === 0){
		        $scope.confirmPasswordFailed = true
		        return false            	
            } 
            else $scope.confirmPasswordFailed = false
        }
        else {
        	$scope.confirmPasswordFailed = true
        	return false
        }

        if (angular.isDefined(dataUser.phone)) {
            if(dataUser.phone === null) {
            	$scope.phoneFailed = true
            	return false
            }
            else{
            	if (dataUser.phone.length === 0) {
	            	$scope.phoneFailed = true	
	            	return false
	            }else $scope.phoneFailed = false
	        }
        }
        else {
        	$scope.phoneFailed = true
        	return false
        }

        if (angular.isDefined(dataUser.address)) {
            if(dataUser.address.length === 0) {
                $scope.addressFailed = true
                return false
            }
            else $scope.addressFailed = false
        }
        else {
            $scope.addressFailed = true
            return false
        }
        if (angular.isDefined(dataUser.colony)) {
            if(dataUser.colony.length === 0) {
                $scope.colonyFailed = true
                return false
            }
            else $scope.colonyFailed = false
        }
        else {
            $scope.colonyFailed = true
            return false
        }
        if (angular.isDefined(dataUser.city)) {
            if(dataUser.city.length === 0) {
                $scope.cityFailed = true
                return false
            }
            else $scope.cityFailed = false
        }
        else {
            $scope.cityFailed = true
            return false
        }
        if (angular.isDefined(dataUser.state)) {
            if (dataUser.state === undefined || dataUser.state === null) {
                $scope.stateFailed = true
                return false
            }else{
                if(dataUser.state.length === 0) {
                    $scope.stateFailed = true
                    return false
                }
                else $scope.stateFailed = false
            }
        }
        else {
            $scope.stateFailed = true
            return false
        }

        if (angular.isDefined(dataUser.postalCode)) {
            if(dataUser.postalCode === null) {
                $scope.postalCodeFailed = true
                return false
            }else{
                 if (dataUser.postalCode.length === 0) {
                    $scope.dateDayFailed = true 
                    return false
                }else $scope.postalCodeFailed = false
            }
        }
        else {
            $scope.postalCodeFailed = true
            return false
        }

        if (angular.isDefined(userTemp.dateDay)) {
            if(userTemp.dateDay === null){
            	$scope.dateDayFailed = true
            	return false
            }else 
	            if (userTemp.dateDay.length === 0) {
	            	$scope.dateDayFailed = true	
	            	return false
	            }else $scope.dateDayFailed = false
        }
        else {
        	$scope.dateDayFailed = true
        	return false
        }

        if (angular.isDefined(userTemp.dateMonth)) {
            if (userTemp.dateMonth === undefined || userTemp.dateMonth === null) {
                $scope.dateMonthFailed = true
                return false
            }else{
                if(userTemp.dateMonth.length === 0) {
                    $scope.dateMonthFailed = true
                    return false
                }
                else $scope.dateMonthFailed = false
            }
        }
        else {
        	$scope.dateMonthFailed = true
        	return false
        }

        if (angular.isDefined(userTemp.dateYear)) {
            if(userTemp.dateYear === null) {
            	$scope.dateYearFailed = true
            	return false
            }
           	else 
	            if (userTemp.dateYear.length === 0) {	
	            	$scope.dateYearFailed = true
	            	return false
	            }
	            else $scope.dateYearFailed = false
        }
        else {
        	$scope.dateYearFailed = true
        	return false
        }

        if ($scope.privacitypolitics === false) {
            $scope.privacityFailed = true
            return false
        }else{
            $scope.privacityFailed = false 
        }

        return true
    }

}])
