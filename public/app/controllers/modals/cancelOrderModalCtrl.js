angular.module('digdeepApp.cancelOrderModalCtrl', ['ui.bootstrap'])

.controller('cancelOrderModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                            $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openCancelOrderModal = function (idOrder,idUser,rolCancel,size, parentSelector) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/cancelOrderModal.html',
            controller: 'cancelOrderModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'md',
            resolve: {
                idOrder: function() {return idOrder},
                idUser: function() {return idUser},
                rolCancel: function() {return rolCancel},
                done: function() {}
            }
        })     
    }

    $rootScope.$on('openCancelOrderModal', function(idOrder,idUser,rolCancel,size, parentSelectora) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/cancelOrderModal.html',
            controller: 'cancelOrderModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'md',
            resolve: {
                idOrder: function() {return idOrder},
                idUser: function() {return idUser},
                rolCancel: function() {return rolCancel},
                done: function() {}
            }
        })     
    })

}])

.controller('cancelOrderModalInstanceCtrl', ['rolCancel','$rootScope', '$uibModalInstance', 'ordersService', '$localStorage', 'idOrder', 'idUser','done', '$scope','$state', 'userService', '$http',
function (                                    rolCancel,  $rootScope,   $uibModalInstance,   ordersService,   $localStorage,   idOrder,   idUser,  done,   $scope,  $state,   userService,   $http) {
    
    $scope.cancellationReasons = ""
    
    this.cancelOrderDD = function () {
        var endDateOrder = new Date()
        var dataCancel = {
            id_user: idUser,
            cancellationReasons: $scope.cancellationReasons,
            endDateOrder: endDateOrder
        }
        ordersService.cancelOrder(idOrder,dataCancel,$localStorage.token, function (order) {
            $uibModalInstance.close()
            if (rolCancel === "digdeeper") {
                $state.go("historyservices")
            }
            $rootScope.$emit("openAlertDigdeepModal",{
                textAlert: "Orden cancelada correctamente"
            })

            var dateFormated = new Date(order.dataService.dateInit)
            var d = dateFormated.getDate();
            var m = dateFormated.getMonth();
            var y = dateFormated.getFullYear();
            var monthString = getMonth(m)
            var dateInit = String(d)+"/"+monthString+"/"+String(y)

            dateFormated = new Date(order.dataService.dateFinish)
            d = dateFormated.getDate();
            m = dateFormated.getMonth();
            y = dateFormated.getFullYear();
            monthString = getMonth(m)
            var dateFinish = String(d)+"/"+monthString+"/"+String(y)

            dateFormated = new Date(order.dataService.hourInit)
            var hh = dateFormated.getHours();
            var mm = dateFormated.getMinutes();
            var hourInit = String(hh)+":"+String(mm)

            dateFormated = new Date(order.dataService.hourFinish)
            hh = dateFormated.getHours();
            mm = dateFormated.getMinutes();
            var hourFinish = String(hh)+":"+String(mm)

            if (rolCancel === "client") {
                // Obtener los datos del cliente para enviarselos a el cliente
                userService.getUser(order.client,function (client) {
                    // Configurando datos para genarar el correo a enviar a el cliente
                    html =  "<p>Hola un coordial saludo por parte de DIGDEEP</p><p>Tenemos y lamentamos darte malas noticias, puesto que TU SERVICIO FUE CANCELADO POR EL CLIENTE</p>"+
                            "<p>Las razones de cancelación, que dio el cliente son:</p>"+
                            "<p>"+order.dataCancelOrder.cancelReasons+"</p>"+
                            "<p>Nombre del cliente: "+client.fullname+"</p>"+
                            "<p>Datos del Servicio que había contratado</p>"+
                            "<p>Nombre del servicio: "+order.dataService.title+"</p>"+
                            "<p>Fecha de inicio: "+dateInit+"</p>"+
                            "<p>Fecha final: "+dateFinish +"</p>"+
                            "<p>Hora de inicio: "+hourInit+" hrs.</p>"+
                            "<p>Hora de finalización: "+hourFinish+" hrs.</p>"+
                            "<p>Precio: $"+order.dataService.cost+".00</p>"+
                            "<div><img src='"+order.dataService.picture+"'></div>"+
                            "<p>Ponte en contacto con DIGDEEP Tel: (222) 290-9180 (222) 431-8868 </p>"
                            
                    // Obtener los datos del proveedor
                    userService.getUser(order.digdeeper,function (digdeeper) {
                        var data = {
                        HTML:       html,
                        subject:    "DIGDEEP, Servicio cancelado",
                        to:         digdeeper.email+","+"manager@digdeep.com.mx",
                        text:       "Gracias por digdeepear"
                        }
                        $http.post("v1/emails", data)
                        .then(function(response) {
                            if(response.data.status === "success"){
                                $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Se le ha enviado un correo a tu proveedor"})
                            }
                            else{
                                $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Mensaje NO enviado, no se le pudo avisar a tu proveedor contacta a DIGDEEP"})
                            }
                        },function (response) {
                            $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Mensaje NO enviado, no se le pudo avisar a tu proveedor contacta a DIGDEEP"})
                        })
                    },function (err) {
                        console.log(err)
                    })
                    
                },function (err) {
                    console.log(err)
                })
            }else{
                if (rolCancel === "digdeeper") {
                    // Obtener los datos del digdeeper para enviarselos a el cliente
                    userService.getUser(order.digdeeper,function (digdeeper) {
                        // Configurando datos para genarar el correo a enviar a el cliente
                        html =  "<p>Hola un coordial saludo por parte de DIGDEEP</p><p>Tenemos y lamentamos darte malas noticias, puesto que TU SOLICITUD DEL SERVICIO NO HA SIDO ACEPTADA POR EL PROVEEDOR</p>"+
                                "<p>Las razones de cancelación, que dio el proveedor son:</p>"+
                                "<p>"+order.dataCancelOrder.cancelReasons+"</p>"+
                                "<p>Datos del Proveedor del servicio que habías contratado</p>"+
                                "<p>Nombre: "+digdeeper.fullname+"</p>"+
                                "<p>Telefono: "+digdeeper.phone+"</p>"+
                                "<p>Email de proveedor: "+digdeeper.email+"</p>"+
                                "<p>Datos del Servicio que habías contratado</p>"+
                                "<p>Nombre del servicio: "+order.dataService.title+"</p>"+
                                "<p>Fecha de inicio: "+dateInit+"</p>"+
                                "<p>Fecha final: "+dateFinish +"</p>"+
                                "<p>Hora de inicio: "+hourInit+" hrs.</p>"+
                                "<p>Hora de finalización: "+hourFinish+" hrs.</p>"+
                                "<p>Precio: $"+order.dataService.cost+".00</p>"+
                                "<div><img src='"+order.dataService.picture+"'></div>"+
                                "<p>Ponte en contacto con DIGDEEP Tel: 2221212212 </p>"
                                
                        // Obtener los datos del cliente
                        userService.getUser(order.client,function (client) {
                            var data = {
                            HTML:       html,
                            subject:    "DIGDEEP, Servicio cancelado",
                            to:         client.email+","+"manager@digdeep.com.mx",
                            text:       "Gracias por digdeepear"
                            }
                            $http.post("v1/emails", data)
                            .then(function(response) {
                                if(response.data.status === "success"){
                                    $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Se le ha enviado un correo a tu cliente"})
                                }
                                else{
                                    $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Mensaje NO enviado, no se le pudo avisar a tu cliente contacta a DIGDEEP"})
                                }
                            })
                        },function (err) {
                            console.log(err)
                        })
                        
                    },function (err) {
                        console.log(err)
                    })
                }
            }
            
            //
        },function (err) {
            console.log(err)
        })
    } 

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

    this.cancel = function () {
        $uibModalInstance.close()
    }

}])

