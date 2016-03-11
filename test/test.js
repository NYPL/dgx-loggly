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
    describe('with production', () => {
      var myLogger;
      before(() => {
	myLogger = getLogger({
	  env: 'production',
	  appTag: 'TEST',
	  token: 'TOKEN',
	  subdomain: 'SUBDOMAIN',
	});
      });

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

      it('has the right tag', () => {
	myLogger.transports.loggly.client.tags.should.include('TEST');
      });

    });

    describe('with qa', () => {
      describe('without the remote option', () => {
	
	var myLogger;
	before(() => {
	  myLogger = getLogger({
	    env: 'qa',
	    appTag: 'TEST',
	    token: 'TOKEN',
	    subdomain: 'SUBDOMAIN',
	  });
	});
	
	it('only configures a console logger', () => {
	  Object.keys(myLogger.transports).length.should.equal(1);
	  Object.keys(myLogger.transports).should.eql(['console']);
	});
      });

      describe('with the remote option', () => {
	var myLogger;

	before(() => {
	  myLogger = getLogger({
	    env: 'qa',
	    appTag: 'TEST',
	    token: 'TOKEN',
	    subdomain: 'SUBDOMAIN',
	    remote: true,
	  });
	});

	it('configures console and loggly loggers', () => {
	  Object.keys(myLogger.transports).length.should.equal(2);
	  Object.keys(myLogger.transports)
	    .should.have.members(['console', 'loggly']);
	});

	it('env tags', () => {
	  myLogger.transports.loggly.client.tags.should.include('TEST-qa');
	});
      });
    });
  });
});
