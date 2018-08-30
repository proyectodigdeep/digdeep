angular.module('digdeepApp.newEventCalendarModalCtrl', ['ui.bootstrap'])

.controller('newEventCalendarModalCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openNewEventCalendar = function (dateSelected, userId) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/newEventCalendarModal.html',
            controller:  'newEventInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                dateSelected: function() {return dateSelected},
                userId: function() {return userId}
            }
        })     
    }

    $rootScope.$on('openNewEventCalendar', function(event,data) {
        $uibModal.open({
            animation: true,
            templateUrl: '/app/templates/modals/newEventCalendarModal.html',
            controller: 'newEventInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                dateSelected: function() {return data.dateSelected}
            }
        })     
    })

}])

.controller('newEventInstanceCtrl', [ 'dateSelected', 'userId','$rootScope', '$uibModalInstance', '$localStorage', '$scope','$state', 'calendarService', 'ordersService', 'userService',
function (                             dateSelected,   userId, $rootScope,   $uibModalInstance,   $localStorage,   $scope,  $state, calendarService, ordersService, userService) {
    $scope.event = {}
    $scope.dateSelected = new Date(dateSelected)
    $scope.dateSelected.setHours(0, 0, 0)
    $scope.event.date = $scope.dateSelected.setDate($scope.dateSelected.getDate()+1)
    var dd = $scope.dateSelected.getDate()
    $scope.dateSelected.setDate(dd)
    var date_temp = new Date()
    var arrayHoursDefault = [date_temp.toISOString(date_temp.setHours(0, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(0, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(1, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(1, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(2, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(2, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(3, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(3, 30, 0)),

                             date_temp.toISOString(date_temp.setHours(4, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(4, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(5, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(5, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(6, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(6, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(7, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(7, 30, 0)),

                             date_temp.toISOString(date_temp.setHours(8, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(8, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(9, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(9, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(10, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(10, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(11, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(11, 30, 0)),

                             date_temp.toISOString(date_temp.setHours(12, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(12, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(13, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(13, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(14, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(14, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(15, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(15, 30, 0)),


                             date_temp.toISOString(date_temp.setHours(16, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(16, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(17, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(17, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(18, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(18, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(19, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(19, 30, 0)),

                             date_temp.toISOString(date_temp.setHours(20, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(20, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(21, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(21, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(22, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(22, 30, 0)),
                             date_temp.toISOString(date_temp.setHours(23, 0, 0)),
                             date_temp.toISOString(date_temp.setHours(23, 30, 0))]
    
    userService.getUser(userId, function (digdeeper) {
        $scope.service_time = digdeeper.service_time
        var hourTemp_init = new Date($scope.service_time.init)
        var hourTemp_finish = new Date($scope.service_time.finish)
        var timeTemp = {
            init: date_temp.toISOString(date_temp.setHours(hourTemp_init.getHours(), hourTemp_init.getMinutes(), 0)),
            finish: date_temp.toISOString(date_temp.setHours(hourTemp_finish.getHours(), hourTemp_finish.getMinutes(), 0))
        }
        reloadHours(timeTemp.init,timeTemp.finish)
        getDatesOcuped()
    },function (err) {
        console.log(err)  
    })

    //getDatesOcuped()
    function getDisponiblesHoursByDay() {
        
        var fecha_inicial = new Date($scope.event.date)
            fecha_inicial = fecha_inicial.toISOString(fecha_inicial.setHours(0, 0, 0))
        var fecha_final = new Date($scope.event.date)
            fecha_final = fecha_final.toISOString(fecha_final.setHours(0, 0, 0))
        var fechas_disponibles = $scope.orders_times
        for (var i = 0; i < fechas_disponibles.length; i++) {
            if (String(fechas_disponibles[i].date_init) == String(fecha_inicial) || String(fechas_disponibles[i].date_finish) == String(fecha_final)) {
                $scope.listHorarios = fechas_disponibles[i].horarios
                i = fechas_disponibles.length + 1
            }else{
                $scope.listHorarios = arrayHoursDefault
            }
        }
    }
    function reloadHours(hinit,hfinish) {
        var arrayClean = []
        for (var i = 0; i < arrayHoursDefault.length; i++) {
            if(arrayHoursDefault[i] >= hinit && arrayHoursDefault[i] <= hfinish){
                arrayClean.push(arrayHoursDefault[i])
            }
        }
        arrayHoursDefault = arrayClean
    }
    function getDatesOcuped() {
        //Obtener las fechas y horarios disponibles del proveedor
        ordersService.getDatesByDigdeeper(userId, function (orders_times) {
            $scope.orders_times = orders_times
            getDisponiblesHoursByDay()
        },function (err) {
            console.log(err)
        })
    }
    this.cancel = function () {
        $uibModalInstance.close()
    }
    this.getHourInit = function (hourinit) {
        $scope.event.hourFinal = hourinit
    }
    this.ok = function () {
        if(validateForm()){
            $scope.event.digdeeper = userId
            // Verificar que no interfiera con ningun horario
            ordersService.getDatesAndHoursByRangeDate(userId, new Date($scope.event.date), new Date($scope.event.date), function (orders) {
                console.log(orders)
                if (orders.length > 0) {
                    for (var i = 0; i < orders.length; i++) {

                        var hourInitTemp = new Date(orders[i].hourInit)
                        var hourFinalTemp = new Date(orders[i].hourFinish)

                        var hourInitTempNewOrder = new Date($scope.event.hourInit)
                        var hourFinalTempNewOrder = new Date($scope.event.hourFinal)
                        
                        hourInitTemp = date_temp.toISOString(date_temp.setHours(hourInitTemp.getHours(), hourInitTemp.getMinutes(), 0))
                        hourFinalTemp = date_temp.toISOString(date_temp.setHours(hourFinalTemp.getHours(), hourFinalTemp.getMinutes(), 0))
                        hourInitTempNewOrder = date_temp.toISOString(date_temp.setHours(hourInitTempNewOrder.getHours(), hourInitTempNewOrder.getMinutes(), 0))
                        hourFinalTempNewOrder = date_temp.toISOString(date_temp.setHours(hourFinalTempNewOrder.getHours(), hourFinalTempNewOrder.getMinutes(), 0))

                        // Verificar que la hora inicial del nuevo servicio no se encuentre en el rango de horas de los servicios apartados
                        if (hourInitTempNewOrder >= hourInitTemp && hourInitTempNewOrder <= hourFinalTemp) {
                            $scope.alertError = "El horario que seleccionaste ya ha sido apartado, intentaló con otro horario por favor."
                            $scope.errAlert = true
                            return false
                        }else{
                            // Verificar que la hora final del nuevo servicio no se encuentre en el rango de horas de los servicios apartados
                            if (hourFinalTempNewOrder >= hourInitTemp && hourFinalTempNewOrder <=  hourFinalTemp) {
                                $scope.alertError = "El horario que seleccionaste ya ha sido apartado, intentaló con otro horario por favor."
                                $scope.errAlert = true
                                return false
                            }else{
                                // Verificar que la hora inicial y final del nuevo servicio no abarquen el rango de horas de los servicios apartados
                                if (hourInitTempNewOrder <= hourInitTemp && hourFinalTempNewOrder >= hourFinalTemp) {
                                    $scope.alertError = "El horario que seleccionaste ya ha sido apartado, intentaló con otro horario por favor."
                                    $scope.errAlert = true
                                    return false
                                }
                            }   
                        }
                    }
                    //nextFormTrue()
                    calendarService.createEvent($scope.event, $localStorage.token, function (event) {
                        $uibModalInstance.close()
                        location.reload()
                    },function (err) {
                        console.log(err)
                        location.reload()
                        alert("Lo sentimos tenemos problemas con nuestros servicios, intentalo más tarde")
                    })
                    return true
                }else{
                    //nextFormTrue()
                    calendarService.createEvent($scope.event, $localStorage.token, function (event) {
                        $uibModalInstance.close()
                        location.reload()
                    },function (err) {
                        console.log(err)
                        location.reload()
                        alert("Lo sentimos tenemos problemas con nuestros servicios, intentalo más tarde")
                    })
                    return true  
                }
            }, function (err) {
                $rootScope.$emit("openAlert", {textAlert:"Lo sentimos no se pudo agendar tu horario. intentaló más tarde."})
                return false
            }) 
        }
    }
    function validateForm() {
        if ($scope.event.title == undefined || $scope.event.title == "") {
            alert("Necesitas seleccionar un titulo para el evento")
            return false
        }
        if ($scope.event.hourInit == undefined || $scope.event.hourInit == null) {
            alert("Necesitas seleccionar una hora valida")
            return false
        }
        if ($scope.event.hourFinal == undefined || $scope.event.hourFinal == null) {
            alert("Necesitas seleccionar una hora valida")
            return false
        }
        return true
    }
}])

