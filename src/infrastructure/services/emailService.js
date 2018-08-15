var nodemailer 	= require('nodemailer')
var swig  		= require('swig')
var config 		= require('../../../config')
var request 	= require("request");
var handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');
var async 			= require('async');

var transporter = nodemailer.createTransport({
	host: config.emailFromData.host,
	port: config.emailFromData.port,
	auth: {
		user: config.emailFromData.user,
		pass: config.emailFromData.password
	}
})
var mailOptions = {
	from: config.emailFromData.from,
	to: "j.lpumas@hotmail.com",
	subject: "",
	text: "",
	html: null
}
var pathTemplates = "public/views"
/**
 * Funcion que lee un archivo html
 * @param  {String}   path     ruta del archivo a leer
 * @param  {Function} callback retorna el resultado del archivo 
*/

function readHTMLFile(path, callback) {
	
	//read file
	fs.readFile(path, {encoding: 'utf-8'}, (err, html) => {
		// Se verifica si ocurrio un error
        if (err) {
        	console.log('Error readHTMLFile: '+err);
            callback(err);
        } else {
            callback(null, html);
        }
    });
}

exports.notificacionServicioPagado = function(client, order, callback) {
	//get absoulte path to template
	var absolutePath = path.resolve(pathTemplates+'/notificationServicePaid.html');
	//call function to read html file
	readHTMLFile(absolutePath, (err, html) => {

		//if read file success
		if(html) {
			// complile html file
			var template = handlebars.compile(html);
			
			//define data for template html file
			
			var replacements = {
				client: client,
				order: order
			}

			//send data to html template
			var htmlToSend = template(replacements);

			//options for body mail
			mailOptions.to = client.email;
		    mailOptions.subject = '¡Notificación de estatus de pago!';
		    mailOptions.html = htmlToSend;

		    // send mail with defined transport object
			transporter.sendMail(mailOptions, (error, info) => {
			    
			    // Se verifica si ocurrio un error
			    if (error) {
			    	console.log('Error notificación estatus de pago sendMail: '+error)
			        callback("Mensaje no enviado");
			    }
			    callback("Mensaje enviado con exito")
			    console.log('Message %s sent: %s', info.messageId, info.response);
			})
		}
	})
}

exports.notification_confirm_digdeeper = function(req, res) {
	var data = req.body
	//console.log(data)
	//get absoulte path to template
	var absolutePath = path.resolve(pathTemplates+'/notificationConfirmDD.html');
	//call function to read html file
	readHTMLFile(absolutePath, (err, html) => {

		//if read file success
		if(html) {
			// complile html file
			var template = handlebars.compile(html);
			
			//define data for template html file
			
			var replacements = {
				name: data.name,
				email: data.email
			}

			//send data to html template
			var htmlToSend = template(replacements);

			//options for body mail
			mailOptions.to = data.email;
		    mailOptions.subject = '¡Activación de cuenta DigDeeper!';
		    mailOptions.html = htmlToSend;

		    // send mail with defined transport object
			transporter.sendMail(mailOptions, (error, info) => {
			    // Se verifica si ocurrio un error
			    if (error) {
			    	res.json({
						status: "failure",
						message: "Mensaje no enviado"
					})
			    }else{
			    	res.status(201)
			    	res.json({
						status: "success",
						message: "Mensaje enviado con exito"
					})
			    }
			})
		}
	})
}

exports.notification_noconfirm_digdeeper = function(req, res) {
	var data = req.body
	//console.log(data)
	//get absoulte path to template
	var absolutePath = path.resolve(pathTemplates+'/notificationNoConfirmDD.html');
	//call function to read html file
	readHTMLFile(absolutePath, (err, html) => {

		//if read file success
		if(html) {
			// complile html file
			var template = handlebars.compile(html);
			
			//define data for template html file
			
			var replacements = {
				name: data.name,
				email: data.email
			}

			//send data to html template
			var htmlToSend = template(replacements);

			//options for body mail
			mailOptions.to = data.email;
		    mailOptions.subject = 'Estatus de solicitud para ser DigDeeper';
		    mailOptions.html = htmlToSend;

		    // send mail with defined transport object
			transporter.sendMail(mailOptions, (error, info) => {
			    // Se verifica si ocurrio un error
			    if (error) {
			    	res.json({
						status: "failure",
						message: "Mensaje no enviado"
					})
			    }else{
			    	res.status(201)
			    	res.json({
						status: "success",
						message: "Mensaje enviado con exito"
					})
			    }
			})
		}
	})
}
exports.notification_contact = function(req, res) {
	var data = req.body
	//get absoulte path to template
	var absolutePath = path.resolve(pathTemplates+'/contact.html');
	//call function to read html file
	readHTMLFile(absolutePath, (err, html) => {

		//if read file success
		if(html) {
			// complile html file
			var template = handlebars.compile(html);
			
			//define data for template html file
			
			var replacements = {
				name: data.name,
                phone: data.phone,
                email: data.email,
                message: data.message,
             	lastname: data.lastname   
			}

			//send data to html template
			var htmlToSend = template(replacements);

			//options for body mail
			mailOptions.to = config.email_digdeep;
		    mailOptions.subject = '¡Contactacto DigDeep!';
		    mailOptions.html = htmlToSend;

		    // send mail with defined transport object
			transporter.sendMail(mailOptions, (error, info) => {
			    // Se verifica si ocurrio un error
			    if (error) {
			    	res.json({
						status: "failure",
						message: "Mensaje no enviado"
					})
			    }else{
			    	res.status(201)
			    	res.json({
						status: "success",
						message: "Mensaje enviado con exito"
					})
			    }
			})
		}
	})
}

exports.notification_contract = function(req, res) {
	//console.log(req.body)
	var data = req.body
	console.log(data)
	//get absoulte path to template
	var absolutePath = path.resolve(pathTemplates+'/contract.html');
	var absolutePath2 = path.resolve(pathTemplates+'/contract2.html');

	let tasks = {
			EmailUsuario: function (callback) {
				//call function to read html file
				readHTMLFile(absolutePath, (err, html) => {

					//if read file success
					if(html) {
						// complile html file
						var template = handlebars.compile(html);
						
						//define data for template html file
						
						var replacements = {}
							replacements = data

						//send data to html template
						var htmlToSend = template(replacements);

						//options for body mail
						mailOptions.to = data.client.email+","+config.email_digdeep;
					    mailOptions.subject = '¡Orden de compra!';
					    mailOptions.html = htmlToSend;

					    // send mail with defined transport object
						transporter.sendMail(mailOptions, (error, info) => {
						    // Se verifica si ocurrio un error
						    if (error) {
						    	callback(err, null);
						    	/*res.json({
									status: "failure",
									message: "Mensaje no enviado"
								})*/
						    }else{
						    	callback(null, "success");
						    	/*res.status(201)
						    	res.json({
									status: "success",
									message: "Mensaje enviado con exito"
								})*/
						    }
						})
					}
				})
			},
			EmailDigdeeper: function (callback) {
				//call function to read html file
				readHTMLFile(absolutePath2, (err, html) => {

					//if read file success
					if(html) {
						// complile html file
						var template = handlebars.compile(html);
						
						//define data for template html file
						
						var replacements = {}
							replacements = data

						//send data to html template
						var htmlToSend = template(replacements);

						//options for body mail
						mailOptions.to = data.digdeeper.email+","+config.email_digdeep;
					    mailOptions.subject = '¡Solicitud de servicio!';
					    mailOptions.html = htmlToSend;

					    // send mail with defined transport object
						transporter.sendMail(mailOptions, (error, info) => {
						    // Se verifica si ocurrio un error
						    if (error) {
						    	callback(err, null);
						    	/*res.json({
									status: "failure",
									message: "Mensaje no enviado"
								})*/
						    }else{
						    	callback(null, "success");
						    	/*res.status(201)
						    	res.json({
									status: "success",
									message: "Mensaje enviado con exito"
								})*/
						    }
						})
					}
				})
			}
		}
		async.parallel(async.reflectAll(tasks), function(err, result) {
			if (err) {
				res.status(400)
				res.json({
					status: "failure",
					message: err
				})
			}else{
				console.log(result)
				res.status(200)
		 		res.json({
		 			status: "success",
		 			message: "Mensajes enviados"
		 		})
			}
		});

	
}
exports.notification_contract2 = function(req, res) {
	//console.log(req.body)
	var data = req.body
	console.log(data)
	//get absoulte path to template
	var absolutePath = path.resolve(pathTemplates+'/contract2.html');
	//call function to read html file
	readHTMLFile(absolutePath, (err, html) => {

		//if read file success
		if(html) {
			// complile html file
			var template = handlebars.compile(html);
			
			//define data for template html file
			
			var replacements = {}
				replacements = data

			//send data to html template
			var htmlToSend = template(replacements);

			//options for body mail
			mailOptions.to = data.to_send_users+","+config.email_digdeep;
		    mailOptions.subject = '¡Solicitud de servicio!';
		    mailOptions.html = htmlToSend;

		    // send mail with defined transport object
			transporter.sendMail(mailOptions, (error, info) => {
			    // Se verifica si ocurrio un error
			    if (error) {
			    	res.json({
						status: "failure",
						message: "Mensaje no enviado"
					})
			    }else{
			    	res.status(201)
			    	res.json({
						status: "success",
						message: "Mensaje enviado con exito"
					})
			    }
			})
		}
	})
}

exports.notification_cancel_user = function(req, res) {
	//console.log(req.body)
	var data = req.body
	console.log(data)
	//get absoulte path to template
	var absolutePath = path.resolve(pathTemplates+'/cancel_service_user.html');
	//call function to read html file
	readHTMLFile(absolutePath, (err, html) => {

		//if read file success
		if(html) {
			// complile html file
			var template = handlebars.compile(html);
			
			//define data for template html file
			
			var replacements = {}
				replacements = data

			//send data to html template
			var htmlToSend = template(replacements);

			//options for body mail
			mailOptions.to = data.to_send_users+","+config.email_digdeep;
		    mailOptions.subject = '¡Cancelación de servicio!';
		    mailOptions.html = htmlToSend;

		    // send mail with defined transport object
			transporter.sendMail(mailOptions, (error, info) => {
			    // Se verifica si ocurrio un error
			    if (error) {
			    	res.json({
						status: "failure",
						message: "Mensaje no enviado"
					})
			    }else{
			    	res.status(201)
			    	res.json({
						status: "success",
						message: "Mensaje enviado con exito"
					})
			    }
			})
		}
	})
}

exports.notification_cancel_digdeeper = function(req, res) {
	//console.log(req.body)
	var data = req.body
	console.log(data)
	//get absoulte path to template
	var absolutePath = path.resolve(pathTemplates+'/cancel_service_digdeeper.html');
	//call function to read html file
	readHTMLFile(absolutePath, (err, html) => {

		//if read file success
		if(html) {
			// complile html file
			var template = handlebars.compile(html);
			
			//define data for template html file
			
			var replacements = {}
				replacements = data

			//send data to html template
			var htmlToSend = template(replacements);

			//options for body mail
			mailOptions.to = data.to_send_users+","+config.email_digdeep;
		    mailOptions.subject = '¡Cancelación de servicio!';
		    mailOptions.html = htmlToSend;

		    // send mail with defined transport object
			transporter.sendMail(mailOptions, (error, info) => {
			    // Se verifica si ocurrio un error
			    if (error) {
			    	res.json({
						status: "failure",
						message: "Mensaje no enviado"
					})
			    }else{
			    	res.status(201)
			    	res.json({
						status: "success",
						message: "Mensaje enviado con exito"
					})
			    }
			})
		}
	})
}

exports.notification_confirm_service = function(req, res) {
	//console.log(req.body)
	var data = req.body
	console.log(data)
	//get absoulte path to template
	var absolutePath = path.resolve(pathTemplates+'/confirm_service.html');
	//call function to read html file
	readHTMLFile(absolutePath, (err, html) => {

		//if read file success
		if(html) {
			// complile html file
			var template = handlebars.compile(html);
			
			//define data for template html file
			
			var replacements = {}
				replacements = data

			//send data to html template
			var htmlToSend = template(replacements);

			//options for body mail
			mailOptions.to = data.to_send_users
		    mailOptions.subject = '¡Confirmación de servicio!';
		    mailOptions.html = htmlToSend;

		    // send mail with defined transport object
			transporter.sendMail(mailOptions, (error, info) => {
			    // Se verifica si ocurrio un error
			    if (error) {
			    	res.json({
						status: "failure",
						message: "Mensaje no enviado"
					})
			    }else{
			    	res.status(201)
			    	res.json({
						status: "success",
						message: "Mensaje enviado con exito"
					})
			    }
			})
		}
	})
}

exports.notification_comments = function(req, res) {
	//console.log(req.body)
	var data = req.body
	console.log(data)
	//get absoulte path to template
	var absolutePath = path.resolve(pathTemplates+'/comments_service.html');
	//call function to read html file
	readHTMLFile(absolutePath, (err, html) => {

		//if read file success
		if(html) {
			// complile html file
			var template = handlebars.compile(html);
			
			//define data for template html file
			
			var replacements = {}
				replacements = data

			//send data to html template
			var htmlToSend = template(replacements);

			//options for body mail
			mailOptions.to = config.email_digdeep
		    mailOptions.subject = '¡Comentarios de un servicio!';
		    mailOptions.html = htmlToSend;

		    // send mail with defined transport object
			transporter.sendMail(mailOptions, (error, info) => {
			    // Se verifica si ocurrio un error
			    if (error) {
			    	res.json({
						status: "failure",
						message: "Mensaje no enviado"
					})
			    }else{
			    	res.status(201)
			    	res.json({
						status: "success",
						message: "Mensaje enviado con exito"
					})
			    }
			})
		}
	})
}

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

/*exports.notificacionServicioPagado = function (client, order, callback) {	
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
}*/

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
	var options = { method: 'POST',
		url: 'https://digdeepproyecto.auth0.com/dbconnections/change_password',
		headers: { 'content-type': 'application/json' },
		body: 
		   { //client_id: 'M1MW9PYFJ63ePUutLzAORebfOwKw1-Ac',
		     email: email,
		     connection: 'Username-Password-Authentication' },
		json: true 
	};

	request(options, function (error, response, body) {
	  if (error){
	  	res.status(400)
		res.json({status: 'failure', message: err})
	  }else{
	  	console.log(body);
	  	res.json({status: 'success', message: body})
	  }
	});
}