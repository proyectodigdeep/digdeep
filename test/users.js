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

describe('REGISTER ONE USER WITH ROL:"USER", AFTER TO REGISTER IN AUTH0: ',()=>{
  it('it should GET ONE USER WITH ROL: "USER" REGISTERED', (done) => {
    let user = {
      name: 'Fulanito Perez',
      email: 'Fulanito@gmail.com',
      roll: "user",
      auth0Id: "id_auth0_PRUEBA_0101010101001",
      urlImg: "http://res.cloudinary.com/dclbqwg59/image/upload/v1529014920/user_default.png"
    }
    chai.request(url)
      .post('/users_register')
      .send(user)
      .end((err, res) => {
          //let rest_body = bodyParser.json(res.body)
          if (err) {
            console.log(err)
          }else{
            //console.log(res.body)
            res.should.have.status(201);
            res.body.should.be.a('object');

            res.body.status.should.be.a('string');
            res.body.status.should.be.eql('success');
            
            res.body.user.should.be.a('object');
            res.body.message.should.be.a('string');
          }
        done();
      });
  });
});

describe('GET TOKEN ACCESS FOR USER BY ID AUTH0, AFTER TO LOGIN IN AUTH0 ',()=>{
  it('it should GET token access of the one user', (done) => {
    var idUser_auth0 = "auth0|5b2b312fc4e1ce04c2710907"
    chai.request(url)
      .get('/users_auth0/'+idUser_auth0)
      .end((err, res) => {
        if (err) {
          console.log(err)
        }else{
          //console.log(res.body)
          res.should.have.status(201);
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');

          res.body.token.should.be.a('string');
        }
         
        done();
      });
  });
});