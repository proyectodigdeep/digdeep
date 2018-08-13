module.exports = {
	// Conexion a la base de datos
	//Modo produccion
	mongo_url: process.env.MONGODB_URI || "mongodb://digdeepweb:creaInte2018.@ds151451.mlab.com:51451/digdeep_db",
	
	//Modo de pruebas
	//mongo_url: process.env.MONGODB_URI || "mongodb://root:patopumas08@ds125821.mlab.com:25821/db_pruebas_digdeep",
	
	port: int(process.env.PORT) || 5000,
	jwt_secret: "clavesecretanoestanimportanteenrealidadsoloesparacreartokens",
	
	emailFromData: {
		from: '"DIG DEEP" <noreply@digdeep.com.mx>',
		user: "noreply@digdeep.com.mx",
		password: "creaInte2018.",
		host: "mail.dreamhost.com",
		port: 587,
	},
	/email_digdeep: "managerdigeep@gmail.com",
	//email_digdeep: "j.lpumas@hotmail.com",
	
	hostPath: 'http://digdeep.mx/',
	conekta: {
		apiKey: 'key_RbynxeQNr9WAh7JPXyyxkw',
		locale: 'es',
		currency: 'MXN'
	},
	cloudinary: {
		cloud_name : 'dclbqwg59', 
	   	api_key : 	'653143988463315', 
	   	api_secret : '-c3U7xL23IEyZ3-vOY387yms29A' 
	},
	auth0:{
		domain: "digdeepproyecto.auth0.com",
		//clientId: "vGI1Aqu0TOLnOGf5BlxP2sOgts0XNiXX",
		clientId: "G2UJ5z3vZ933hIMxKyMupB0QmhOwviyR",
		//clientId: "M1MW9PYFJ63ePUutLzAORebfOwKw1-Ac",
		//connection : "test"
		connection: "Username-Password-Authentication"
	},
	multer:{
		dest: "uploads/"
	},
	server_test: 'http://localhost:5000/v1'
}

function bool(str) {
    if (str == void 0) return false
    return str.toLowerCase() === 'true'
}

function int(str) {
    if (!str) return 0
    return parseInt(str, 10)
}

function float(str) {
    if (!str) return 0
    return parseFloat(str, 10)
}
