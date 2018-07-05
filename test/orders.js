//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let orderEntity = require('../src/domain/orderEntity');
let bodyParser = require('body-parser');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../web');
let config = require('../config')
let should = chai.should();
let url = config.server_test

chai.use(chaiHttp);

describe('GET ALL ORDERS: ',()=>{
  it('it should GET all ORDERS', (done) => {
    chai.request(url)
      .get('/orders')
      .end((err, res) => {
          //let rest_body = bodyParser.json(res.body)
          console.log(res.body)
          res.should.have.status(201);
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');
          res.body.orders.should.be.a('array');
          //res.body.orders.length.should.be.eql(0);
        done();
      });
  });
});

describe('GET ALL ORDERS PENDING: ',()=>{
  it('it should GET all ORDERS', (done) => {
    chai.request(url)
      .get('/orderspending')
      .end((err, res) => {
          //let rest_body = bodyParser.json(res.body)
          console.log(res.body)
          res.should.have.status(200);
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');
          res.body.orders.should.be.a('array');
          //res.body.orders.length.should.be.eql(0);
        done();
      });
  });
});

describe('GET ALL ORDERS IN PROCESS: ',()=>{
  it('it should GET all ORDERS IN PROCESS', (done) => {
    chai.request(url)
      .get('/ordersinprocess')
      .end((err, res) => {
          //let rest_body = bodyParser.json(res.body)
          console.log(res.body)
          res.should.have.status(200);
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');
          res.body.orders.should.be.a('array');
          //res.body.orders.length.should.be.eql(0);
        done();
      });
  });
});

describe('GET ALL ORDERS FINISHED: ',()=>{
  it('it should GET all ORDERS FINISHED', (done) => {
    chai.request(url)
      .get('/ordersfinished')
      .end((err, res) => {
          //let rest_body = bodyParser.json(res.body)
          console.log(res.body)
          res.should.have.status(200);
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');
          res.body.orders.should.be.a('array');
          //res.body.orders.length.should.be.eql(0);
        done();
      });
  });
});

describe('GET ALL ORDERS CANCELED: ',()=>{
  it('it should GET all ORDERS CANCELED', (done) => {
    chai.request(url)
      .get('/orderscanceled')
      .end((err, res) => {
          //let rest_body = bodyParser.json(res.body)
          console.log(res.body)
          res.should.have.status(200);
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');
          res.body.orders.should.be.a('array');
          //res.body.orders.length.should.be.eql(0);
        done();
      });
  });
});

describe('GET ALL ORDERS PAY: ',()=>{
  it('it should GET all ORDERS PAY', (done) => {
    chai.request(url)
      .get('/orderspay')
      .end((err, res) => {
          //let rest_body = bodyParser.json(res.body)
          console.log(res.body)
          res.should.have.status(200);
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');
          res.body.orders.should.be.a('array');
          //res.body.orders.length.should.be.eql(0);
        done();
      });
  });
});

