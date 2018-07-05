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

/*describe('GET ALL ORDERS OF ONE CLIENTE (USER WITH ROL USER)',()=>{
  it('it should GET all orders of one user ', (done) => {
  //var id_user = "5b3d9bf38e57c80c8c2852ee"
  chai.request(url)
    .get('/ordersbyclient/'+id_user_prueba)
    .set('x-access-token', token_user_prueba)
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
});*/

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

