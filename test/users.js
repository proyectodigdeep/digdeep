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

/*describe('REGISTER ONE USER WITH ROL:"USER OR DIGDEEPER", AFTER TO REGISTER IN AUTH0: ',()=>{
  it('it should GET ONE USER WITH ROL: "USER OR DIGDEEPER" REGISTERED', (done) => {
    let user = {
      name: 'Fulanito Perez',
      email: 'Fulanito@gmail.com',
      roll: "user",
      auth0Id: "auth0|3837227342834234234",
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
    var idUser_auth0 = "auth0|3837227342834234234"
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
})*/

describe('GET DATA OF ONE USER BY ID',()=>{
  it('it should GET user data', (done) => {
    var id_user = "5b3d9bf38e57c80c8c2852ee"
    chai.request(url)
      .get('/users/'+id_user)
      .end((err, res) => {
        if (err) {
          console.log(err)
        }else{
          console.log(res.body)
          res.should.have.status(201);
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');

          res.body.user.should.be.a('object');
        }
        done();
      });
  });
});

describe('MANAGER GET ALL USERS WITH ROLL: "DIGDEEPER"',()=>{
  it('manager, it should GET users with roll:"DIGDEEPER"', (done) => {
    var id_manager = "5a6febc3e84a4605c8c5618b" // definido por default en la db
    chai.request(url)
      .get('/providers/'+id_manager)
      .end((err, res) => {
        if (err) {
          //console.log(err)
        }else{
          //console.log(res.body)
          res.should.have.status(201);
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');

          res.body.users.should.be.a('array');
        }
        done();
      });
  });
});
