var nodemailer 	= require('nodemailer')
var swig  		= require('swig')
var config 		= require('../../../config')
var request 	= require("request");

function send(HTML, subject, to, text, callback) {	
	var HTML = HTML;
	var subject = subject;
	var to = to;
	var text = text;

	var fromData = config.emailFromData

	var transporter = nodemailer.createTransport({
		host: fromData.host,
		port: fromData.port,
		auth: {
			user: fromData.user,
			pass: fromData.password
		}
	})

	var mailOptions = {
		from: fromData.from,
		to: to,
		subject: subject,
		html: HTML,
		text: text
	}

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {			
			return callback({
				status: 400,
				body: {
					status: 'failure',
					message: "Mensaje no enviado"
				}
			});
		}

		return callback({
			status: 201,
			body: {
				status: 'success',
				message: "Mensaje enviado con exito"
			}
		});		
	})
}

exports.renderObjectToHTML = function(object) {
	return swig.renderFile('src/presenter/emailObjectToHTML.html', {object: object})
}

exports.send = function(req,res) {
	var HTML 	= req.body.HTML
	var subject = req.body.subject
	var to 		= req.body.to 
	var text 	= req.body.text

	send(HTML, subject, to, text, function (result) {
		res.status(result.status).json(result.body);
	});
}

exports.notificacionServicioPagado = function (client, order, callback) {	
	var dateComments = new Date()
	var d = dateComments.getDate();
	var m = dateComments.getMonth();
	var y = dateComments.getFullYear();
	var monthString = getMonth(m)
	var dateCommentsString = String(d)+"/"+monthString+"/"+String(y)

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
	var HTML = `<p>Hola un coordial saludo por parte de DIGDEEP<br>Tenemos buenas noticias, Tu servicio ha sido pagado correctamente</p>
				<p>Cliente:  ${client.fullname} </p>
				<p>Telefono:  ${client.phone} </p>
				<p>Email:  ${client.email} </p>
				<p>Servicio:  ${order.dataService.title} </p>
				<p>Total: $ ${(order.dataService.cost)} MXN</p>`;
	var subject = 'Servicio pagado exitosamente.';
	var text = '';
	send(HTML, subject, client.email, text, function (result) {
		callback(result);
	});
}

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


exports.notificacionDatosSPEI = function (client, order, callback) {
	var HTML = `<p>Hola un coordial saludo por parte de DIGDEEP<br>Tenemos buenas noticias, Tu orden ha sido generada correctamente</p>
				<p>Datos del Cliente</p>
				<p>Nombre:  ${client.fullname} </p>
				<p>Telefono:  ${client.phone} </p>
				<p>Email:  ${client.email} </p>
				<h3><strong>Para realizar el pago de el servicio te presentamos la siguiente información:</strong></h3>
				<p>ID de orden de pago:  ${order.id} </p>
				<p>Banco:  ${order.bank} </p>
				<p>CLABE:  ${order.clabe} </p>				
				<p>Monto: $ ${(order.monto)} MXN</p>
				<h4 style="margin-top: 10px;">INSTRUCCIONES</h4>
				<ul style="list-style-type: none">
					<li>1.- Inicie sesión en su portal online bancario.</li>
					<li>2.- Registre la clave de este ticket. <strong>El banco tendrá que ser ${order.bank}</strong>.</li>
					<li>3.- Hacer transferencia en línea para la cantidad exacta en este ticket, <strong>o la transferencia será rechazada</strong>.</li>
					<li>4.- Para confirmar su pago, su portal online bancario producirá un recibo digital. <strong>Compruebe que se realizó correctamente</strong>.</li>
				</ul>
				<br/>
				<h3 style="color: green;">Al completar estos pasos, <strong>DIGDEEP</strong> te enviará un correo confirmando tu pago de manera inmediata</h3>`;
	var subject = 'Información de pago.';
	var text = '';
	send(HTML, subject, client.email, text, function (result) {
		callback(result);
	});
}


exports.changePasswordUser = function (req, res, next) {
	var email = req.body.email
	console.log(email)
	var options = { 
		method: 'POST',
  		url: 'https://digdeepproyecto.auth0.com/dbconnections/change_password',
 		headers: { 'content-type': 'application/json' },
	  	body: 
	   	{ 	
	   		client_id: "G2UJ5z3vZ933hIMxKyMupB0QmhOwviyR",
		    email: email,
		    connection: 'Username-Password-Authentication' 
		},
	  		json: true 
	  	};
	request(options, function (error, response, body) {
	  if (error) {
	  	console.log(error)
	  	res.status(400)
		res.json({status: 'failure', message: err})
	  }else{
	  	//console.log(response)
	  	console.log(body)
	  	res.json({status: 'success', message: body})
	  }
	});
}