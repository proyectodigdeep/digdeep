// Librerías externas
var express = require("express")
var router = express.Router()
var multer = require("multer")
var config = require("../../../config")
var cloudinary = require ("cloudinary")
var orderApp = require('../../application/orderApp')
var userApp  = require('../../application/userApp')
var request = require("request");

cloudinary.config ({ 
   cloud_name : config.cloudinary.cloud_name, 
   api_key : 	config.cloudinary.api_key, 
   api_secret : config.cloudinary.api_secret  
})

// Archivo donde se suben temporalmente los archivos
var upload = multer({
  dest: config.multer.dest
})

var userService 	= require("../services/userService") 	 // Este es un servicio especifico para usuarios
var securityService = require("../services/securityService") // Este es un servicio especifico para iniciar sesión
var emailService 	= require("../services/emailService") 	 // Este es un servicio especifico para correos
var commentService 	= require("../services/commentService")  // Este es un servicio especifico para comentarios
var orderService 	= require("../services/orderService") 	 // Este es un servicio especifico para ordenes de los usuarios
var calendarService = require("../services/calendarService") 	// Este es un servicio especifico para calendario
var whService 		= require("../services/whService") 	// Este es un servicio especifico para calendario

/****USUARIOS****/
	//[ok] Crear nuevo usuario despues de registrarlo en auth0
	router.post("/users_register", userService.registerUser)
	//[ok] Obtener un token access de un usuario por id de auth 0, despues de logearse en auth0
	router.get("/tokens_auth0/:id", securityService.generateTokenUserByIdAuth0)
	//[ok] Obtener datos de un usuario
	router.get("/users/:id", userService.getUser)
	//[ok] Obtener un usuario por id de auth 0
	router.get('/users_auth0/:id', userService.getUserByIdAuth0)
	//[ok] Obtener todos los eventos de un proveedor
	router.get('/events_by_digdeeper/:id', calendarService.getEventsByDigdeeper)
	//[ok] Enviar un email desde auth0 a un usuario que quiere cambiar su contraseña
	router.post('/email_changepassword', emailService.changePasswordUser)
	// Obtener todos los usuarios con una subcategoria especifica
	router.get("/usersbysubcategory/:id", userService.getUsersBySubcategories)
	// Cambiar la foto de perfil de un usuario con rol: 'user'
	router.post('/usersImg', upload.single('file-to-upload'), function (req, res, next) {
		cloudinary.uploader.upload (req.file.path, function (result) {
			var data = {
				url: result.url,
				id:  req.body.idUserProfile
			}
			userService.updateImgUsr(data)
			res.redirect('/#!/userprofile')
		},{
			// Ajusta el tamaño de la imagen y le asigna un id unico
			public_id: req.body.idUserProfile, 
			crop: 'fill',
			width: 91,
			height: 91
		})
	})
	// Cambiar la foto de perfil de un usuario con rol: 'digdeeper'
	router.post('/digdeepersImg', upload.single('file-to-upload'), function (req, res, next) {
		cloudinary.uploader.upload (req.file.path, function (result) {
			var data = {
				url: result.url,
				id:  req.body.idUserProfile
			}
			userService.updateImgUsr(data)
			res.redirect('/#!/digdeeperprofile')
		},{
			// Ajusta el tamaño de la imagen y le asigna un id unico
			public_id: req.body.idUserProfile, 
			crop: 'fill',
			width: 91,
			height: 91
		})
	})
	// Subir imagenes del servicio de un proveedor (digdeeper)
	router.post('/digdeeperImgServiceTemp',upload.any(), function (req, res, next) {
		var arrayUrlsImg = []
		for (var i = 0; i < req.files.length; i++) {
			if (req.files[i].mimetype === "image/jpeg" || req.files[i].mimetype === "image/png") {
				arrayUrlsImg.push(req.files[i].path)
				if (arrayUrlsImg.length === req.files.length) {
					res.send(arrayUrlsImg)	
				}
			}else{
				console.log("archivo no permitido")
				res.send("error")
			}
		}
	})

	// Subir imagenes desde un dropzone, a cloudinary
	router.post('/digdeeper_logo',upload.any(), function (req, res, next) {
		var arrayUrlsImg = []
		for (var i = 0; i < req.files.length; i++) {
			if (req.files[i].mimetype === "image/jpeg" || req.files[i].mimetype === "image/png") {
				arrayUrlsImg.push(req.files[i].path)
				if (arrayUrlsImg.length === req.files.length) {
					console.log("**subiendo logo**")
					if (arrayUrlsImg.length > 0) {
						cloudinary.uploader.upload (arrayUrlsImg[0], function (result) {
							res.send(result.url)
						},{
							// Ajusta el tamaño de la imagen y le asigna un id unico
							crop: 'fill',
							width: 100,
							height: 100
						})	
					}else{
						res.send("error")
					}	
				}
			}else{
				console.log("archivo no permitido")
				res.send("error")
			}
		}
	})
	
/***USUARIOS DIGDEEPER (PROVEEDORES)****/
	// Obtener todas las fechas ocupadas de un digdeeper
	router.get('/datesbydigdeeper/:id',orderService.getDatesByDigdeeper)
	// Obtener los horarios de los servicios de un digdeeper por medio de una fecha
	router.post('/getordersforRangedatebydigdeeper/:id',orderService.getForRangeDateByDigdeeper)
/****COMENTARIOS****/
	router.get("/comments/:id", commentService.getComment)
	// Crear un comentario
	router.post("/comments", commentService.createComment)
	//[ok] Obtener todos los comentarios
	router.get("/comments", commentService.getComments)
/****EMAILS****/
	// Enviar un email
	router.post("/emails", emailService.send)
	router.post("/emailscontact", emailService.notification_contact)
	router.post("/emailscontract", emailService.notification_contract)
	router.post("/emailscontrac2", emailService.notification_contract2)

	router.post("/emailscancel_user", emailService.notification_cancel_user)
	router.post("/emailscancel_digdeeper", emailService.notification_cancel_digdeeper)
	router.post("/emailsconfirm", emailService.notification_confirm_service)
	router.post("/emails_comments", emailService.notification_comments)
	router.post("/emailsconfirm_digdeeper", emailService.notification_confirm_digdeeper)
	router.post("/emailsnoconfirm_digdeeper", emailService.notification_noconfirm_digdeeper)

/****ORDENES****/
	// Obtener ordenes para conekta
	router.get("/orderverifyconekta/:id", orderService.verifyOrderConekta)
	
	router.get("/webhookTest",function(req, res){
		var data = req.body.data;
		
		if(data && data.object && data.object.order_id){
			res.status(200);
			res.json({
				test : "Test " + data
			})
		}
		else{
			res.status(400);
		}
	})
	
	router.post("/webhookConekta", function (req, res) {
		var data = req.body.data;
		
		// si existe una orden de conekta en el body request
		if (data && data.object && data.object.order_id) {
			var idOrdenConekta = data.object.order_id;
			var estatusOrden = data.object.status;// paid

			// Se busca la orden de conekta en la bd	
			orderApp.getOrderByIdConkta(String(idOrdenConekta), function(order){
				if(order){
					// Checa si el estatus de la orden esta en proceso de pago(6),
					// y que no este ya pagada(5), para evitar reenviar el correo.
					if (order.status === 6) {
						// Obtiene los datos del cliente
						userApp.getUser(order.client, function (user) {
							if (user) {
								// si la orden existe en la bd y
								// si el estatus de la orden es paid
								if (estatusOrden === 'paid') {
									// Se pone la orden en estatus pagada(5)
									orderApp.putStatusOrderPaid(order._id,function (order) {
									},function (err) {
										res.send("error");
									})
									// se envia notificacion de email de servicio pagado
									// hardcode datos de email, estos datos deben construirse en base a la orden en base de datos 
									var clientData = {
										fullname: user.fullname,
										phone: user.phone,
										email: user.email
									}
									//
										var dateFormated = new Date(order.dataService.dateInit)
										d = dateFormated.getDate();
										m = dateFormated.getMonth();
										y = dateFormated.getFullYear();
										monthString = getMonth(m)
										dateInit = String(d)+"/"+monthString+"/"+String(y)

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
									//
									var orderData = {
										title: order.dataService.title,
										cost: order.dataService.cost,
										dateInit: dateInit,
										dateFinish: dateFinish,
										hourInit: hourInit,
										hourFinish: hourFinish,
										picture: order.dataService.picture,
										digdeeper_name: order.dataService.nameDD,
										digdeeper_picture: order.dataService.imgDD
									}
									res.status(200);
									/*emailService.notificacionServicioPagado(clientData, orderData, function (result) {
										res.status(result.status).json(result.body);
									})*/
								}else {
									res.status(400);
								}
							}
						},function (err) {
							res.status(400);
						})
					}
				}else{
					res.status(400);
				}
			},function(err){
				console.log(err)
				res.status(400);
			})
		}else {
			res.status(400);
		}
	})

// procesa las peticiones de conekta para la validacion de ordenes por spei
/*router.post('/whconekta', function (req, res) {
	var data = typeof req.body == 'string' ? JSON.parse(req.body.data) : req.body.data;
	
	// si existe una orden de conekta en el body request
	if (data && data.object && data.object.order_id) {
		var idOrdenConekta = data.object.order_id;
		var estatusOrden = data.object.status;// paid

		// Se busca la orden de conekta en la bd	
		orderApp.getOrderByIdConkta(String(idOrdenConekta), function(order){
			if(order){
				// Checa si el estatus de la orden esta en proceso de pago(6),
				// y que no este ya pagada(5), para evitar reenviar el correo.
				if (order.status === 6) {
					// Obtiene los datos del cliente
					userApp.getUser(order.client, function (user) {
						if (user) {
							// si la orden existe en la bd y
							// si el estatus de la orden es paid
							if (estatusOrden === 'paid') {
								// Se pone la orden en estatus pagada(5)
								orderApp.putStatusOrderPaid(order._id,function (order) {
								},function (err) {
									res.send("error");
								})
								// se envia notificacion de email de servicio pagado
								// hardcode datos de email, estos datos deben construirse en base a la orden en base de datos 
								var clientData = {
									fullname: user.fullname,
									phone: user.phone,
									email: user.email
								}
								//
									var dateFormated = new Date(order.dataService.dateInit)
							        d = dateFormated.getDate();
							        m = dateFormated.getMonth();
							        y = dateFormated.getFullYear();
							        monthString = getMonth(m)
							        dateInit = String(d)+"/"+monthString+"/"+String(y)

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
								//
								var orderData = {
									title: order.dataService.title,
									cost: order.dataService.cost,
									dateInit: dateInit,
									dateFinish: dateFinish,
									hourInit: hourInit,
									hourFinish: hourFinish,
									picture: order.dataService.picture,
									digdeeper_name: order.dataService.nameDD,
									digdeeper_picture: order.dataService.imgDD
								}
								res.status(200);
								emailService.notificacionServicioPagado(clientData, orderData, function (result) {
									res.status(result.status).json(result.body);
								})
							}else {
								res.status(400);
							}
						}
					},function (err) {
						res.status(400);
					})
				}
			}else{
				res.status(400);
			}
		},function(err){
			console.log(err)
			res.status(400);
		})
	}else {
		res.status(400);
	}
})*/


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
/**** ROOT ****/
// Iniciar sesión administrador
	router.post("/authenticate", securityService.authenticate)

/****OBSOLETAS DESPUES DE CAMBIOS CON AUTH0****/
	// Crea nuevo usuario
	router.post("/users", userService.createUser)
	// Verificar si existe un correo de un usuario ya registrado
	router.post("/usersverify", userService.verifyUserByEmail)
	
	// Ingresar las preferencias del usuario al registrarse con rol: user
	router.put("/userspreferences/:id", userService.updatePreferencesUser)
	
	// Poner contraseña temporal a un usuario
	router.put("/userspasswordforget/:id", userService.updatePasswordUserForget)
/***********************************************/
// Exportar el módulo de rutas para API
module.exports = router