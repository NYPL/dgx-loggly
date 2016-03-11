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
});

