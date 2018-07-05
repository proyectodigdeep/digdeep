//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let categoryEntity = require('../src/domain/categoryEntity');
let bodyParser = require('body-parser');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../web');
let config = require('../config')
let should = chai.should();
let url = config.server_test

chai.use(chaiHttp);

describe('GET ALL CATEGORIES OF DIGDEEP: ',()=>{
  it('it should GET all the categories of digdeep', (done) => {
    chai.request(url)
      .get('/categories')
      .end((err, res) => {
          //let rest_body = bodyParser.json(res.body)
          //console.log(res.body)
          res.should.have.status(201);
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');
          res.body.categories.should.be.a('array');
          //res.body.comments.length.should.be.eql(0);
        done();
      });
  });
});

describe('GET ALL SUBCATEGORIES OF DIGDEEP: ',()=>{
  it('it should GET all the subcategories of digdeep', (done) => {
    chai.request(url)
      .get('/subcategories')
      .end((err, res) => {
          //let rest_body = bodyParser.json(res.body)
          //console.log(res.body)
          res.should.have.status(201);
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');
          res.body.subcategories.should.be.a('array');
          //res.body.comments.length.should.be.eql(0);
        done();
      });
  });
});
