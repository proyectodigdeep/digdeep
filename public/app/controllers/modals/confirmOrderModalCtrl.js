angular.module('digdeepApp.confirmOrderModalCtrl', ['ui.bootstrap'])

.controller('confirmOrderModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                             $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openConfirmOrderModal = function (idOrder, size, parentSelector) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/confirmOrderModal.html',
            controller: 'confirmOrderModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                idOrder: function() {return idOrder},
                done: function() {}
            }
        })     
    }

    // Abrir modal si es que se pide desde fuera a traves del evento "openDeleteServiceModal"
    $rootScope.$on('openConfirmOrderModal', function(idOrder, size, parentSelectora) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/confirmOrderModal.html',
            controller: 'confirmOrderModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                idOrder: function() {return idOrder},
                done: function() {}
            }
        })     
    })

}])

.controller('confirmOrderModalInstanceCtrl', ['$rootScope', '$uibModalInstance', 'ordersService', '$localStorage', 'idOrder', 'done', '$scope','$state','userService','$http', 'serviceService',
function (                                     $rootScope,   $uibModalInstance,   ordersService,   $localStorage,   idOrder,   done,   $scope,  $state,  userService,  $http, serviceService) {
    // Aceptar y confirmar un servicio

    this.confirmOrder = function () {
        var startDateService = new Date()
        var html = ""
        ordersService.confirmOrder(idOrder,startDateService,$localStorage.token, function (order) {
            $uibModalInstance.close()
            $rootScope.$emit("openAlertDigdeepModal",{
                textAlert: "Orden confirmada correctamente"
            })
            $state.go("historyservices")
            
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

            // Obtener los datos del digdeeper para enviarselos a el cliente
            userService.getUser(order.digdeeper,function (digdeeper) {
                serviceService.getService(order.dataService._service, function (service) {
                    // Configurando datos para genarar el correo a enviar a el cliente
                    html =  "<p>Hola un coordial saludo por parte de DIGDEEP<br>Tenemos buenas noticias, TU SOLICITUD DEL SERVICIO HA SIDO ACEPTADA POR EL PROVEEDOR</p>"+
                            "<p>Datos del Proveedor del servicio</p>"+
                            "<p>Nombre: "+digdeeper.fullname+"</p>"+
                            "<p>Datos del Servicio que contrataste</p>"+
                            "<p>Nombre del servicio: "+order.dataService.title+"</p>"+
                            "<p>Fecha de inicio: "+dateInit+"</p>"+
                            "<p>Fecha final: "+dateFinish +"</p>"+
                            "<p>Hora de inicio: "+hourInit+" hrs.</p>"+
                            "<p>Hora de finalización: "+hourFinish+" hrs.</p>"+
                            "<p>Precio: $"+order.dataService.cost+".00</p>"+
                            "<div><img src='"+order.dataService.picture+"'></div>"
                    // Obtener los datos del cliente
                    userService.getUser(order.client,function (client) {
                        var data = {
                        HTML:       html,
                        subject:    "DIGDEEP, Servicio confirmado",
                        to:         client.email,
                        text:       "Gracias por digdeepear"
                        }
                        var dataEmail = {
                            digdeeper_name: digdeeper.fullname,
                            client_name: client.fullname,
                            service:{
                                title: order.dataService.title,
                                date_init: dateInit,
                                date_finish: dateFinish,
                                hour_init: hourInit,
                                hour_finish: hourFinish,
                                cost: order.dataService.cost,
                                picture: order.dataService.picture,
                                id: order._id,
                                description: service.description
                            },
                            to_send_users: client.email
                        }
                        $http.post("v1/emailsconfirm", dataEmail)
                        .then(function(response) {
                            if(response.data.status === "success"){
                                $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Se le ha enviado un correo a tu cliente"})
                            }
                            else{
                                $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Mensaje NO enviado, no se le pudo avisar a tu cliente contactalo"})
                            }
                        })
                    },function (err) {
                        console.log(err)
                    })
                }, function (err) {
                    console.log(err)
                })
                
                
            },function (err) {
                console.log(err)
            }) 
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
        $uibModalInstance.dismiss('cancel')
    }


}])

