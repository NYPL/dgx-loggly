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

function logglyConfig(opts) {
  return new Winston.transports.Loggly(
    Object.assign({}, defaults.loggly, opts)
  );
}

function logglyOptions(opts, tag, token, subdomain) {
  return Object.assign(
    opts,
    {
      inputToken: token,
      subdomain: subdomain,
      tags: [tag],
    }
  );
}

function consoleConfig(opts) {
  return new Winston.transports.Console(
    Object.assign({}, defaults.console, opts.console)
  );
}

function getTransports(tag, env, token, subdomain, opts) {
  const { remote } = opts;
  if (env) {
    // Production apps should only use loggly
    if (env === 'production') {
      return [logglyConfig(logglyOptions(opts, tag, token, subdomain))];
    }

    // If it isn;t production but the `remote` flag is set
    // send to loggly and console
    if (remote) {
      return [
	consoleConfig(opts),
      ];
    }
  }

  // Otherwise, just log to the console
  return [consoleConfig(opts)];
}

function getLogger(tag, env = null, token = null, subdomain = null, opts = {}) {
  const transports = getTransports(tag, env, token, subdomain, opts);
  return new Winston.Logger({transports: transports});
}

export default getLogger;
