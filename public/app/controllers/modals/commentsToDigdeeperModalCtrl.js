angular.module('digdeepApp.commentsToDigdeeperModalCtrl', ['ui.bootstrap'])

.controller('commentsToDigdeeperModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                                    $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openCommentsDigdeeperModal = function (Order,size,parentSelector) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/commentsToDigdeeperModal.html',
            controller: 'commentsToDigdeeperModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'md',
            resolve: {
                Order: function() {return Order}
            }
        })     
    }

    $rootScope.$on('openCommentsDigdeeperModal', function(Order,size,parentSelectora) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/commentsToDigdeeperModal.html',
            controller: 'commentsToDigdeeperModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'md',
            resolve: {
                Order: function() {return Order}
            }
        })     
    })

}])

.controller('commentsToDigdeeperModalInstanceCtrl', ['serviceService','$rootScope', '$uibModalInstance', 'ordersService', '$localStorage', 'Order', '$scope','$state', 'userService', '$http', 'commentsService',
function (                                            serviceService,  $rootScope,   $uibModalInstance,   ordersService,   $localStorage,   Order,   $scope,  $state,   userService,   $http,   commentsService) {
    
    $scope.comments = ""
    
    this.commentServiceDigdeeper = function () {
        saveComment()
        sendEmail()
    } 
    
    function sendEmail() {
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
            serviceService.getService(Order.dataService._service, function (service) {
                // Configurando datos para genarar el correo a enviar a Soporte Digdeeper
                var html =  "<div style='text-align:right'><p>Fecha: "+dateCommentsString+"</p></div>"+
                            "<div style='text-align:center'><p>Hola un coordial saludo por parte de uno de tus clientes</p></div>"+
                            "<div style='text-align:center'><p>Cliente: "+client.fullname+" ,E-mail: "+client.email+"</p></div>"+
                            "<div style='text-align:center'><p>Tengo Comentarios que hacer sobre un servicio de tus proveedores</p></div>"+
                            "<div style='text-align:left'><p>Comentarios:</p>"+
                            "<p>"+$scope.comments+"</p>"+
                            "<hr>"+
                            "<p>Datos del Proveedor del servicio contratado</p>"+
                            "<p>Nombre de proveedor: "+Order.dataService.nameDD+"</p>"+
                            "<img src='"+Order.dataService.imgDD+"'>"+
                            "<p>Nombre del servicio: "+Order.dataService.title+"</p>"+
                            "<p>Fecha de inicio del servicio: "+dateInit+"</p>"+
                            "<p>Fecha de finalización del servicio: "+dateFinish +"</p>"+
                            "<p>Hora de inicio del servicio: "+hourInit+" hrs.</p>"+
                            "<p>Hora de finalización del servicio: "+hourFinish+" hrs.</p>"+
                            "<p>Precio: $"+Order.dataService.cost+".00</p>"+
                            "<img src='"+Order.dataService.picture+"'></div>"

                var data = {
                HTML:       html,
                subject:    "CLIENTE, comentarios de un servicio",
                to:         "manager@digdeep.com.mx",// correo de Digdeep
                text:       "Gracias por digdeepear"
                }
                var dataEmail = {
                    date_comments: dateCommentsString,
                    client_name: client.fullname,
                    client_email: client.email,
                    comments: $scope.comments,
                    service: {
                        title: Order.dataService.title,
                        digdeeper_name: Order.dataService.nameDD,
                        digdeeper_picture: Order.dataService.imgDD,
                        date_init: dateInit,
                        date_finish: dateFinish,
                        hour_init: hourInit,
                        hour_finish: hourFinish,
                        cost: Order.dataService.cost,
                        picture: Order.dataService.picture,
                        description: service.description
                    }
                }
                $http.post("v1/emails_comments", dataEmail)
                .then(function(response) {
                    if(response.data.status === "success"){
                        //$uibModalInstance.close()
                        $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Se ha enviado tus comentarios a DIGDEEP, Gracias por ayudarnos a mejorar para ti."})
                    }
                    else{
                        $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Mensaje NO enviado, no se le pudo avisar a DIGDEEP contactalo..."})
                    }
                })
            }, function (err) {
                console.log(err)
            })
             
        },function (err) {
            console.log(err)
        })
    }
    function saveComment() {
        var dateComment = new Date()
        userService.getUser(Order.client,function (client) {
            userService.getUser(Order.digdeeper,function (digdeeper) {
                 var data = {
                    dateCommented:  dateComment,
                    textComments:   $scope.comments,
                    nameClient:     client.fullname,
                    emailClient:    client.email,
                    pictureClient:  client.urlImg,
                    idClient:       client._id,
                    nameDigdeeper:  digdeeper.fullname,
                    phoneDigdeeper: digdeeper.phone,
                    pictureDigdeeper: digdeeper.urlImg,
                    idDigdeeper:    digdeeper._id,
                    idOrder:        Order._id,
                    titleService:   Order.dataService.title
                }
                commentsService.createComment(data, function (comment) {
                    serviceService.addComment(Order.dataService._service,comment._id,$localStorage.token,function (ser) {
                        console.log(ser)
                        $uibModalInstance.close()
                        $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Comentario creado correctamente"})
                    },function (err) {
                        console.log(err)
                    })
                },function (err) {
                    console.log(err)
                    $rootScope.$emit("openAlertDigdeepModal", {textAlert:"Mensaje NO enviado, no se le pudo avisar a DIGDEEP contactalo..."})
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
        $uibModalInstance.close()
    }

}])

