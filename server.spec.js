const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Routes', () => {
    describe('/', () => {
        it('should respond with a 200 when successful', (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});
