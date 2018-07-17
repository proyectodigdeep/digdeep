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
let id_digdeeper_prueba = "5b3da9dffb6fc03328fa4fad"
let id_digdeeper_prueba_auth0 = "auth0|12312312123123123121"
let token_digdeeper_prueba = ""

describe('GET TOKEN ACCESS FOR USER WITH ROL: "DIGDEEPER", BY ID AUTH0, AFTER TO LOGIN IN AUTH0 ',()=>{
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
})

describe('GET ALL ORDERS OF ONE DIGDEEPER (USER WITH ROL USER)',()=>{
  it('it should GET all orders of one user with rol "digdeeper"', (done) => {
  chai.request(url)
    .get('/ordersbydigdeeper/'+id_digdeeper_prueba)
    .set('x-access-token', token_digdeeper_prueba)
    .end((err, res) => {
      //console.log(res.body)
      res.should.have.status(201);
      res.body.should.be.a('object');

      res.body.status.should.be.a('string');
      res.body.status.should.be.eql('success');

      res.body.orders.should.be.a('array');
      done();
    });
  });
});


/* aun no esta
describe('REGISTER EVENT IN CALENDAR OF THE DIGDEEPER',()=>{
  it('it should GET all events of one user with rol "digdeeper"', (done) => {
  chai.request(url)
    .post('/events_by_digdeeper/'+id_digdeeper_prueba)
    .set('x-access-token', token_digdeeper_prueba)
    .end((err, res) => {
      //console.log(res.body)
      res.should.have.status(201);
      res.body.should.be.a('object');

      res.body.status.should.be.a('string');
      res.body.status.should.be.eql('success');

      res.body.events.should.be.a('array');
      done();
    });
  });
});*/

describe('GET ALL EVENTS REGISTERED IN CALENDAR OF ONE DIGDEEPER',()=>{
  it('it should GET all events of one user with rol "digdeeper"', (done) => {
  chai.request(url)
    .get('/events_by_digdeeper/'+id_digdeeper_prueba)
    .end((err, res) => {
      //console.log(res.body)
      res.should.have.status(201);
      res.body.should.be.a('object');

      res.body.status.should.be.a('string');
      res.body.status.should.be.eql('success');

      res.body.events.should.be.a('array');
      done();
    });
  });
});

describe('UPDATE DATA USER WITH ROL: "DIGDEEPER"',()=>{
  it('it should GET user updated', (done) => {
    var data ={
      fullname: "DEMO FULANITO PEREZ GONZALEZ",
      birthdate: "2/febrero/1990",
      phone: "512534125344",
      address: "Calle de la niñez",
      numberHouse: 2221,
      postalCode: 12312,
      colony: "Calle de la niñez 1001",
      city: "México",
      state: "Puebla",
      specialty: "bodas",
      logo: "-",
      rfc: "rfc12336544",
      instagram: "foto dany",
      fanPage: "www.ffotodany.com",
      webPage: "www.fotodany.com",
      urlImg: "img/userDefault.png",
      temp_service: "5a6f645904150a34ec687095"
    }
  chai.request(url)
    .put('/users/'+id_digdeeper_prueba)
    .set('x-access-token', token_digdeeper_prueba)
    .send(data)
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

describe('DIGDEEPER CREATE SERVICE',()=>{
  it('it should GET service created', (done) => {
  //var id_user = "5b3d9bf38e57c80c8c2852ee"
  var data = {
    title: "Servicio de prueba",
    category: "5a6f655d04150a34ec687097",
    subcategory: "5a6f639104150a34ec687092",
    price_athome: 300,
    price_presencial: 250,
    description: "Es un servicio de prueba",
    userId: id_digdeeper_prueba,
    pictures: []
  }
  chai.request(url)
    .post('/services')
    .send(data)
    .end((err, res) => {
      //console.log(err)
      //console.log(res.body)
      res.should.have.status(201);
      res.body.should.be.a('object');

      res.body.status.should.be.a('string');
      res.body.status.should.be.eql('success');
      //res.body.message.should.be.eql('Servicio creado correctamente');

      res.body.service.should.be.a('object');
      done();
    });
  });
});

describe('GET ALL SERVICES OF PROVIDER(DIGDEEPER)',()=>{
  it('it should GET all services created for one provider', (done) => {
  
  chai.request(url)
    .get('/servicesbydigdeeper/'+id_digdeeper_prueba)
    .end((err, res) => {
      //console.log(err)
      //console.log(res.body)
      res.should.have.status(201);
      res.body.should.be.a('object');

      res.body.status.should.be.a('string');
      res.body.status.should.be.eql('success');
      
      res.body.services.should.be.a('array');
      done();
    });
  });
});

describe('GET ALL SERVICES WITH COMMENTS OF PROVIDER(DIGDEEPER)',()=>{
  it('it should GET all services with comments, of provider created for one provider', (done) => {
  chai.request(url)
    .get('/servicesbydigdeepercomments/'+id_digdeeper_prueba)
    .end((err, res) => {
      //console.log(err)
      //console.log(res.body)
      res.should.have.status(201);
      res.body.should.be.a('object');

      res.body.status.should.be.a('string');
      res.body.status.should.be.eql('success');
      
      res.body.services.should.be.a('array');
      done();
    });
  });
});

describe('CREATE EVENT IN CALENDAR',()=>{
  it('it should GET all services with comments, of provider created for one provider', (done) => {
  var data = {
    title: "un evento",
    hourInit: new Date(),
    hourFinal: new Date(),
    date: new Date(),
    _digdeeper: id_digdeeper_prueba
  }
  chai.request(url)
    .post('/events/')
    .send(data)
    .set('x-access-token', token_digdeeper_prueba)
    .end((err, res) => {
      //console.log(err)
      //console.log(res.body)
      res.should.have.status(201);
      res.body.should.be.a('object');

      res.body.status.should.be.a('string');
      res.body.status.should.be.eql('success');
      
      res.body.event.should.be.a('object');
      done();
    });
  });
});