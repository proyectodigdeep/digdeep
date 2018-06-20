const express = require('express');
const conekta = require('conekta');
const config = require('../../../config');

conekta.api_key = config.conekta.apiKey;
conekta.locale = config.conekta.locale;

module.exports = {
    createOrder: function (orden, customer, paymentMethod, tokenId, onSucces, onError) {        
        var order = {
            "currency": config.conekta.currency,            
            "line_items": [{
                "name": orden.name,
                "unit_price": (orden.price * 100),
                "quantity": 1
            }]        
        };
        if (paymentMethod === 'card') {            
            order['customer_info'] = {
                "customer_id": customer.customerId
            };
            order['charges'] = [
                {
                    "payment_method": {
                        "type": paymentMethod,
                        //"token_id": tokenId
                        "payment_source_id": tokenId
                    }
                }
            ];
        }else {
            order['customer_info'] = {
                name: customer.name,
                email: customer.email,
                phone: customer.phone
            };
            order['charges'] = [
                {
                    "payment_method": {
                        "type": paymentMethod,                        
                    }
                }
            ];
        }
        /*if (paymentMethod === 'card_saved') {            
            order['customer_info'] = {
                "customer_id": customer.customerId
            };
            order['charges'] = [
                {
                    "payment_method": {
                        "type": "paymentMethod",
                        "token_id": tokenId
                    }
                }
            ];
        }*/

        conekta.Order.create(order, function (err, _order) {

            if (!err) {
                console.log(err)
                return onSucces(_order.toObject());
            }
            return onError(err);
        });
    },

    createCustomer: function (cliente, tokenId, onSuccess, onError) {
        var customer = {
            'name': cliente.name,
            'email': cliente.email,
            'phone': cliente.phone,
            'payment_sources': [{
                'type': 'card',
                'token_id': tokenId
            }]
        };
        // Se recupera el nombre del cliente        
        conekta.Customer.create(customer, function (err, customer) {            
            if (!err) {
                //console.log(err.err.details[0])
                return onSuccess(customer.toObject());
            }
            return onError(err);
        });
    },


    searchCustomer: function(customerId, onSuccess, onError) {
        //conekta.api_key = config.conekta.api_key;
        //conekta.locale = 'es';
        // Se invoca al servicio
        conekta.Customer.find(customerId, (err, customer) => {
            
            // Si ocurrio un error
            if(err) {
                console.log(err)
                onError(err)
            }else{
                console.log(customer.toObject())
                console.log(customer.toObject().payment_sources)
                onSuccess(customer.toObject())
            }
        });
    },

    addCardCustomer: function(customerId, tokenId, onSuccess, onError) {
        //conekta.api_key = config.conekta.api_key;
        //conekta.locale = 'es';
        // Se invoca al servicio
        conekta.Customer.find(customerId, (err, customer) => {
            // Si ocurrio un error
            if(err) {
                console.log(err)
                onError(err)
            }else{
                customer.createPaymentSource({
                    type: "card",
                    token_id: tokenId
                }, function(err, res) {
                    if(err) {
                        console.log(err)
                        onError(err)
                    }else{
                        console.log(customer.toObject())
                        console.log(customer.toObject().payment_sources)
                        onSuccess(customer.toObject())
                    }
                })
            }
        }); 
    },

    createOrderOxxo: function(order, user, onSuccess, onError){
        //conekta.api_key = config.conekta.api_key;
        //conekta.locale = 'es';
        conekta.Order.create({
            currency: config.conekta.currency,
            customer_info: {
                name: user.name,
                phone: user.phone,
                email: user.email
            },
            line_items: [{
                name: order.name,//"Box of Cohiba S1s"
                description: order.description,//"Imported From Mex."
                unit_price: (order.price * 100),// precio del producto en centavos
                quantity: order.quantity//1
            }],
            charges:[{
                payment_method: {
                  type: "oxxo_cash"
                } 
            }]
            //paymentMethod.payment_source_id = pedido.usuario.customer.tokenId;
        }, function(err, res) {

            if (err) {
                console.log(err);
                onError(err.type)
            }else{
                console.log(res.toObject());    
                onSuccess(res.toObject())
            }
        });
    },

    getOrder: function(id_order, onSuccess, onError){
        //conekta.api_key = config.conekta.api_key;
        //conekta.locale = 'es';
        var order = conekta.Order.find(id_order);
        order.capture();
        if (order) {
            onSuccess(order)
        }else{
            onError("No se pudo encontrar la orden")
        }
    }
};
