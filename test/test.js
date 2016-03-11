import chai from "chai";
import getLogger from '../src/index.js';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.should();
chai.use(sinonChai);

describe('logger', () => {
  describe('with no parameters', () => {
    it('only configures a console logger', () => {
      const myLogger = getLogger();
      Object.keys(myLogger.transports).length.should.equal(1);
      Object.keys(myLogger.transports).should.eql(['console']);
    });
  });

  describe('with an environment', () => {
    var myLogger;

    before(() => {
      myLogger = getLogger('TEST', 'production', 'TOKEN', 'SUBDOMAIN');
    });

    describe('with production', () => {
      it('only configures a loggly logger', () => {
	Object.keys(myLogger.transports).length.should.equal(1);
	Object.keys(myLogger.transports).should.eql(['loggly']);
      });

      it('has the right token', () => {
	myLogger.transports.loggly.client.token.should.equal('TOKEN');
      });

      it('has the right subdomain', () => {
	myLogger.transports.loggly.client.subdomain.should.equal('SUBDOMAIN');
      });
    });
  });
});

