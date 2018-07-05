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
//let tokenPruebaAdmin = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwiX2lkIjoiNWE2ZmViYzNlODRhNDYwNWM4YzU2MThiIiwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsicm9sZXMiOiJpbml0IiwiY2F0ZWdvcmllc1NlcnZpY2VzIjoiZGVmYXVsdCIsInZhbHVlcyI6ImluaXQiLCJraW5kU2VydmljZXMiOiJkZWZhdWx0IiwicG9zdGVkU2VydmljZXMiOiJkZWZhdWx0IiwibXlTZXJ2aWNlc1JlcXVlc3RlZCI6ImRlZmF1bHQiLCJmdWxsbmFtZSI6ImluaXQiLCJiaXJ0aGRhdGUiOiJpbml0IiwiZW1haWwiOiJpbml0IiwicGFzc3dvcmQiOiJtb2RpZnkiLCJwaG9uZSI6ImluaXQiLCJhZGRyZXNzIjoiaW5pdCIsIm51bWJlckhvdXNlIjoiaW5pdCIsInBvc3RhbENvZGUiOiJpbml0IiwiY29sb255IjoiaW5pdCIsImNpdHkiOiJpbml0Iiwic3RhdGUiOiJpbml0IiwidXJsSW1nIjoiaW5pdCIsInNhbHQiOiJtb2RpZnkiLCJ2ZXJpZmllZCI6ImluaXQiLCJkYXRlUmVnaXN0ZXIiOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6eyJjYXRlZ29yaWVzU2VydmljZXMiOnRydWUsImtpbmRTZXJ2aWNlcyI6dHJ1ZSwicG9zdGVkU2VydmljZXMiOnRydWUsIm15U2VydmljZXNSZXF1ZXN0ZWQiOnRydWV9LCJpbml0Ijp7InJvbGVzIjp0cnVlLCJ2YWx1ZXMiOnRydWUsImZ1bGxuYW1lIjp0cnVlLCJiaXJ0aGRhdGUiOnRydWUsImVtYWlsIjp0cnVlLCJwaG9uZSI6dHJ1ZSwiYWRkcmVzcyI6dHJ1ZSwibnVtYmVySG91c2UiOnRydWUsInBvc3RhbENvZGUiOnRydWUsImNvbG9ueSI6dHJ1ZSwiY2l0eSI6dHJ1ZSwic3RhdGUiOnRydWUsInVybEltZyI6dHJ1ZSwidmVyaWZpZWQiOnRydWUsImRhdGVSZWdpc3RlciI6dHJ1ZSwiX2lkIjp0cnVlfSwibW9kaWZ5Ijp7InNhbHQiOnRydWUsInBhc3N3b3JkIjp0cnVlfSwicmVxdWlyZSI6e319LCJzdGF0ZU5hbWVzIjpbInJlcXVpcmUiLCJtb2RpZnkiLCJpbml0IiwiZGVmYXVsdCIsImlnbm9yZSJdfSwicGF0aHNUb1Njb3BlcyI6e30sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfSwiJG9wdGlvbnMiOnRydWV9LCJpc05ldyI6ZmFsc2UsIl9kb2MiOnsicm9sZXMiOlsicm9vdCJdLCJjYXRlZ29yaWVzU2VydmljZXMiOltdLCJ2YWx1ZXMiOltdLCJraW5kU2VydmljZXMiOltdLCJwb3N0ZWRTZXJ2aWNlcyI6W10sIm15U2VydmljZXNSZXF1ZXN0ZWQiOltdLCJmdWxsbmFtZSI6IkRJR0RFRVAgQURNSU4iLCJiaXJ0aGRhdGUiOiIyL2ZlYnJlcm8vMTk5MCIsImVtYWlsIjoibWFuYWdlckBkaWdkZWVwLmNvbS5teCIsInBob25lIjoiMTIzNDU2NTciLCJhZGRyZXNzIjoiQ2FsbGUgZGUgbGEgbmnDsWV6IiwibnVtYmVySG91c2UiOjEyLCJwb3N0YWxDb2RlIjoyOTg4LCJjb2xvbnkiOiJIb3NwaXRhbCBkZWwgbmnDsW8gcG9ibGFubyIsImNpdHkiOiJQdWVibGEiLCJzdGF0ZSI6IlB1ZWJsYSIsInVybEltZyI6ImltZy91c2VyRGVmYXVsdC5wbmciLCJ2ZXJpZmllZCI6ZmFsc2UsImRhdGVSZWdpc3RlciI6IjIwMTgtMDEtMzBUMDM6NTE6MzEuMjMzWiIsIl9pZCI6IjVhNmZlYmMzZTg0YTQ2MDVjOGM1NjE4YiJ9LCIkaW5pdCI6dHJ1ZSwiaWF0IjoxNTMwODA5NDcyLCJleHAiOjE1MzM0MDE0NzJ9.SOe5p7C3u4OilE40dLnEmdz0Q60eMHPB5dnKbeE7Lu8"
let tokenPruebaAdmin = ""
let id_digdeeper_prueba = "5b3da9dffb6fc03328fa4fad"

describe('AUTHENTICATE ADMIN IN DIGDEEP(ROOT): ',()=>{
  it('it should GET token access ', (done) => {
    var data = {
      email: "manager@digdeep.com.mx",
      password: "digdeep1"
    }
    chai.request(url)
      .post('/authenticate')
      .send(data)
      .end((err, res) => {
          //let rest_body = bodyParser.json(res.body)
          //console.log(res.body)
          res.body.should.be.a('object');

          res.body.success.should.be.eql(true);
          res.body.token.should.be.a('string');
          tokenPruebaAdmin = res.body.token
          //res.body.comments.length.should.be.eql(0);
        done();
      });
  });
});

describe('MANAGER GET ALL USERS WITH ROLL: "DIGDEEPER"',()=>{
  it('manager, it should GET users with roll:"DIGDEEPER"', (done) => {
    var id_manager = "5a6febc3e84a4605c8c5618b" // definido por default en la db
    chai.request(url)
      .get('/providers/'+id_manager)
      .set('x-access-token', tokenPruebaAdmin)
      .end((err, res) => {
          //console.log(res.body)
          res.should.have.status(201);
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');

          res.body.users.should.be.a('array');
          done();
      });
  });
});

describe('GET ALL ORDERS: ',()=>{
  it('it should GET all ORDERS', (done) => {
    chai.request(url)
      .get('/orders')
      .set('x-access-token', tokenPruebaAdmin)
      .end((err, res) => {
          //let rest_body = bodyParser.json(res.body)
          //console.log(res.body)
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

describe('GET ALL ORDERS WITH STATUS PENDING: ',()=>{
  it('it should GET all ORDERS', (done) => {
    chai.request(url)
      .get('/orderspending')
      .set('x-access-token', tokenPruebaAdmin)
      .end((err, res) => {
          //let rest_body = bodyParser.json(res.body)
          //console.log(res.body)
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

describe('GET ALL ORDERS WITH STATUS IN PROCESS: ',()=>{
  it('it should GET all ORDERS IN PROCESS', (done) => {
    chai.request(url)
      .get('/ordersinprocess')
      .set('x-access-token', tokenPruebaAdmin)
      .end((err, res) => {
          //let rest_body = bodyParser.json(res.body)
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

describe('GET ALL ORDERS WITH STATUS FINISHED: ',()=>{
  it('it should GET all ORDERS FINISHED', (done) => {
    chai.request(url)
      .get('/ordersfinished')
      .set('x-access-token', tokenPruebaAdmin)
      .end((err, res) => {
          //let rest_body = bodyParser.json(res.body)
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

describe('GET ALL ORDERS WITH STATUS CANCELED: ',()=>{
  it('it should GET all ORDERS CANCELED', (done) => {
    chai.request(url)
      .get('/orderscanceled')
      .set('x-access-token', tokenPruebaAdmin)
      .end((err, res) => {
          //let rest_body = bodyParser.json(res.body)
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

describe('GET ALL ORDERS WITH STATUS PAY: ',()=>{
  it('it should GET all ORDERS PAY', (done) => {
    chai.request(url)
      .get('/orderspay')
      .set('x-access-token', tokenPruebaAdmin)
      .end((err, res) => {
          //let rest_body = bodyParser.json(res.body)
          //console.log(res.body)
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

describe('ADMIN DISVALIDATE PROVIDER: ',()=>{
  it('it should GET user with roll: "digdeeper", with parameter verified: false', (done) => {
    chai.request(url)
      .get('/disvalidateproviders/'+id_digdeeper_prueba)
      .set('x-access-token', tokenPruebaAdmin)
      .end((err, res) => {
          //let rest_body = bodyParser.json(res.body)
          //console.log(res.body)
          res.should.have.status(201);
          res.body.should.be.a('object');

          res.body.status.should.be.a('string');
          res.body.status.should.be.eql('success');
          res.body.user.should.be.a('object');
          res.body.user.should.be.a('object');
          //res.body.orders.length.should.be.eql(0);
        done();
      });
  });
});