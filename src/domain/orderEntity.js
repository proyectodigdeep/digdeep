var mongoose = require("mongoose")

// Status de orden
//1 : pendiente(esperando a proveedor acepte)
//2 : en proceso(aceptada por el proveedor)
//3 : finalizado(cuando el proveedor termino el servicio)
//4 : cancelado(cuando un usuario o proveedor cancela el servicio)
//6 : procesando el pago(cuando el cliente paga el servicio, y esta siendo procesado por coneckta) 
//5 : pagado cuando el pago ya fue acreditado por conekta.

var orderSchema = new mongoose.Schema({
    client:             mongoose.Schema.Types.ObjectId,
    digdeeper:          mongoose.Schema.Types.ObjectId,
    notes:              [String],
    status:             Number, 
    requestedDate:      Date,
    startDateService:   Date,
    endDateService:     Date,
    payDateService:     Date,
    value:              Number,
    placeService:       String,
    dataCancelOrder: {
        cancelledBy:        String,
        cancelReasons:      String
    },
    dataDelivery: {
        name:           String,
        email:          String,
        phone:          String,
        address:        String
    },
    dataBilling: {
        name:           String,
        rfc:            String,
        phone:          String,
        cp:             String
    },
    dataService: {
        coordinates: {
            lat: Number,
            lng: Number
        },
        dateInit:       Date,
        dateFinish:     Date,
        hourInit:       Date,
        hourFinish:     Date,
        paymentMethod:  String,
        cost:           Number,
        title:          String,
        picture:        String,
        nameDD:         String,
        imgDD:          String,
        nameUser:       String,
        imgUser:        String,
        _service:       mongoose.Schema.Types.ObjectId
    },
    idOrderConekta:     String,
    idMethodPay:        String
})

module.exports = mongoose.model("Orders",orderSchema)