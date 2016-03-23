/* global before it describe */
import chai from 'chai';
import { getLogger, initMorgan } from '../src/index.js';

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
      let myLogger;
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

      describe('without all the necessary options', () => {
	describe('like missing the token', () => {
	  it('should not raise an error', () => {
	    (() => {
	      const myLogger = getLogger({
		env: 'qa',
		appTag: 'TEST',
		subdomain: 'SUBDOMAIN',
		remote: true,
	      });
	    }).should.not.throw(Error);
	  });
	});
      });
    });

    describe('with qa', () => {
      describe('without the remote option', () => {
        let myLogger;
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
	describe('with the proper options', () => {
          let myLogger;

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

	describe('without all the necessary options', () => {
	  describe('like missing the token', () => {
	    it('should raise an error', () => {
	      (() => {
		const myLogger = getLogger({
		  env: 'qa',
		  appTag: 'TEST',
		  subdomain: 'SUBDOMAIN',
		  remote: true,
		});
	      }).should.throw(/Loggly Customer token is required./);
	    });
	  });

	  describe('or missing the subdomain', () => {
	    it('should raise an error', () => {
	      (() => {
		const myLogger = getLogger({
		  env: 'qa',
		  appTag: 'TEST',
		  token: 'TOKEN',
		  remote: true,
		});
	      }).should.throw(/Loggly Subdomain is required/);
	    });
	  });
	});
      });
    });
  });

  describe('with configuration defaults', () => {
    describe('when not overriden', () => {
      let myLogger;
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
        let myLogger;
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
        let myLogger;
        before(() => {
          myLogger = getLogger({
            env: 'qa',
            appTag: 'TEST',
            token: 'TOKEN',
            subdomain: 'SUBDOMAIN',
            remote: true,
            console: { json: true },
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
        let myLogger;
        before(() => {
          myLogger = getLogger({
            env: 'qa',
            appTag: 'TEST',
            token: 'TOKEN',
            subdomain: 'SUBDOMAIN',
            remote: true,
            loggly: { json: true },
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
