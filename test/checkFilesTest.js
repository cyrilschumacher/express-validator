var chai = require('chai');
var expect = chai.expect;
var path = require('path');
var request = require('supertest');

function validation(req, res) {
  req.checkFiles(0).notEmpty().notEmpty().property('mimetype').equals('image/jpeg');

  var errors = req.validationErrors();
  if (errors) {
    res.status(400);
  }

  res.send();
}

function fail(res) {
  expect(res).to.have.property('status', 400);
}

function pass(res) {
  expect(res).to.have.property('status', 200);
}

function postRoute(path, name, file, test, done) {
  request(app)
    .post(path)
    .attach(name, file)
    .end(function(err, res) {
      test(res);
      done();
    });
}

before(function() {
  delete require.cache[require.resolve('./helpers/app')];
  app = require('./helpers/app')(validation);
});

describe('#checkFiles()', function() {
  it('should return a success when the file is valid', function(done) {
    const name = 'test';
    const file = path.join(__dirname, 'fixtures/test.jpg');
    postRoute('/test/file', name, file, pass, done);
  });
  it('should return error when the file is not jpeg type', function(done) {
    const name = 'test';
    const file = path.join(__dirname, 'fixtures/test.txt');
    postRoute('/test/file', name, file, fail, done);
  });
});
