import Winston from 'winston';
import 'winston-loggly';


const defaults = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
  loggly: {
    level: 'error',
    handleExceptions: true,
    json: false,
    stripColors: true,
  },
};

/**
 * Combine appTag with environment for non-production environments
 */
function envTag(opts) {
  const { env, appTag } = opts;
  if (env && appTag) {
    if (env !== 'production') {
      return [appTag + '-' + env];
    }

    return [appTag]
  }

  return [];
}

function mergeTags(opts) {
  const { tags, appTag } = opts;
  if (Array.isArray(tags)) {
    return [].concat(tags, envTag(opts));
  }

  return envTag(opts);
}
    
function logglyConfig(opts) {
  return new Winston.transports.Loggly(
    Object.assign({}, defaults.loggly, opts)
  );
}

function logglyOptions(opts) {
  return Object.assign(
    opts,
    { tags: mergeTags(opts) }
  );
}

function consoleConfig(opts) {
  return new Winston.transports.Console(
    Object.assign({}, defaults.console, opts.console)
  );
}

function getTransports(opts) {
  const { env, remote } = opts;
  if (env) {
    // Production apps should only use loggly
    if (env === 'production') {
      return [logglyConfig(logglyOptions(opts))];
    }

    // If it isn't production but the `remote` flag is set
    // send to loggly and console
    if (remote) {
      return [
	consoleConfig(opts),
	logglyConfig(logglyOptions(opts)),
      ];
    }
  }

  // Otherwise, just log to the console
  return [consoleConfig(opts)];
}

function getLogger(opts = {}) {
  const transports = getTransports(opts);
  return new Winston.Logger({transports: transports});
}

export default getLogger;
