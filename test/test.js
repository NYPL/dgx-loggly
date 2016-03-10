import chai from "chai";
import getLogger from '../src/index.js';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.should();
chai.use(sinonChai);

describe('logger', () => {
    it('works', () => {
	var myLogger = getLogger();
//	var myLogger = lgr.getLogger();

	var sp = sinon.stub(myLogger, "log");
	myLogger.log('debug', 'TEST');
	sp.should.have.been.calledWith('debug', 'TEST');
    });
});
