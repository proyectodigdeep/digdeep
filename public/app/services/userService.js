angular.module('digdeepApp.userService', ['angular-jwt'])

.service('userService', ['$http', 'jwtHelper',
function(                 $http,   jwtHelper) {

    this.getUser = function (idusr, onSuccess, onError) {
        $http.get('v1/users/'+idusr).
        then(function (response) {
            if(response.data.status === "success"){
                onSuccess(response.data.user)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

    this.addMethodPayToCustomer = function (id_user, tokenId, token, onSuccess, onError) {
        var data = {}
            data.tokenId = tokenId

        $http.post("v1/addmethodpay/"+id_user, data,
        {headers:{'x-access-token': token}}).
        then(function (response) {
            if(response.data.status === "success"){
                onSuccess(response.data.payment_sources)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

    this.verifyMethodPay = function (id_user, token, onSuccess, onError) {
        $http.get("v1/verifyMethodPay/"+id_user,
        {headers:{'x-access-token': token}}).
        then(function (response) {
            if(response.data.status === "success"){
                onSuccess(response.data.payment_sources)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

    this.getTokenByIdAuth0 = function (id_auth0, onSuccess, onError) {
        $http.get('v1/users_auth0/'+id_auth0).
        then(function (response) {
            if(response.data.status === "success"){
                //console.log(response.data.token)
                onSuccess(response.data.token)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

    this.changePasswordAuth0 = function (email, onSuccess, onError) {
        var data = {
            email: email
        }
        $http.post('v1/email_changepassword/', data).
        then(function (response) {
            if(response.data.status === "success"){
                onSuccess(response.data.message)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

    this.getUsersBySubcategories = function (id, onSuccess, onError) {
        $http.get('v1/usersbysubcategory/'+id).
        then(function (response) {
            if(response.data.status === "success"){
                onSuccess(response.data.users)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

    this.getProviders = function (id, token, onSuccess, onError) {
        $http.get('v1/providers/'+id,
        {headers: {'x-access-token': token}})
        .then(function (response) {
            if(response.data.status === "success"){
                onSuccess(response.data.users)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

    // Obtener los datos de un digdeeper para poder mostrarselos a un usuario normal
    this.getDataUserToService = function (idDigdeeper, token, onSuccess, onError) {
        $http.post('v1/ddtoservice',{
            idDigdeeper: idDigdeeper
        },
        {headers: {'x-access-token': token}})
        .then(function (response) {
            if(response.data.status === "success"){
                onSuccess(response.data.digdeeper)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }

	this.registerUser = function (userdata, onSuccess, onError){
		$http.post('v1/users/', userdata)
        .then(function(response) {
            if(response.data.status === "success"){
                onSuccess(response.data.user)
            }
            else{
                console.log(response.data.message)
                onError(response.data.message)
            }
        }, onError)
	}

    this.registerUserBySocialRed = function (userdata, onSuccess, onError){
        console.log("datos de usuario")
        console.log(userdata)
        $http.post('v1/users_register/', userdata)
        .then(function(response) {
            if(response.data.status === "success"){
                onSuccess(response.data.user)
            }
            else{
                console.log(response.data.message)
                onError(response.data.message)
            }
        }, onError)
    }
    
    this.verifyUserByEmail = function (email, onSuccess, onError){
        userdata = {
            email: email
        }
        $http.post('v1/usersverify/', userdata)
        .then(function(response) {
            if(response.data.status === "success"){
                onSuccess(response.data.user)
            }
        }, onError)
    }
    // Guardar las preferencias del usuario con rol: user
    this.updatePreferencesUser = function (idUser, userdata, onSuccess, onError){
        $http.put('v1/userspreferences/'+idUser,
        {   gender:             userdata.gender,
            budget:             parseInt(userdata.budget),
            categoriesServices: userdata.categoriesServices
        })
        .then(function(response) {
            if(response.data.status === "success"){
                onSuccess(response.data.user)
            }
            else{
                console.log("No se puede actualizar las preferencias del usuario")
                onError(response.data.message)
            }
        }, onError)
    }

    // Cambiar la contraseña de un usuario
    this.updatePasswordUser = function (idUser, userdata, token, onSuccess, onError){
        $http.put('v1/userspassword/'+idUser,
        {
            currencyPassword:   userdata.currencyPassword,
            newPassword:        userdata.newPassword
        },{headers: {'x-access-token': token}})
        .then(function(response) {
            if(response.data.status === "success"){
                onSuccess(response.data.user)
            }
            else{
                console.log("No se puede actualizar el usuario")
                onError(response.data.message)
            }
        }, onError)
    }
    // Aprobar un proveedor
    this.validateProvider = function (id, token, onSuccess, onError){
        $http.get('v1/validateproviders/'+id,
        {headers: {'x-access-token': token}})
        .then(function (response) {
            if(response.data.status === "success"){
                onSuccess(response.data.user)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
    // Desaprobar un proveedor
    this.disvalidateProvider = function (id, token, onSuccess, onError){
        $http.get('v1/disvalidateproviders/'+id,
        {headers: {'x-access-token': token}})
        .then(function (response) {
            if(response.data.status === "success"){
                onSuccess(response.data.user)
            }
            else{
                onError(response.data.message)
            }
        }, onError)
    }
    // Cambiar la contraseña de un usuario temporalmente por requerimiento de olvido
    this.updateForgetPasswordUser = function (idUser,onSuccess, onError){
        $http.put('v1/userspasswordforget/'+idUser)
        .then(function(response) {
            if(response.data.status === "success"){
                onSuccess(response.data.passwordTemp)
            }
            else{
                console.log("No se puede actualizar el usuario")
                onError(response.data.message)
            }
        }, onError)
    }

    // añadir el rol de 'usuario digdeeper' a la cuenta de un usuario normal
    this.updateUserToDigdeeper = function (idUser, userdata, token, onSuccess, onError){
        $http.put('v1/users/'+idUser,
        {
            fullname:           userdata.fullname,
            birthdate:          userdata.birthdate,
            email:              userdata.email,
            phone:              userdata.phone,
            address:            userdata.address,
            numberHouse:        userdata.numberHouse,
            postalCode:         userdata.postalCode,
            colony:             userdata.colony,   
            city:               userdata.city,
            state:              userdata.state, 
            temp_service:       userdata.service,
            specialty:          userdata.specialty,
            descriptionCompany: userdata.descriptionCompany,
            //services:           userdata.services
            postedServices:     userdata.postedServices,
            myServicesRequested:userdata.myServicesRequested
        },{headers: {'x-access-token': token}})
        .then(function(response) {
            if(response.data.status === "success"){
                onSuccess(response.data.user)
            }
            else{
                console.log("No se puede actualizar el usuario")
                onError(response.data.message)
            }
        }, onError)
    }

    // Actualziar los datos del perfil de un usuario normal
    this.updateUserProfile = function (idUser, userdata, token, onSuccess, onError){
        $http.put('v1/users/'+idUser,
        {
            fullname:           userdata.fullname,
            birthdate:          userdata.birthdate,
            email:              userdata.email,
            phone:              userdata.phone,
            address:            userdata.address,
            numberHouse:        userdata.numberHouse,
            postalCode:         userdata.postalCode,
            colony:             userdata.colony,   
            city:               userdata.city,
            state:              userdata.state
        },{headers: {'x-access-token': token}})
        .then(function(response) {
            if(response.data.status === "success"){
                onSuccess(response.data.user)
            }
            else{
                console.log("No se puede actualizar el usuario")
                onError(response.data.message)
            }
        }, onError)
    }
    // Actualizar los datos del perfil de un usuario digdeeper (proveedor)
    this.updateDigdeeperProfile = function (idUser, userdata, token, onSuccess, onError){
        $http.put('v1/users/'+idUser,
        {
            fullname:           userdata.fullname,
            birthdate:          userdata.birthdate,
            email:              userdata.email,
            phone:              userdata.phone,
            address:            userdata.address,
            numberHouse:        userdata.numberHouse,
            postalCode:         userdata.postalCode,
            colony:             userdata.colony,   
            city:               userdata.city,
            state:              userdata.state, 
            temp_service:       userdata.service,
            specialty:          userdata.specialty,
            descriptionCompany: userdata.descriptionCompany,
            //services:           userdata.services
            postedServices:     userdata.postedServices,
            myServicesRequested:userdata.myServicesRequested,
            kindServices:       userdata.kindServices,
            webPage        : userdata.webPage,
            fanPage        : userdata.fanPage,
            instagram      : userdata.instagram,
            rfc            : userdata.rfc,
            logo           : userdata.logo
        },{headers: {'x-access-token': token}})
        .then(function(response) {
            if(response.data.status === "success"){
                onSuccess(response.data.user)
            }
            else{
                console.log("No se puede actualizar el usuario")
                onError(response.data.message)
            }
        }, onError)
    }

    // Añadirle un servicio nuevo a un usuario
    this.addService = function (idUser, service, token, onSuccess, onError){
        this.getUser (idUser, function (user) {
            var servicesTemp = []
            servicesTemp = user.postedServices
            servicesTemp.push(service._id)
            $http.put('v1/usersaddservice/'+idUser,
            {
                postedServices: servicesTemp
            },{headers: {'x-access-token': token}})
            .then(function(response) {
                if(response.data.status === "success"){
                    onSuccess(response.data.user)
                }
                else{
                    //console.log("No se puede actualizar el usuario")
                    onError(response.data.message)
                }
            }, onError)
        },function (err) {
            console.log(err)
        })
    }

    // Añadir una orden a un usuario "user"
    this.useraddorder = function (idUser, order, token, onSuccess, onError){
        this.getUser (idUser, function (user) {
            var servicesTemp = []
            servicesTemp = user.myServicesRequested
            servicesTemp.push(order._id)
            $http.put('v1/usersaddservice/'+idUser,
            {
                myServicesRequested: servicesTemp
            },{headers: {'x-access-token': token}})
            .then(function(response) {
                if(response.data.status === "success"){
                    onSuccess(response.data.user)
                }
                else{
                    //console.log("No se puede actualizar el usuario")
                    onError(response.data.message)
                }
            }, onError)
        },function (err) {
            console.log(err)
        })
    }

    this.isTokenValidAsDigdeeper = function(token) {
        if (!jwtHelper.isTokenExpired(token)){ // El token es válido
            var user = jwtHelper.decodeToken(token)._doc
            if (hasRole(user, 'digdeeper'))
                return true
            else
                return false
        }
        else
            return false
    }
    this.isTokenValidAsUser = function(token) {
        if (!jwtHelper.isTokenExpired(token)){ // El token es válido
            var user = jwtHelper.decodeToken(token)._doc
            if (hasRole(user, 'user'))
                return true
            else
                return false
        }
        else
            return false
    }
    this.isTokenValidAsRoot = function(token) {
        if (!jwtHelper.isTokenExpired(token)){ // El token es válido
            var user = jwtHelper.decodeToken(token)._doc
            if (hasRole(user, 'root'))
                return true
            else
                return false
        }
        else
            return false
    }
    this.getUserFromToken = function(token) {
        //console.log(jwtHelper.decodeToken(token)._doc)
        return jwtHelper.decodeToken(token)._doc
    }

    function hasRole(user, role) {
        if (user.roles.indexOf(role) != -1)
            return true
        else
            return false
    }
	
}])
