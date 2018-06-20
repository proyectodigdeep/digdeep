angular.module('digdeepApp.calendarCtrl', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('calendar', {
		url: '/calendar',
		templateUrl: '/app/templates/calendar.html',
		controller: 'calendarCtrl'
	})
}])

.controller('calendarCtrl', [ '$localStorage', '$scope', '$state', '$rootScope', '$interval', '$http','ordersService', 'calendarService', 'uiCalendarConfig',
function (                     $localStorage,   $scope,   $state,	 $rootScope,   $interval,  $http,  ordersService,   calendarService, uiCalendarConfig) {
	
    init()

    function init() {
        // Obtener los datos del usuario para mostrar su perfil
        $rootScope.$emit('reloadUser',{done: function() {
        }})
        // Verificar el tipo de usuario para mostrar la barra de navegación acorde a el
        $rootScope.$emit('checkRollUser',{done: function() {
        }})
        $scope.typeUser = $rootScope.typeUser
        // configuración para calendario
        $scope.uiConfig = {
            calendar:{
                height: 450,
                editable: false,
                header:{
                    left: 'title',
                    right: 'today,prev,next'
                },
                eventClick:  alertOnEventClick,
                dayClick: addNewEvent,
                eventResize: $scope.alertOnResize,
                eventRender: $scope.eventRender,
                className: ['openSesame']
            }
        }
        $scope.events = []
        $scope.eventSources = [$scope.events];
        $scope.uiConfig.calendar.monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio','Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', "Diciembre"];
        $scope.uiConfig.calendar.dayNames = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
        $scope.uiConfig.calendar.dayNamesShort = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
        // Fin configuración de calendario

        // Obtener los servicios del proveedor
        reloadOutEvents()
        // Obtener las ordenes
        reloadOrders()
    }
    function formatDate(date) {
        var dateTemp = new Date(date)
        var dd = dateTemp.getMonth
    }

    function addNewEvent(date) {
        console.log("agregar nueva fecha "+date.format())
        $scope.openNewEventCalendar(date.format(), $scope.user._id)
    }

    function alertOnEventClick(event, allDay, jsEvent, view) {
        console.log(event.type)
        switch(event.type){
            case 'digdeep': 
                ordersService.getOrder(event.identificador, $localStorage.token, function (order) {
                    $rootScope.$emit("openDateInfoModal", order)
                }, function (err) {
                    console.log(err)
                    alert("Lo sentimos, tenemos problemas con nuestros servicios intentaló más tarde")
                })
            break;
            case 'externo': 
                calendarService.getEvent(event.identificador, $localStorage.token, function (eventOut) {
                    $rootScope.$emit("openDateInfoOutModal", eventOut)
                },function (err) {
                    console.log(err)
                    alert("Lo sentimos, tenemos problemas con nuestros servicios intentaló más tarde")
                })       
            break;
        }
    }

    function reloadOutEvents() {
        // Obtener los eventos externos
        calendarService.getEventsByDigdeeper($scope.user._id, $localStorage.token, function (events) {
            //$scope.events = events
            if (events.length > 0) {
                // Clasificar las fechas ya ocupadas
                for (var i = 0; i < events.length; i++) {
                    dateFormated = new Date(events[i].hourInit)
                    var hh = dateFormated.getHours();
                    var mm = dateFormated.getMinutes();
                    var hourInit = String(hh)+":"+String(mm)
                    
                    dateFormated = new Date(events[i].hourFinal)
                    hh = dateFormated.getHours();
                    mm = dateFormated.getMinutes();
                    var hourFinal = String(hh)+":"+String(mm)
                    
                    var m_init = new Date(events[i].date).getMonth() + 1
                    var m_final = new Date(events[i].date).getMonth() + 1
                    
                    var noDisponibleDateTemp = {
                        title: events[i].title,
                        start: new Date(events[i].date).getFullYear() + "-" + m_init + "-" + new Date(events[i].date).getDate()+ " " + hourInit,
                        //start: events[i].dateInit,
                        //end: events[i].dateFinal,
                        end: new Date(events[i].date).getFullYear() + "-" + m_final + "-" + new Date(events[i].date).getDate()+ " " + hourFinal,
                        identificador: events[i]._id ,
                        type: "externo",
                        color: '#3c763d'
                    }
                    $scope.events.push(noDisponibleDateTemp)
                }
            }
            $scope.uiConfig.calendar.monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio','Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', "Diciembre"];
            $scope.uiConfig.calendar.dayNames = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
            $scope.uiConfig.calendar.dayNamesShort = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
            uiCalendarConfig.calendars.calendar1.fullCalendar('render');
        },function(err) {
            console.log(err)
        })
    }
    function reloadOrders() {
        ordersService.getOrdersDigdeeper($scope.user._id,$localStorage.token, function (orders) {
            $scope.orders = orders
            if (orders.length > 0) {
                 // Clasificar las fechas ya ocupadas
                for (var i = 0; i < orders.length; i++) {
                    dateFormated = new Date(orders[i].dataService.hourInit)
                    var hh = dateFormated.getHours();
                    var mm = dateFormated.getMinutes();
                    var hourInit = String(hh)+":"+String(mm)
                    
                    dateFormated = new Date(orders[i].dataService.hourFinish)
                    hh = dateFormated.getHours();
                    mm = dateFormated.getMinutes();
                    var hourFinish = String(hh)+":"+String(mm)
                    
                    var m_init = new Date(orders[i].dataService.dateInit).getMonth() + 1
                    var m_final = new Date(orders[i].dataService.dateFinish).getMonth() + 1
                    
                    var noDisponibleDateTemp = {
                        title: 'DigDeep',
                        start: new Date(orders[i].dataService.dateInit).getFullYear() + "-" + m_init + "-" + new Date(orders[i].dataService.dateInit).getDate()+ " " + hourInit,
                        //start: orders[i].dataService.dateInit,
                        //end: orders[i].dataService.dateFinal,
                        end: new Date(orders[i].dataService.dateFinish).getFullYear() + "-" + m_final + "-" + new Date(orders[i].dataService.dateFinish).getDate()+ " " + hourFinish,
                        identificador: orders[i]._id,
                        type: "digdeep",
                        color: '#26a5dc'
                    }
                    $scope.events.push(noDisponibleDateTemp)
                }
            }
            
            // configuración para calendario
            $scope.uiConfig = {
                calendar:{
                    height: 450,
                    editable: true,
                    header:{
                        left: 'title',
                        right: 'today,prev,next'
                    },
                    eventClick:  alertOnEventClick,
                    dayClick: addNewEvent,
                    eventResize: $scope.alertOnResize,
                    className: ['openSesame']
                }
            };
            $scope.eventSources = [$scope.events];
            $scope.uiConfig.calendar.monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio','Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', "Diciembre"];
            $scope.uiConfig.calendar.dayNames = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
            $scope.uiConfig.calendar.dayNamesShort = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
            uiCalendarConfig.calendars.calendar1.fullCalendar('render');
        },function(err) {
            console.log(err)
            // configuración para calendario
            $scope.uiConfig = {
                calendar:{
                    height: 450,
                    editable: false,
                    header:{
                        left: 'title',
                        right: 'today,prev,next'
                    },
                    eventClick:  alertOnEventClick,
                    dayClick: addNewEvent,
                    eventResize: $scope.alertOnResize,
                    eventRender: $scope.eventRender,
                    className: ['openSesame']
                }
            };
            
            $scope.eventSources = [$scope.events];
            $scope.uiConfig.calendar.monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio','Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', "Diciembre"];
            $scope.uiConfig.calendar.dayNames = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
            $scope.uiConfig.calendar.dayNamesShort = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
            uiCalendarConfig.calendars.calendar1.fullCalendar('render');
        })
    }
   	
}])
