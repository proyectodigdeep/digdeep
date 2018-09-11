// Librerías externas
var express 	= require("express")
var mongoose 	= require("mongoose")
var cors 		= require("cors")
var bodyParser 	= require("body-parser")
var sslRedirect = require('heroku-ssl-redirect');

// Librería interno
var apiRouterOpen 		= require("./src/infrastructure/routers/apiRouterOpen")
var apiRouterProtected 	= require("./src/infrastructure/routers/apiRouterProtected")
var apiRouterCategory 	= require("./src/infrastructure/routers/apiRouterCategory")
var apiRouterService 	= require("./src/infrastructure/routers/apiRouterService")
var config 				= require("./config")
var webRouter 			= require("./src/infrastructure/webRouter")
var securityService 	= require("./src/infrastructure/services/securityService")

// Inicialización de express
var app = express()

// Configuraciones
app.set('view engine', 'swig')
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(sslRedirect());

// Conectar a mongodb
mongoose.Promise = global.Promise
mongoose.connect(config.mongo_url)
//carpeta publica
app.use(express.static("./public"))

// Routes
app.use("/", webRouter)
app.use("/v1", apiRouterOpen)
app.use("/v1", apiRouterCategory)
app.use("/v1", apiRouterService)

// MIDDLEWARE DE VERIFICACIÓN
app.use(securityService.verifyToken)

// MIDDLEWARE PARA CARGAR USUARIO ACTIVO
app.use(securityService.setUser)

app.use("/v1", apiRouterProtected())

app.use(function (req, res, next) {
  var sslUrl;
  console.log("************SSLURL****************")
  console.log(req.headers)
  if (req.headers.origin == 'http://digdeep.mx') {
    //sslUrl = ['https://digdeep.mx', req.url].join('');
    return res.redirect('https://digdeep.mx');
  }

  return next();
});

// Error 404
app.use(function(req, res){
	res.status(404)

	/*if(req.headers['x-forwarded-proto'] !== 'https') {
	   var sslUrl = ['https://digdeep.mx', req.url].join('');
	   return res.redirect(sslUrl);
	}*/
	// respond with html page
	if (req.accepts('html')) {
		return res.send("Página no encontrada")
	}

	// respond with json
	if (req.accepts('json')) {
		return res.json({ error: 'Recurso no encontrado' })
	}

	// default to plain-text. send()
	return res.type('txt').send('Not found')
})

// Inicializar Servidor
app.listen(config.port, function() {
	console.log('Servidor corriendo con puerto: ', config.port)
})