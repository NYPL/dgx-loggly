import chai from "chai";
import getLogger from '../src/index.js';

chai.should();

/** @test {getLogger} */
describe('getLogger', () => {
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

  describe('with configuration defaults', () => {
    describe('when not overriden', () => {

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
      
      describe('console', () => {
        it('has the defaults', () => {
          myLogger.transports.console.json.should.equal(false);
        });
      });

      describe('loggly', () => {
        it('has the defaults', () => {
          // winston-loggly accepts false, but node-loggly makes it null
	  (myLogger.transports.loggly.client.json === null).should.equal(true);
        });
      });
    });

    describe('when overriden', () => {
      describe('by general options', () => {

        var myLogger;
	before(() => {
 	  myLogger = getLogger({
	    env: 'qa',
	    appTag: 'TEST',
	    token: 'TOKEN',
	    subdomain: 'SUBDOMAIN',
	    remote: true,
            json: true,
	  });
	});

        describe('console', () => {
          it('has the general override', () => {
            myLogger.transports.console.json.should.equal(true);
          });
        });

        describe('loggly', () => {
          it('has the general override', () => {
            myLogger.transports.loggly.client.json.should.equal(true);
          });
        });
      });

      describe('by console specific options', () => {
        
        var myLogger;
	before(() => {
 	  myLogger = getLogger({
	    env: 'qa',
	    appTag: 'TEST',
	    token: 'TOKEN',
	    subdomain: 'SUBDOMAIN',
	    remote: true,
            console: { json: true, },
	  });
	});

        describe('console', () => {
          it('has the specific override', () => {
            myLogger.transports.console.json.should.equal(true);
          });
        });

        describe('loggly', () => {
          it('has the default', () => {
            // winston-loggly accepts false, but node-loggly makes it null
            (myLogger.transports.loggly.client.json === null).should.equal(true);
          });
        });
      });

      describe('by loggly specific options', () => {

        var myLogger;
	before(() => {
 	  myLogger = getLogger({
	    env: 'qa',
	    appTag: 'TEST',
	    token: 'TOKEN',
	    subdomain: 'SUBDOMAIN',
	    remote: true,
            loggly: { json: true, },
	  });
	});

        describe('console', () => {
          it('has the default', () => {
            myLogger.transports.console.json.should.equal(false);
          });
        });

        describe('loggly', () => {
          it('has the specific override', () => {
            myLogger.transports.loggly.client.json.should.equal(true);
          });
        });
      });
    });
  });
});
