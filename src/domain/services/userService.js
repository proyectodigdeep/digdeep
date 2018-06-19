var crypto = require('crypto')

exports.protectPassword = function(password, onSuccess, onError) {

	var salt = this.genRandomString(16)
	var passwordHash = this.sha512(password, salt)

	onSuccess(passwordHash, salt)
}

exports.genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0,length)   /** return required number of characters */
}

exports.sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt) /** Hashing algorithm sha512 */
    hash.update(password)
    return hash.digest('hex')
}
