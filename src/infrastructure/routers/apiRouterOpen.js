// Librerías externas
var express = require("express")
var router = express.Router()
var multer = require("multer")
var config = require("../../../config")
var cloudinary = require ("cloudinary")
var orderApp = require('../../application/orderApp')
var userApp  = require('../../application/userApp')
//var ManagementClient = require('auth0').ManagementClient;
//var AuthenticationClient = require('auth0').AuthenticationClient;
var request = require("request");
// Configuración auth0

/*var options = { method: 'POST',
  url: 'https://creainte2.auth0.com/dbconnections/signup',
  headers: { 'content-type': 'application/json' },
  body: 
   { client_id: config.auth0.clientId,
     email: 'pepe@hotmail.com',
     password: 'Supersecret1234',
     connection: 'test',
     user_metadata: { name: 'john', color: 'red' } },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  console.log(body);
});*/

// Configuración de cloudinary (repositorio de imagenes)


/*var options = { method: 'POST',
  url: 'https://creainte2.auth0.com/dbconnections/change_password',
  headers: { 'content-type': 'application/json' },
  body: 
   { client_id: 'WneauBfFMFe4q4EJ76FPLm47TKsInbI_',
     email: 'patosoak@gmail.com',
     connection: config.auth0.connection},
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});*/

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

/****USUARIOS****/
	// Crear nuevo usuario despues de registrarlo en auth0
	router.post("/users_register", userService.registerUser)
	// Obtener un token access de un usuario por id de auth 0, despues de logearse en auth0
	router.get("/tokens_auth0/:id", securityService.generateTokenUserByIdAuth0)
	// Verificar una cuenta de un usuario, a petición de un correo que mando auth0

/***USUARIOS DIGDEEPER (PROVEEDORES)****/
	// Obtener todas las ordenes de un digdeeper
	router.get('/datesbydigdeeper/:id',orderService.getDatesByDigdeeper)
	// Obtener los horarios de los servicios de un digdeeper por medio de una fecha
	router.post('/getordersforRangedatebydigdeeper/:id',orderService.getForRangeDateByDigdeeper)

// Obtener ordenes para conekta
router.get("/orderverifyconekta/:id", orderService.verifyOrderConekta)
// Poner contraseña temporal a un usuario
router.put("/userspasswordforget/:id", userService.updatePasswordUserForget)
// Crear un comentario
router.post("/comments", commentService.createComment)
// Obtener un comentario
router.get("/comments/:id", commentService.getComment)
// Obtener todos los comentarios
router.get("/comments", commentService.getComments)
// Enviar un email
router.post("/emails", emailService.send)
// Crea nuevo usuario
router.post("/users", userService.createUser)

// Crea nuevo usuario con Red social
//router.post("/users_socialred", userService.registerUserSocialRed)


// Verificar si existe un correo de un usuario ya registrado
router.post("/usersverify", userService.verifyUserByEmail)
// Obtener todos los usuarios con una subcategoria especifica
router.get("/usersbysubcategory/:id", userService.getUsersBySubcategories)
// Obtener datos de un usuario
router.get("/users/:id", userService.getUser)
// Iniciar sesión
router.post("/authenticate", securityService.authenticate)
// Ingresar las preferencias del usuario al registrarse con rol: user
router.put("/userspreferences/:id", userService.updatePreferencesUser)
// Obtener todos los eventos de un proveedor
router.get('/events_by_digdeeper/:id', calendarService.getEventsByDigdeeper)
// Obtener un usuario por id de auth 0
router.get('/users_auth0/:id', userService.getUserByIdAuth0)

// Enviar un email a un usuario
router.post('/email_changepassword', emailService.changePasswordUser)

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
	// req.file is the `avatar` file
	// req.body will hold the text fields, if there were any
	// subir una imagen a cloudinary
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

// procesa las peticiones de conekta para la validacion de ordenes por spei
router.post('/whconekta', function (req, res) {
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

								var orderData = {
									dataService: {
										title: order.dataService.title,
										cost: order.dataService.cost
									},
									dateInit: order.dataService.dateInit,
									dateFinish: order.dataService.dateFinish,
									hourInit: order.dataService.hourInit,
									hourFinish: order.dataService.hourFinish
								}
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
		})
	}else {
		res.status(400);
	}
})

// Exportar el módulo de rutas para API
module.exports = router