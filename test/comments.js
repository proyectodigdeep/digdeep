//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let commentEntity = require('../src/domain/commentEntity');
let bodyParser = require('body-parser');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../web');
let config = require('../config')
let should = chai.should();
let url = config.server_test

chai.use(chaiHttp);

describe('GET ALL COMMENTS: ',()=>{
  it('it should GET all the comments', (done) => {
    chai.request(url)
      .get('/comments')
      .end((err, res) => {
          //let rest_body = bodyParser.json(res.body)
          console.log(res.body)
          res.should.have.status(200);
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');
          res.body.comments.should.be.a('array');
          res.body.comments.length.should.be.eql(0);
        done();
      });
  });
});
