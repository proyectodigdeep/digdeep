angular.module('digdeepApp.payTotalServiceModalCtrl', ['ui.bootstrap'])

    .controller('payTotalServiceModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
        function ($rootScope, $scope, $uibModal, $document) {

            $scope.openPayTotalServiceModal = function (idOrder, idUser, order, size, parentSelector) {
                $uibModal.open({
                    animation: true,
                    templateUrl: '/app/templates/modals/payTotalServiceModal.html',
                    controller: 'payTotalServiceModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    size: 'sm',
                    resolve: {
                        idOrder: function () {
                            return idOrder
                        },
                        idUser: function () {
                            return idUser
                        },
                        order: function () {
                            return order
                        }
                    }
                })
            }

            $rootScope.$on('openPayTotalServiceModal', function (idOrder, idUser, order, size, parentSelectora) {
                $uibModal.open({
                    animation: true,
                    templateUrl: '/app/templates/modals/payTotalServiceModal.html',
                    controller: 'payTotalServiceModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    size: 'sm',
                    resolve: {
                        idOrder: function () {
                            return idOrder
                        },
                        idUser: function () {
                            return idUser
                        },
                        order: function () {
                            return order
                        }
                    }
                })
            })

        }
    ])

    .controller('payTotalServiceModalInstanceCtrl', [
        'order', '$rootScope', '$uibModalInstance', 'ordersService', '$localStorage', 'idOrder', 'idUser', '$scope', '$state', 'userService', '$http', 'conektaService', 'APP_MESSAGES',
        function (order, $rootScope, $uibModalInstance, ordersService, $localStorage, idOrder, idUser, $scope, $state, userService, $http, conektaService, APP_MESSAGES) {

            $scope.order = order;
            $scope.idUser = idUser

            $scope.card = {
                number: null,
                name: null,
                exp_month: null,
                exp_year: null,
                cvc: null
            };
            $scope.errorMessage = null;
            $scope.nameFailed = false;
            $scope.formularioPago = 2
            $scope.methodPayDefault = undefined
            verifyMethodPay()

            this.cancel = function () {
                $uibModalInstance.close()
            };
                
            this.putCard = function (card) {
                $scope.errorMessage = null;
                // validaion del titular de la tarjeta
                if (!$scope.card.name || $scope.card.name === '') {
                    $scope.errorMessage = APP_MESSAGES.CONEKTA.TITULAR_REQUERIDO;
                    return false;
                }
                
                // Validacion de la tarjeta
                conektaService.validarTarjeta($scope.card).then(function (result) {                    
                    $rootScope.$emit("openAlertDigdeepModal", { textAlert: "Guardando los datos de su compra." });
                    // creando token                    
                    conektaService.tokenizar($scope.card).then(function (response) {
                        if (response.success) {                        
                            var payDate = new Date()
                            ordersService.payOrder(order._id, payDate, response.token.id, 'card', $localStorage.token, function (ord) {
                                $rootScope.$emit("openAlertDigdeepModal", { textAlert: "Servicio pagado correctamente, te enviaremos un correo con los detalles de tu compra, Gracias por Digdeépear con nostros." })
                                $uibModalInstance.close()
                            }, function (err) {
                                $rootScope.$emit("openAlertDigdeepModal", { textAlert: "No se pudo guardar los datos de tu compra, contacta a DIGDEEP por favor." })
                                $uibModalInstance.close()
                            });                        
                        }else{
                            $rootScope.$emit("openAlertDigdeepModal", { textAlert: "No se pudo guardar los datos de tu compra. Verifica tus datos por favor." })
                        }
                    }, function (errResponse) {
                        $scope.errorMessage = errResponse.message;
                    });
                }, function (error) {                    
                    $scope.errorMessage = error.message;
                });
            }
            //$rootScope.$emit("openAlert", { textAlert: "Servicio pagado correctamente, te enviaremos un correo con los detalles de tu compra, Gracias por Digdeépear con nostros." })
                                
            this.realizarPagoTarjeta = function (card) {
                $rootScope.$emit("openAlertDigdeepModal", { textAlert: "Procesando el pago..." });
                $scope.errorMessage = null;
                // validaion del titular de la tarjeta
                if (!$scope.card.name || $scope.card.name === '') {
                    $scope.errorMessage = APP_MESSAGES.CONEKTA.TITULAR_REQUERIDO;
                    return false;
                }
                
                // Validacion de la tarjeta
                conektaService.validarTarjeta($scope.card).then(function (result) {                    
                    $rootScope.$emit("openAlertDigdeepModal", { textAlert: "Guardando los datos de su compra." });
                    // creando token                    
                    console.log($scope.card)
                    conektaService.tokenizar($scope.card).then(function (response) {
                        if (response.success) {                        
                            var payDate = new Date()
                            ordersService.payOrder(order._id, payDate, response.token.id, 'card', $localStorage.token, function (ord) {
                                $rootScope.$emit("openAlert", { textAlert: "Servicio pagado correctamente, te enviaremos un correo con los detalles de tu compra, Gracias por Digdeépear con nostros." })
                                $uibModalInstance.close()
                            }, function (err) {
                                $rootScope.$emit("openAlert", { textAlert: "No se pudo guardar los datos de tu compra, contacta a DIGDEEP por favor." })
                                $uibModalInstance.close()
                            });                        
                        }else{
                            $rootScope.$emit("openAlert", { textAlert: "No se pudo guardar los datos de tu compra. Verifica tus datos por favor." })
                        }
                    }, function (errResponse) {
                        $scope.errorMessage = errResponse.message;
                    });
                }, function (error) {                    
                    $scope.errorMessage = error.message;
                });
            }

            this.realizarPagoTarjetaExistente = function (idSource) {
                var payDate = new Date()
                ordersService.payOrder(order._id, payDate, idSource, 'card', $localStorage.token, function (ord) {
                    $rootScope.$emit("openAlert", { textAlert: "Servicio pagado correctamente, te enviaremos un correo con los detalles de tu compra, Gracias por Digdeépear con nostros." })
                    $uibModalInstance.close()
                }, function (err) {
                    $rootScope.$emit("openAlert", { textAlert: "No se pudo guardar los datos de tu compra, contacta a DIGDEEP por favor." })
                    $uibModalInstance.close()
                }); 
            }


            this.selectMethodPay = function (methodPay) {
                $scope.methodPayDefault = methodPay
                console.log(methodPay)
            }

            this.createOrdenToSpei = function() {        
                var payDate = new Date()
                ordersService.payOrder(order._id, payDate, null, 'spei', $localStorage.token, function (ord) {          
                    $rootScope.$emit("openAlert", {
                        textAlert: "Orden generada exitosamente, en unos minutos recibirá un correo con la información de pago."
                    });
                }, function (err) {         
                    console.error('err ordern response: ', err);
                    $rootScope.$emit("openAlert", {
                        textAlert: "Algo salio mal, orden no generada, "+err.data.message
                    })
                });                        
            };

            this.agregarTarjetaNueva = function () {
               // Validacion de la tarjeta
                conektaService.validarTarjeta($scope.card).then(function (result) {                    
                    $rootScope.$emit("openAlertDigdeepModal", { textAlert: "Guardando los datos de su tarjeta." });
                    // creando token                    
                    conektaService.tokenizar($scope.card).then(function (response) {
                        if (response.success) {                        
                            userService.addMethodPayToCustomer(idUser, response.token.id, $localStorage.token, function (methodsPay) {
                                $scope.methodsPay = methodsPay.data
                                $scope.formularioPago = 1
                                verifyMethodPay()
                            }, function (err) {
                                console.log(err)
                            })              
                        }else{
                            $rootScope.$emit("openAlert", { textAlert: "No se pudo guardar los datos de tu tarjeta. Verifica tus datos por favor." })
                        }
                    }, function (errResponse) {
                        $scope.errorMessage = errResponse.message;
                    });
                }, function (error) {                    
                    $scope.errorMessage = error.message;
                });
            }

            this.showFormSelectMethodPay = function () {
                $scope.formularioPago = 1
                $scope.methodPayDefault = undefined
                $scope.metodoPago = undefined
            }

            this.showFormNewCard = function () {
                $scope.formularioPago = 2
                $scope.methodPayDefault = 'add_card'
            }
            function verifyMethodPay() {
                //$rootScope.$emit("openAlertDigdeepModal", { textAlert: "Preparando todo..." });
                userService.verifyMethodPay(idUser, $localStorage.token, function (methodsPay) {
                    if (methodsPay != undefined && methodsPay.data.length > 0) {
                        $scope.formularioPago = 1
                        $scope.methodsPay = methodsPay.data
                        $scope.methodPayDefault = undefined
                        $scope.metodoPago = undefined
                        console.log($scope.methodsPay)
                    }else{
                        $scope.formularioPago = 2
                        $scope.methodPayDefault = undefined
                    }
                    //$uibModalInstance.close()
                }, function (err) {
                    $scope.formularioPago = 2
                    $scope.methodPayDefault = undefined
                    console.log(err)
                    //$uibModalInstance.close()
                })
            }
        }
    ])