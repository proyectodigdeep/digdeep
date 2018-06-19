angular.module('digdeepApp.contractServiceModalCtrl', ['ui.bootstrap','google.places'])

.controller('contractServiceModalCtrl', ['$scope', '$uibModal', '$document',
function (                                $scope,   $uibModal,   $document) {
    $scope.openContractServiceModal = function (Service, User, typePrice,size, parentSelector) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/contractServiceModal.html',
            controller: 'contractServiceInstanceModalCtrl',
            controllerAs: '$ctrl',
            size: "sm",
            backdrop  : 'static',
            keyboard  : false,
            resolve: {
                idService: function() {return Service._id},
                rolesUser: function() {return User.roles},
                User: function() {return User},
                Service: function() {return Service},
                typePrice: function(){return typePrice}
            }
        })
    }
}])

.controller('contractServiceInstanceModalCtrl', ['typePrice','geocodeService','Service', 'User','$scope', '$rootScope', '$uibModalInstance', 'rolesUser', 'serviceService', '$state', 'ordersService', '$localStorage', 'userService', '$http', 'calendarService',
function (                                        typePrice,  geocodeService,  Service,   User,  $scope,   $rootScope,   $uibModalInstance,   rolesUser,   serviceService,   $state,   ordersService,   $localStorage,   userService,   $http,   calendarService) {
    // Datos del servicio
    $scope.service = Service
    // Obtener los datos del usuario para mostrar su perfil
    $rootScope.$emit('reloadUser',{done: function() {
    }})
    // Verificar el tipo de usuario para mostrar la barra de navegación acorde a el
    $rootScope.$emit('checkRollUser',{done: function() {
    }})
    $scope.typeUser = $rootScope.typeUser
    if ($scope.typeUser === "userNoLogin") {
        $rootScope.$emit("openLoginToContractModal")
    }
    // tipo de precio que tiene activo el proveedor, segun el lugar donde será el servicio
    // 1 ambos tipos (a domicilio y en establecimiento)
    // 2 solo el tipo a domicilio
    // 3 solo el tipo en establecimiento
    $scope.typePrice = typePrice
    
    // Menu de los modales de la compra    
    $scope.menuModalsCardCredit = [
    "infoService",          "selectPlaceService",
    "dateInit",
    "dateFinal",            "hourSelect",
    "confirmContract",      "deliveryData",
    "confirmPaymentCard",   "successContract",     
    "thanksDigdeepear"]

    // Autocomplete de dirección con googlemaps
    $scope.autocompleteOptions = {
      componentRestrictions: {country: 'mx'}
    }

    $scope.errAlert = false
    $scope.paymentType ="-"
    $scope.tabMenu = 0;
    $scope.tabMenuCurrency = $scope.menuModalsCardCredit[0]// utiliza por defecto el menu, con forma de pago en efectivo
    var CurrentDate = new Date()

    $scope.card = {
        num: null,
        dateVen1: null,
        dateVen2: null,
        cod: null
    }
    $scope.billing = {
        fullname:   "",
        rfc:        "",
        phone:      "",
        cp:         null,
    }
    // Datos de la orden nueva a generar
    $scope.orderService = {
        dateInit:       "",
        dateFinal:      "",
        hourInit:       "",
        hourFinal:      "",
        total:          0,
        value:          -1,
        metodPay:       "-",
        service:        Service._id,
        title:          Service.title,
        picture:        Service.pictures[0],
        nameDD:         "",
        imgDD:          "",
        nameUser:       User.fullname,
        imgUser:        User.urlImg,
        requestedDate:  CurrentDate,
        placeService:   "",
        deliveryData:   {
            name:       "",
            email:      "",
            phone:      "",
            address:    ""
        },
        digdeeper:      Service._digdeeper,
        client:         User._id,
        dataBilling:    {
            name:   "",
            rfc:    "",
            phone:  "",
            cp:     null 
        },
        coordinates: {
            lat: null,
            lng: null
        }
    }
    // Instancias los datos de entrega por default con los del usuario registrado
    $scope.orderService.deliveryData.name   = User.fullname    
    $scope.orderService.deliveryData.email  = User.email
    $scope.orderService.deliveryData.phone  = User.phone
    $scope.autocmpleteAddress               = User.address+", "
                                             +User.numberHouse+", "
                                             +User.colony+", "
                                             +User.state+", "
                                             +User.city+", "
                                             +User.postalCode
      
    // Decalarar mapa
    $scope.formDelivery = 1
    $scope.deliveryMap = {
        center: {
            latitude: 19.0342177,
            longitude: -98.2464459
        }, 
        zoom: 14, 
        options: mapOptions
    }

    // Opciones para configurar el calendario de fechas
    var dateCurrent = new Date();
    var noDisponiblesDates = []
    $scope.events = []
    dateCurrent.setDate(dateCurrent.getDate() + 1)
    $scope.optionsCalendar = {
        allowInvalid: true, 
        debounce: 200,
        updateOn: 'default',
        formatYear: 'yy',
        startingDay: 1,
        showWeeks: false,
        minDate: dateCurrent,
        customClass: getDayClass
        //dateDisabled: disabledDates
    }
    
    // opciones para configurar el mapa
    var mapOptions = {
        clickableIcons: false,
        fullscreenControl: false,
        keyboardShortcuts: false,
        streetViewControl: false,
        mapTypeControl: false,
        minZoom: 11, 
        scrollwheel: true
    }
    
    // Seleccionar donde se quiere el servicio
    $scope.selectPlaceService = function (place) {
        $scope.orderService.placeService = place
    }

    //Obtener las fechas del proveedor dentro de digdeep
    ordersService.getDatesByDigdeeper(Service._digdeeper, function (dates,ordersDates) {
        noDisponiblesDates = dates
        //console.log(dates)
        //$scope.optionsCalendar.dateDisabled = dates
        // Clasificar las fechas ya ocupadas
        for (var i = 0; i < noDisponiblesDates.length; i++) {
            var noDisponibleDateTemp = {
                date: noDisponiblesDates[i],
                status: 'full'
            }
            $scope.events.push(noDisponibleDateTemp)
        }
        $scope.optionsCalendar.customClass = getDayClass
        //$scope.optionsCalendar.dateDisabled = disabledDates
    },function (err) {
        console.log(err)
    })

    //Obtener las fechas del proveedor fuera de digdeep
    calendarService.getEventsByDigdeeper(Service._digdeeper, $localStorage.token, function (eventsOut) {
        noDisponiblesDates = eventsOut
        //console.log(dates)
        //$scope.optionsCalendar.dateDisabled = dates
        // Clasificar las fechas ya ocupadas
        for (var i = 0; i < noDisponiblesDates.length; i++) {
            var noDisponibleDateTemp = {
                date: noDisponiblesDates[i].date,
                status: 'full'
            }
            $scope.events.push(noDisponibleDateTemp)
        }
        $scope.optionsCalendar.customClass = getDayClass
        //$scope.optionsCalendar.dateDisabled = disabledDates
    },function (err) {
        console.log(err)
    })
   
    this.getHourInit = function (hourinit) {
        $scope.orderService.hourFinal = hourinit
    }
    this.getDateInit = function (dateinit) {
        $scope.optionsCalendar.minDate =  dateinit
    }
    
    this.cancel = function () {
        $uibModalInstance.close()
        location.reload()
    }

    this.putCard = function (card) {
        if (validFormCard(card)) {
            this.nextForm()   
        }else{
            console.log("Formulario invalido")
        }
    }

    this.putBilling = function (billing) {
        if (validFormBilling(billing)) {
            this.nextForm()   
        }else{
            console.log("Formulario invalido")
        }
    }

    this.putDeliveryData = function (autocmpleteAddress,next) {
        if (next === false) {
            // Ajustar dirección en el mapa
            if (validFormDeliveryData($scope.orderService.deliveryData)) {
                getCordinates(autocmpleteAddress) 
            }else{
                console.log("Formulario invalido")
            }   
        }else{
            // solo obtener la dirección
            if (validFormDeliveryData($scope.orderService.deliveryData)) {
                if (autocmpleteAddress != null) {
                    if (autocmpleteAddress.place_id != null) {
                        $scope.orderService.deliveryData.address = autocmpleteAddress.formatted_address
                        var coordinatesTemp = autocmpleteAddress.geometry.location
                        $scope.orderService.coordinates.lat = coordinatesTemp.lat
                        $scope.orderService.coordinates.lng = coordinatesTemp.lng
                        this.nextForm()
                    }else{
                        var deliveryCoordinates = {lat: 19.0342177, lng: -98.2464459}
                        $scope.orderService.deliveryData.address = autocmpleteAddress.formatted_address
                        console.log($scope.orderService.deliveryData.address)
                        geocodeService.getLatLong(autocmpleteAddress, function(latlng) {
                            deliveryCoordinates = latlng
                            $scope.formDelivery = 2
                            if ($scope.formDelivery === 2) {
                                $scope.deliveryMap = {center: cleanLatLng(deliveryCoordinates), zoom: 18, options: mapOptions}   
                            }  
                            
                        }, function(err) {
                            //coordsReady()
                            $scope.deliveryaddressFailed = true
                            console.log("Error ("+err+") al geocodificar delivery address: ")
                        })
                    }
                }else{
                    $scope.deliveryaddressFailed = true
                }    
            }else{
                console.log("Formulario invalido")
            }   
        }
    }

    this.replaceCoordinates = function() {
        $scope.orderService.coordinates.lat = $scope.deliveryMap.center.latitude
        $scope.orderService.coordinates.lng = $scope.deliveryMap.center.longitude
    }

    this.nextForm = function () {
        calculateTotal()
        if ($scope.tabMenuCurrency === "infoService") {
            userService.getUser(Service._digdeeper,function (digdeeper) {
                if (digdeeper.kindServices.indexOf('athome') != -1 && digdeeper.kindServices.indexOf('presencial') != -1) {
                    $scope.athome = true
                    $scope.presencial = true
                    $scope.showAddressDD = true
                    $scope.addressDataDD = digdeeper
                }else{
                    if (digdeeper.kindServices.indexOf('presencial') != -1) {
                        $scope.presencial = true
                        $scope.showAddressDD = true
                        $scope.addressDataDD = digdeeper
                        $scope.orderService.placeService = "presencial"
                    }else{
                        $scope.presencial = false
                    }
                    if (digdeeper.kindServices.indexOf('athome') != -1) {
                        $scope.athome = true
                        $scope.orderService.placeService = "athome"
                    }else{
                        $scope.athome = false
                    }
                }
                nextFormTrue()
                return true
            },function (err) {
                console.log("err")
            })
        }
        if ($scope.tabMenuCurrency === "selectPlaceService") {
            if ($scope.orderService.placeService === "" || $scope.orderService.placeService === undefined) {
                $scope.alertError = "Debes seleccionar un lugar para tu servicio primero."
                $scope.errAlert = true
            }else{
                nextFormTrue()
                return true
            }
        }
        if ($scope.tabMenuCurrency === "dateInit") {
            if ($scope.orderService.dateInit === "" || $scope.orderService.dateInit === undefined) {
                $scope.alertError = "Debes seleccionar una fecha primero."
                $scope.errAlert = true
            }else{
                this.getDateInit($scope.orderService.dateInit)
                nextFormTrue()
                return true
            }
        }
        if ($scope.tabMenuCurrency === "dateFinal") {
            if ($scope.orderService.dateFinal === "" || $scope.orderService.dateFinal === undefined) {
                $scope.alertError = "Debes seleccionar una fecha primero."
                $scope.errAlert = true
            }else{
                nextFormTrue()
                return true
            }
        }
        if ($scope.tabMenuCurrency === "hourSelect") {
            if ($scope.orderService.hourInit === "" || $scope.orderService.hourInit === undefined ||  $scope.orderService.hourFinal === "" || $scope.orderService.hourFinal === undefined) {
                $scope.alertError = "Debes seleccionar los dos horarios."
                $scope.errAlert = true
            }else{
                if ($scope.orderService.hourInit === $scope.orderService.hourFinal) {
                    $scope.alertError = "No puedes tener la misma hora de inicio que de finalización."
                    $scope.errAlert = true
                }else{  
                    nextFormTrue()
                    return true   
                }
            }
        }
        if ($scope.tabMenuCurrency === "confirmContract" || $scope.tabMenuCurrency === "deliveryData" || $scope.tabMenuCurrency === "confirmPaymentCard" || $scope.tabMenuCurrency === "successContract") {
            nextFormTrue()
            if ($scope.tabMenuCurrency === "thanksDigdeepear") {
                processContractFinished()
            }
            return true 
        }
    }
    
    this.selectPaymentType = function(pType){
        $scope.paymentType           = pType
        $scope.orderService.metodPay = pType
    }

    this.showFormFacturation = function () {
        $scope.tabMenuCurrency = "facturation"
    }

    // Poner estilos a los dias no disponibles en el calendario
    function getDayClass(data) {
        var date = data.date
        mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);
            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);
                if (dayToCheck === currentDay) {
                  return $scope.events[i].status;
                }
            }
        }
        return '';
    }

    // Obtener las coordenadas para mostrar el mapa
    function getCordinates(autocmpleteAddress) {
        if (autocmpleteAddress != null) {
            $scope.deliveryaddressFailed = false
            if (autocmpleteAddress.place_id != null) {
                $scope.orderService.deliveryData.address = autocmpleteAddress.formatted_address
                var addressTemp     = autocmpleteAddress.formatted_address
                var coordinatesTemp = autocmpleteAddress.geometry.location
                $scope.orderService.coordinates.lat = coordinatesTemp.lat
                $scope.orderService.coordinates.lng = coordinatesTemp.lng
                $scope.formDelivery = 2
                if ($scope.formDelivery === 2) {
                    $scope.deliveryMap = {center: cleanLatLng(coordinatesTemp), zoom: 18, options: mapOptions}   
                }  
            }else{
                var deliveryCoordinates = {lat: 19.0342177, lng: -98.2464459}
                $scope.orderService.deliveryData.address = autocmpleteAddress.formatted_address
                geocodeService.getLatLong(autocmpleteAddress, function(latlng) {
                    deliveryCoordinates = latlng
                    $scope.formDelivery = 2
                    if ($scope.formDelivery === 2) {
                        $scope.deliveryMap = {center: cleanLatLng(deliveryCoordinates), zoom: 18, options: mapOptions}   
                    }  
                    
                }, function(err) {
                    //coordsReady()
                    $scope.deliveryaddressFailed = true
                    console.log("Error ("+err+") al geocodificar delivery address: ")
                })
            }
        }else{
            $scope.deliveryaddressFailed = true
        }
    }

    // Validar datos del formulario de datos de entrega
    function validFormDeliveryData(deliverydata) {
        if (angular.isDefined(deliverydata.name) && deliverydata.name !== null) {
            if(deliverydata.name.length === 0 || deliverydata.name === undefined || deliverydata.name === null){
                $scope.deliverynameFailed = true
                return false
            }else $scope.deliverynameFailed = false
        }
        else{
            $scope.deliverynameFailed = true
            return false
        }

        if (angular.isDefined(deliverydata.email) && deliverydata.email !== null) {
            if(deliverydata.email.length === 0 || deliverydata.email === undefined || deliverydata.email === null){
                $scope.deliveryemailFailed = true
                return false
            }else $scope.deliveryemailFailed = false
        }
        else{
            $scope.deliveryemailFailed = true
            return false
        }

        if (angular.isDefined(deliverydata.phone) && deliverydata.phone !== null) {
            if(deliverydata.phone.length === 0 || deliverydata.phone === undefined || deliverydata.phone === null){
                $scope.deliveryphoneFailed = true
                return false
            }else $scope.deliveryphoneFailed = false
        }
        else{
            $scope.deliveryphoneFailed = true
            return false
        }
        return true
    }

    // Validar formulario de factura
    function validFormBilling(billing) {
        if (angular.isDefined(billing.fullname) && billing.fullname !== null) {
            if(billing.fullname.length === 0 || billing.fullname === undefined || billing.fullname === null){
                $scope.billingNameFailed = true
                return false
            }else $scope.billingNameFailed = false
        }
        else{
            $scope.billingNameFailed = true
            return false
        }

        if (angular.isDefined(billing.rfc) && billing.rfc !== null) {
            if(billing.rfc.length === 0 || billing.rfc === undefined || billing.rfc === null){
                $scope.billingRfcFailed = true
                return false
            }else $scope.billingRfcFailed = false
        }
        else{
            $scope.billingRfcFailed = true
            return false
        }

        if (angular.isDefined(billing.phone) && billing.phone !== null) {
            if(billing.phone.length === 0 || billing.phone === undefined || billing.phone === null){
                $scope.billingPhoneFailed = true
                return false
            }else $scope.billingPhoneFailed = false
        }
        else{
            $scope.billingPhoneFailed = true
            return false
        }

        if (angular.isDefined(billing.cp) && billing.cp !== null) {
            if(billing.cp.length === 0 || billing.cp === undefined || billing.cp === null){
                $scope.billingCPFailed = true
                return false
            }else $scope.billingCPFailed = false
        }
        else{
            $scope.billingCPFailed = true
            return false
        }
        return true
    }

    // Validar formulario de una tarjeta
    function validFormCard(card) {
        if (angular.isDefined(card.num) && card.num !== null) {
            if(card.num.length === 0 || card.num === undefined || card.num === null){
                $scope.numCardFailed = true
                return false
            }else $scope.numCardFailed = false
        }
        else{
            $scope.numCardFailed = true
            return false
        }

        if (angular.isDefined(card.dateVen1) && card.dateVen1 !== null) {
            if(card.dateVen1.length === 0 || card.dateVen1 === undefined || card.dateVen1 === null){
                $scope.dateVenFailed = true
                return false
            }else $scope.dateVenFailed = false
        }
        else{
            $scope.dateVenFailed = true
            return false
        }

        if (angular.isDefined(card.dateVen2) && card.dateVen2 !== null) {
            if(card.dateVen2.length === 0 || card.dateVen2 === undefined || card.dateVen2 === null){
                $scope.dateVenFailed = true
                return false
            }else $scope.dateVenFailed = false
        }
        else{
            $scope.dateVenFailed = true
            return false
        }

        if (angular.isDefined(card.cod) && card.cod !== null) {
            if(card.cod.length === 0 || card.cod === undefined || card.cod === null){
                $scope.codCardFailed = true
                return false
            }else $scope.codCardFailed = false
        }
        else{
            $scope.codCardFailed = true
            return false
        }
        return true
    }

    // pasar al siguiente formulario(modal) del proceso
    function nextFormTrue() {
        $scope.errAlert = false
        $scope.tabMenu++
        $scope.tabMenuCurrency = $scope.menuModalsCardCredit[$scope.tabMenu]
    }

    // función que calcula el total del pago segun el lugar donde será el servicio
    function calculateTotal() {
        // si tiene activas los dos tipos de servicios
        if ($scope.typePrice === 1) {
            if ($scope.orderService.placeService != "" && $scope.orderService.placeService != null && $scope.orderService.placeService != undefined) {
                if ($scope.orderService.placeService == "athome") {
                    $scope.orderService.total = $scope.service.price_athome
                }else{
                    if ($scope.orderService.placeService == "presencial") {
                        $scope.orderService.total = $scope.service.price_presencial
                    }
                }
            }
            
        }
        // si tiene activo el tipo de servicio adomicilio
        if ($scope.typePrice === 2) {
            $scope.orderService.total = $scope.service.price_athome
        }
        // si tiene el tipo de servicio activo en el establecimiento
        if ($scope.typePrice === 3) {
            $scope.orderService.total = $scope.service.price_presencial
        }
    }

    // función que procesa los datos de una orden y los guarda
    function processContractFinished() {
        User = userService.getUserFromToken($localStorage.token)
        rolesUser = User.roles
        //Obtener la foto y el nombre del proveedor del  servicio a contratar
        userService.getDataUserToService(Service._digdeeper,$localStorage.token, function (proveedor) {
            $scope.orderService.nameDD = proveedor.name
            $scope.orderService.imgDD = proveedor.picture
            // obtener los datos para factura
            $scope.orderService.dataBilling.name    = $scope.billing.fullname
            $scope.orderService.dataBilling.rfc     = $scope.billing.rfc
            $scope.orderService.dataBilling.phone   = $scope.billing.phone
            $scope.orderService.dataBilling.cp      = $scope.billing.cp

            var contractBlocked = true 
            if (rolesUser !== undefined) {
                var n = rolesUser.indexOf("user")
                if (n != -1) {
                    contractBlocked = false
                }else{
                    contractBlocked = true
                }
            }
            if (contractBlocked === true) {
                if (rolesUser !== undefined) {
                     if (rolesUser[0] === "digdeeper") {
                        //alert("No puedes contratar un servicio, puesto que tu cuenta solo es digdeeper, registrate con una cuenta normal, para poder contratar nuestros servicios")
                        $uibModalInstance.close()
                        $rootScope.$emit("openAlertDigdeepModal",{
                            textAlert: "No puedes contratar un servicio, puesto que tu cuenta solo es digdeeper, registrate con una cuenta normal, para poder contratar nuestros servicios"
                        })
                    }else{
                        //alert("Necesitas ingresar a tu cuenta para poder contratar nuestros servicios, o registrate en nuestra pagína gratuitamente")
                        $uibModalInstance.close()
                        $rootScope.$emit("openAlertDigdeepModal",{
                            textAlert: "Necesitas ingresar a tu cuenta para poder contratar nuestros servicios, o regístrate en nuestra página gratuitamente"
                        })
                        $state.go("login")
                    }
                }else{
                    //alert("Necesitas ingresar a tu cuenta para poder contratar nuestros servicios, o registrate en nuestra pagína gratuitamente")
                    $uibModalInstance.close()
                    $rootScope.$emit("openAlertDigdeepModal",{
                        textAlert: "Necesitas ingresar a tu cuenta para poder contratar nuestros servicios, o regístrate en nuestra página gratuitamente."
                    })
                    $state.go("login")
                }
               
            }else{
                // Primero se postea y crea la orden
                ordersService.postOrder($scope.orderService,$localStorage.token, function (order) {
                    // Se le añade al usuario la orden creada
                    userService.useraddorder(User._id, order, $localStorage.token, function (user) {
                        sendEmail(order)
                        setTimeout(function() {
                            $scope.$apply(function() {
                                $uibModalInstance.close()
                                // Cuando el servicio sea contratado correctamente se redigira a su perfil
                                if (rolesUser.indexOf("user") != -1) {
                                    if (rolesUser.indexOf("digdeeper") != -1) {
                                        $state.go("historyorders")
                                    }else{
                                        $state.go("userprofile")
                                    }
                                }
                            })
                        }, 2000);
                    },function (err) {
                        console.log(err)
                        $uibModalInstance.close()
                        alert(err.data.message)
                    })
                },function (err) {
                    console.log(err)
                    $uibModalInstance.close()
                    alert(err.data.message)
                })
            } 
        },function (err) {
            console.log(err)
            $uibModalInstance.close()
            alert(err.data.message)
        }) 
    }

    // Obtener el més segun un número
    function getMonth(monthNumber) {
        if (monthNumber === 0) {
            return "Enero"
        }
        if (monthNumber === 1) {
            return "Febrero"
        }
        if (monthNumber === 2) {
            return "Marzo"
        }
        if (monthNumber === 3) {
            return "Abril"
        }
        if (monthNumber === 4) {
            return "Mayo"
        }
        if (monthNumber === 5) {
            return "Junio"
        }
        if (monthNumber === 6) {
            return "Julio"
        }
        if (monthNumber === 7) {
            return "Agosto"
        }
        if (monthNumber === 8) {
            return "Septiembre"
        }
        if (monthNumber === 9) {
            return "Octubre"
        }
        if (monthNumber === 10) {
            return "Noviembre"
        }
        if (monthNumber === 11) {
            return "Diciembre"
        }
    }

    // Enviar por correo los datos de la orden 
    function sendEmail(Order) {
        var dateComments = new Date()
        var d = dateComments.getDate();
        var m = dateComments.getMonth();
        var y = dateComments.getFullYear();
        var monthString = getMonth(m)
        var dateCommentsString = String(d)+"/"+monthString+"/"+String(y)

        var dateFormated = new Date(Order.dataService.dateInit)
        d = dateFormated.getDate();
        m = dateFormated.getMonth();
        y = dateFormated.getFullYear();
        monthString = getMonth(m)
        dateInit = String(d)+"/"+monthString+"/"+String(y)

        dateFormated = new Date(Order.dataService.dateFinish)
        d = dateFormated.getDate();
        m = dateFormated.getMonth();
        y = dateFormated.getFullYear();
        monthString = getMonth(m)
        var dateFinish = String(d)+"/"+monthString+"/"+String(y)

        dateFormated = new Date(Order.dataService.hourInit)
        var hh = dateFormated.getHours();
        var mm = dateFormated.getMinutes();
        var hourInit = String(hh)+":"+String(mm)

        dateFormated = new Date(Order.dataService.hourFinish)
        hh = dateFormated.getHours();
        mm = dateFormated.getMinutes();
        var hourFinish = String(hh)+":"+String(mm)
                        
        // Obtener los datos del cliente
        userService.getUser(Order.client,function (client) {
            // obtener los datos del proveedor
            userService.getUser(Order.digdeeper,function (digdeeper) {
                //
                // Configurando datos para genarar el correo a enviar a Soporte Digdeeper
                var html =  "<div style='text-align:right'><p>Fecha: "+dateCommentsString+"</p></div>"+
                            "<p>Hola un coordial saludo "+client.fullname+"<br>Tu orden ha sido generada correctamente</p>"+
                            "<hr>"+
                            "<p>Datos del Proveedor</p>"+
                            "<p>Nombre: "+Order.dataService.nameDD+"</p>"+
                            "<img src='"+Order.dataService.imgDD+"' style='margin: 0 auto;'>"+
                            "<p>Titulo del servicio: "+Order.dataService.title+"</p>"+
                            "<p>Fecha de inicio: "+dateInit+"</p>"+
                            "<p>Fecha en que termina: "+dateFinish +"</p>"+
                            "<p>Hora de inicio: "+hourInit+" hrs.</p>"+
                            "<p>Hora en que termina: "+hourFinish+" hrs.</p>"+
                            "<img src='"+Order.dataService.picture+"' style='margin: 0 auto'>"+
                            "<hr>"+
                            "<div style='text-align:center'><h3>PRECIO</h3>"+
                            "<p>$"+Order.dataService.cost+".00 MXN</p>"+
                            "</div>"

                var emailusers = client.email+","+digdeeper.email+","+"manager@digdeep.com.mx" //en el ultimo correo poner a digdeep
                var data = {
                HTML:       html,
                subject:    "ORDEN DE SERVICIO CONTRATADO",
                to:         emailusers,
                text:       "Gracias por digdeepear"
                }
                $http.post("v1/emails", data)
                .then(function(response) {
                    if(response.data.status === "success"){
                        //$uibModalInstance.close()
                        //$rootScope.$emit("openAlertDigdeepModal", {textAlert:"Se ha enviado tus comentarios a DIGDEEP, Gracias por ayudarnos a mejorar para ti."})
                    }
                    else{
                        $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Mensaje NO enviado, no se le pudo avisar a DIGDEEP contactalo..."})
                    }
                })

                //
                },function (err) {
                    console.log(err)
                })       
            
            },function (err) {
                console.log(err)
            })
    }
    
    // Para mandar a la directive de mapa la lat, lng debe ser un objeto simple tipo {latitude:123,longitude:456}
    function cleanLatLng(object) {
        var string = JSON.stringify(object).replace("lat", 'latitude').replace('lng', 'longitude')
        return JSON.parse(string)
    }

    // Desactivar las fechas en el calendario
    function disabledDates(data) {
        var date = data.date
        mode = data.mode
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);
            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);
                if (dayToCheck === currentDay) {
                  return $scope.events[i];
                }
            }
        }
        return '';
    }
}])