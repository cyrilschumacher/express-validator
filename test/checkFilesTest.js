var chai = require('chai');
var expect = chai.expect;
var path = require('path');
var request = require('supertest');

var errorMessage = 'Parameter is not an integer';

function validation(req, res) {
  req.checkFiles(0).notEmpty().notEmpty().property("fieldname").equals("test");

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  res.send();
}

function postRoute(path, name, file, done) {
  request(app)
    .post(path)
    .attach(name, file)
    .end(function(err, res) {
      expect(res).to.have.property('status', 200);
      done();
    });
}

before(function() {
  delete require.cache[require.resolve('./helpers/app')];
  app = require('./helpers/app')(validation);
});

describe('#checkFiles()', function() {
  it('should return a success when the file is correct', function(done) {
    const file = path.join(__dirname, 'fixtures/test.txt');
    postRoute('/test/file', 'test', file, done);
  });
});
