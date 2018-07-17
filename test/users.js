//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let userEntity = require('../src/domain/userEntity');
let bodyParser = require('body-parser');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../web');
let config = require('../config')
let should = chai.should();
let url = config.server_test

chai.use(chaiHttp);
let id_user_prueba = "5b3d9bf38e57c80c8c2852ee"
let id_user_prueba_auth0 = "auth0|5b2b312fc4e1ce04c2710907"
let token_user_prueba = ""
let token_digdeeper_prueba = ""
let id_digdeeper_prueba_auth0 = "auth0|12312312123123123121"
let id_digdeeper_prueba = "5b3da9dffb6fc03328fa4fad"
let id_orderPrueba = ""
let id_methodPayPrueba = ""
describe('GET TOKEN ACCESS FOR USER WITH ROL: "USER", BY ID AUTH0, AFTER TO LOGIN IN AUTH0 ',()=>{
  it('it should GET token access of the one user with rol user', (done) => {
    chai.request(url)
      .get('/tokens_auth0/'+id_user_prueba_auth0)
      .end((err, res) => {
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');

          res.body.token.should.be.a('string');
          token_user_prueba = res.body.token
          done();
      });
  });
})

describe('GET DATA OF ONE USER BY ID',()=>{
  it('it should GET user data', (done) => {
    //var id_user = "5b3d9bf38e57c80c8c2852ee"
    chai.request(url)
      .get('/users/'+id_user_prueba)
      .end((err, res) => {
        //console.log(res.body)
        res.should.have.status(201);
        res.body.should.be.a('object');

        res.body.status.should.be.a('string');
        res.body.status.should.be.eql('success');

        res.body.user.should.be.a('object');
        done();
      });
  });
});

describe('GET ALL BUSY SCHEDULES OF PROVIDER',()=>{
  it('it should GET busy shedules of provider, according to a date', (done) => {
    var data = {
      dateDefaultInit: new Date(),
      dateDefaultFinish: new Date()
    }
    chai.request(url)
      .post('/getordersforRangedatebydigdeeper/'+id_digdeeper_prueba)
      .send(data)
      .end((err, res) => {
        console.log(res.body)
        res.should.have.status(201);
        res.body.should.be.a('object');

        res.body.status.should.be.a('string');
        res.body.status.should.be.eql('success');
        res.body.orders.should.be.a('array');
        done();
      });
  });
});

describe('GET ALL ORDERS REQUESTED OF ONE CLIENTE (USER WITH ROL USER)',()=>{
  it('it should GET all orders of one user ', (done) => {
  //var id_user = "5b3d9bf38e57c80c8c2852ee"
  chai.request(url)
    .get('/ordersofuser/'+id_user_prueba)
    .set('x-access-token', token_user_prueba)
    .end((err, res) => {
      //console.log(res.body)
      res.should.have.status(200);
      res.body.should.be.a('object');

      res.body.status.should.be.a('string');
      res.body.status.should.be.eql('success');

      res.body.orders.should.be.a('array');
      done();
    });
  });
});

describe('USER REQUEST SERVICE AND CREATE ORDER OF THE SERVICE AND DIGDEEPER ACEPT THE SERVICE(ORDER)',()=>{
  it('it should GET order with status 1(waiting provideer)', (done) => {
  //var id_user = "5b3d9bf38e57c80c8c2852ee"
  var data = {
    client: "5b411664e624f50004037e35",
    digdeeper: "5b3fa401835ba5000456b23e",
    idMethodPay: "src_2iszA3KqvoBtf7aar",
    requestedDate: new Date(),
    placeService: "athome",
    
    deliveryData: {
      address: "Polanco 30, Polanco, Polanco V Secc, 11560 Ciudad de México, CDMX, México",
      phone: "23456789",
      email: "j.lpumas@hotmail.com",
      name: "Pato G.",
    },
    dataBilling: {},
    coordinates:{},
    imgUser: "http://res.cloudinary.com/dclbqwg59/image/upload/v1529014920/user_default.png",
    nameUser: "Pato G.",
    imgDD: "http://res.cloudinary.com/dclbqwg59/image/upload/v1529014920/user_default.png",
    nameDD: "Pato Galindo",
    picture: "http://res.cloudinary.com/dclbqwg59/image/upload/v1530986678/xqdpcax7gsjzbq9gdfbd.jpg",
    title: "Djs Alvin",
    _service: "5b3fa5b2835ba5000456b23f",
    cost: 20,
    paymentMethod: "-",
    hourFinish:  new Date(),
    hourInit:  new Date(),
    dateFinish:  new Date(),
    dateInit:  new Date()
  }
  chai.request(url)
    .post('/orders')
    .send(data)
    .set('x-access-token', token_user_prueba)
    .end((err, res) => {
      //console.log(err)
      //console.log(res.body)
      res.should.have.status(201);
      res.body.should.be.a('object');

      res.body.status.should.be.a('string');
      res.body.status.should.be.eql('success');

      res.body.order.should.be.a('object');
      id_orderPrueba = res.body.order._id
      done();
    });
  });

  it('it should GET token access of the one user with rol digdeeper', (done) => {
    chai.request(url)
      .get('/tokens_auth0/'+id_digdeeper_prueba_auth0)
      .end((err, res) => {
          //console.log("token "+res.body.token)
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');

          res.body.token.should.be.a('string');
          token_digdeeper_prueba = res.body.token
          done();
      });
  });
  it('it should GET order updated with status 2(status in process)', (done) => {
    var data = { 
      id_order: id_orderPrueba,
      startDateService: new Date()
    }
    chai.request(url)
      .post('/confirmorders')
      .set('x-access-token', token_digdeeper_prueba)
      .send(data)
      .end((err, res) => {
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');

          res.body.order.should.be.a('object');
          res.body.order.status.should.be.eql(2);
          done();
      });
  });

});


describe('USER REQUEST SERVICE AND CREATE ORDER OF THE SERVICE AND DIGDEEPER CANCEL THE SERVICE(ORDER)',()=>{
  it('it should GET order with status 1(waiting provideer)', (done) => {
  //var id_user = "5b3d9bf38e57c80c8c2852ee"
  var data = {
    client: "5b411664e624f50004037e35",
    digdeeper: "5b3fa401835ba5000456b23e",
    idMethodPay: "src_2iszA3KqvoBtf7aar",
    requestedDate: new Date(),
    placeService: "athome",
    
    deliveryData: {
      address: "Polanco 30, Polanco, Polanco V Secc, 11560 Ciudad de México, CDMX, México",
      phone: "23456789",
      email: "j.lpumas@hotmail.com",
      name: "Pato G.",
    },
    dataBilling: {},
    coordinates:{},
    imgUser: "http://res.cloudinary.com/dclbqwg59/image/upload/v1529014920/user_default.png",
    nameUser: "Pato G.",
    imgDD: "http://res.cloudinary.com/dclbqwg59/image/upload/v1529014920/user_default.png",
    nameDD: "Pato Galindo",
    picture: "http://res.cloudinary.com/dclbqwg59/image/upload/v1530986678/xqdpcax7gsjzbq9gdfbd.jpg",
    title: "Djs Alvin",
    _service: "5b3fa5b2835ba5000456b23f",
    total: 20,
    paymentMethod: "-",
    hourFinish:  new Date(),
    hourInit:  new Date(),
    dateFinish:  new Date(),
    dateInit:  new Date()
  }
  chai.request(url)
    .post('/orders')
    .send(data)
    .set('x-access-token', token_user_prueba)
    .end((err, res) => {
      //console.log(err)
      //console.log(res.body)
      res.should.have.status(201);
      res.body.should.be.a('object');

      res.body.status.should.be.a('string');
      res.body.status.should.be.eql('success');

      res.body.order.should.be.a('object');
      id_orderPrueba = res.body.order._id
      done();
    });
  });

  it('it should GET token access of the one user with rol digdeeper', (done) => {
    chai.request(url)
      .get('/tokens_auth0/'+id_digdeeper_prueba_auth0)
      .end((err, res) => {
          //console.log("token "+res.body.token)
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');

          res.body.token.should.be.a('string');
          token_digdeeper_prueba = res.body.token
          done();
      });
  });
  it('it should GET order updated with status 4(status cancelled)', (done) => {
    var data = { 
      id_order: id_orderPrueba,
      endDateOrder: new Date(),
      id_user: id_user_prueba,
      cancelReasons: "Por que es un test"
    }
    chai.request(url)
      .post('/cancelorders')
      .set('x-access-token', token_digdeeper_prueba)
      .send(data)
      .end((err, res) => {
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');

          res.body.order.should.be.a('object');
          res.body.order.status.should.be.eql(4);
          done();
      });
  });
});

describe('USER REQUEST SERVICE AND CREATE ORDER OF THE SERVICE, DIGDEEPER ACEPT THE SERVICE(ORDER) AND AFTER FINISH THE SERVICE(ORDER)',()=>{
  it('add card to conekta and user, it should GET methods of pay added in conekta for the user', (done) => {
  //var id_user = "5b3d9bf38e57c80c8c2852ee"
  var data = {
    tokenId: "tok_test_visa_4242"
  }
  chai.request(url)
    .post('/addmethodpay/'+id_user_prueba)
    .send(data)
    .set('x-access-token', token_user_prueba)
    .end((err, res) => {
      res.should.have.status(201);
      res.body.should.be.a('object');

      res.body.status.should.be.a('string');
      res.body.status.should.be.eql('success');

      res.body.payment_sources.data.should.be.a('array');
      id_methodPayPrueba = res.body.payment_sources.data[0].id
      done();
    });
  });


  it('user request service, it should GET order with status 1(waiting provideer)', (done) => {
  //var id_user = "5b3d9bf38e57c80c8c2852ee"
  var data = {
    client: id_user_prueba,
    digdeeper: id_digdeeper_prueba,
    idMethodPay: id_methodPayPrueba,
    requestedDate: new Date(),
    placeService: "athome",
    
    deliveryData: {
      address: "Polanco 30, Polanco, Polanco V Secc, 11560 Ciudad de México, CDMX, México",
      phone: "23456789",
      email: "j.lpumas@hotmail.com",
      name: "Pato G.",
    },
    dataBilling: {},
    coordinates:{},
    imgUser: "http://res.cloudinary.com/dclbqwg59/image/upload/v1529014920/user_default.png",
    nameUser: "Pato G.",
    imgDD: "http://res.cloudinary.com/dclbqwg59/image/upload/v1529014920/user_default.png",
    nameDD: "Pato Galindo",
    picture: "http://res.cloudinary.com/dclbqwg59/image/upload/v1530986678/xqdpcax7gsjzbq9gdfbd.jpg",
    title: "Djs Alvin",
    _service: "5b3fa5b2835ba5000456b23f",
    total: 20,
    paymentMethod: "card",
    hourFinish:  new Date(),
    hourInit:  new Date(),
    dateFinish:  new Date(),
    dateInit:  new Date(),

  }
  chai.request(url)
    .post('/orders')
    .send(data)
    .set('x-access-token', token_user_prueba)
    .end((err, res) => {
      //console.log(err)
      //console.log(res.body)
      res.should.have.status(201);
      res.body.should.be.a('object');

      res.body.status.should.be.a('string');
      res.body.status.should.be.eql('success');

      res.body.order.should.be.a('object');
      id_orderPrueba = res.body.order._id
      done();
    });
  });

  it('authentification of digdeeper, it should GET token access of the one user with rol digdeeper', (done) => {
    chai.request(url)
      .get('/tokens_auth0/'+id_digdeeper_prueba_auth0)
      .end((err, res) => {
          //console.log("token "+res.body.token)
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');

          res.body.token.should.be.a('string');
          token_digdeeper_prueba = res.body.token
          done();
      });
  });

  it('digdeeper acept service, it should GET order updated with status 2(status in process)', (done) => {
    var data = { 
      id_order: id_orderPrueba,
      startDateService: new Date()
    }
    chai.request(url)
      .post('/confirmorders')
      .set('x-access-token', token_digdeeper_prueba)
      .send(data)
      .end((err, res) => {
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');

          res.body.order.should.be.a('object');
          res.body.order.status.should.be.eql(2);
          done();
      });
  });

  it('digdeeper finish service, it should GET order updated with status 3 or 6(status finish or procesing pay)', (done) => {
    var data = { 
      id_order: id_orderPrueba,
      endDateService: new Date()
    }
    chai.request(url)
      .post('/finishorders')
      .set('x-access-token', token_digdeeper_prueba)
      .send(data)
      .end((err, res) => {
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');

          res.body.order.should.be.a('object');
          //res.body.order.status.should.be.eql(2);
          done();
      });
  });

});