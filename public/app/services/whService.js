const express = require('express');
const conekta = require('conekta');
const config = require('../../../config');

conekta.api_key = config.conekta.apiKey;
conekta.locale = config.conekta.locale;

exports.whConekta = function (req, res) {
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
}