angular.module('digdeepApp.conektaService', [])
.factory('conektaService', 
['$http', 'APP_SETTINGS', 'APP_MESSAGES','$q',
 function ($http, APP_SETTINGS, APP_MESSAGES, $q) {
    
    // Initial setup conekta
    Conekta.setPublicKey(APP_SETTINGS.CONEKTA.CONEKTA_API_KEY);
    Conekta.setLanguage(APP_SETTINGS.CONEKTA.LANGUAGE);

    //Factory
    var conektaServiceFactory = {};

    // Functions of factory
    conektaServiceFactory.tokenizar = tokenizar;
    conektaServiceFactory.validarTarjeta = validarTarjeta;

    return conektaServiceFactory;

    /**
	 * Metodo que tokeniza una tarjeta
	 * @param  {JSON} card datos de la tarjeta del cliente
	 * @return {Promise}      promesa con el resultado de la tokenizacion de la tarjeta
	 */
    function tokenizar(card) {
        //create a promise
        var deferred = $q.defer();
        //Params para la tarjeta
        var tokenParams = { card: card };
        //API Conekta para tokenizar la tarjeta
        Conekta.Token.create(tokenParams, function (token) {            
            deferred.resolve({ success: true, token: token });
        }, function (err) {
            deferred.reject({ error: true, message: err.message_to_purchaser });
        });
        return deferred.promise;
    }

	/**
	 * Funcion que valida que los datos de la tarjeta sean validos
	 * @param  {JSON} card datos de la tarjeta
	 * @return {Promosie}  promesa con el resultado de la validacion de la tarjeta
	 */
    function validarTarjeta(card) {
        //create a promise
        var deferred = $q.defer();        
        if (!Conekta.card.validateNumber(card.number)) {            
            deferred.reject({error: true, message: APP_MESSAGES.CONEKTA.TARJETA_INVALIDA});
        } else if (!Conekta.card.validateExpirationDate(card.exp_month, card.exp_year)) {
            deferred.reject({error: true, message: APP_MESSAGES.CONEKTA.FECHA_INVALIDA});
        } else if (!Conekta.card.validateCVC(card.cvc)) {            
            deferred.reject({error: true, message: APP_MESSAGES.CONEKTA.CVC_INVALIDO});
        }else {
            deferred.resolve({ success: true, message: APP_MESSAGES.CONEKTA.TARJETA_VALIDA});
        }
        return deferred.promise;
    }
}]);
