module.exports = {
	// Conexion a la base de datos
	mongo_url: process.env.MONGODB_URI || "mongodb://digdeepweb:creaInte2018.@ds151451.mlab.com:51451/digdeep_db",
	//	
	port: int(process.env.PORT) || 5000,
	jwt_secret: "clavesecretanoestanimportanteenrealidadsoloesparacreartokens",
	
	emailFromData: {
		from: '"DIG DEEP" <noreply@digdeep.com.mx>',
		user: "noreply@digdeep.com.mx",
		password: "creaInte2018.",
		host: "mail.dreamhost.com",
		port: 587,
	},
	conekta: {
		apiKey: 'key_xaDN1mzNxGaez7wKkDgm7Q',
		locale: 'es',
		currency: 'MXN'
	},
	cloudinary: {
		cloud_name : 'dclbqwg59', 
	   	api_key : 	'653143988463315', 
	   	api_secret : '-c3U7xL23IEyZ3-vOY387yms29A' 
	},
	auth0:{
		domain: "https://creainte2.auth0.com",
		//clientId: "vGI1Aqu0TOLnOGf5BlxP2sOgts0XNiXX",
		clientId: "WneauBfFMFe4q4EJ76FPLm47TKsInbI_",
		connection : "test"
	},
	multer:{
		dest: "uploads/"
	} 
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
