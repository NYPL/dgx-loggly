import Winston from 'winston';
import 'winston-loggly';
import morgan from 'morgan';

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
 * @param {Object} opts
 * @return {string[]} Array consisting of the environment-enhanced tag. If
 * `env` or `appTag` is not set, an empty array.
 */
function envTag(opts) {
  const { env, appTag } = opts;
  if (env && appTag) {
    if (env !== 'production') {
      return [appTag + '-' + env];
    }

    return [appTag];
  }

  return [];
}

/**
 * Merge `opts.appTag` with array of other tags in `opts.tags` if it
 * exists. Otherwise return an array of just `opts.appTag` to be passed
 * to a Loggly transport.
 * @param {Object} opts
 * @return {string[]} Array of tags for Loggly use.
 */
function mergeTags(opts) {
  const { tags } = opts;
  if (Array.isArray(tags)) {
    return [].concat(tags, envTag(opts));
  }

  return envTag(opts);
}

/**
 * Create a Loggly transport
 * @param {Object} opts
 * @return {Object}
 */
function logglyConfig(opts) {
  return new Winston.transports.Loggly(
    Object.assign(
      {},
      defaults.loggly,
      opts,
      opts.loggly,
      { tags: mergeTags(opts) }
    )
  );
}

/**
 * Create a Console transport
 * @param {Object} opts
 * @return {Object}
 */
function consoleConfig(opts) {
  return new Winston.transports.Console(
    Object.assign({}, defaults.console, opts, opts.console)
  );
}

/**
 * Configure and return console and Loggly transports based on environment and
 * other options.
 * @param {Object} opts
 * @return {Object[]} Array of transports
 */
function getTransports(opts) {
  const { env, remote } = opts;
  if (env) {
    // Production apps should only use loggly
    if (env === 'production') {
      return [logglyConfig(opts)];
    }

    // If it isn't production but the `remote` flag is set
    // send to loggly and console
    if (remote) {
      return [consoleConfig(opts), logglyConfig(opts)];
    }
  }

  // Otherwise, just log to the console
  return [consoleConfig(opts)];
}


/**
 * Get a Winston logger, configured to log to console or Loggly depending on
 * environment and options. If no `opts` is given or it it empty, logger
 * will be configured for console logging of `debug` level messages.
 *
 * @param {Object} [opts={}] Options hash.
 * @param {string} opts.env Running app environment. If present, one of
 *   "development", "qa", or "production." If there is no environment set,
 *   logging will be to console irrespective of other setting. If the
 *   environment is "production" only Loggly will be configured.
 * @param {boolean} opts.remote If true, log "qa" and "development"
 *    environments to Loggly.
 * @param {string} opts.appTag (Loggly only) Main tag for Loggly messages. If
 *   the environment is "qa" or "development", the environment is appended to
 *   the tag with a hyphen (e.g. "MyApp-qa"). Additional tags may be specified
 *   via the `tags` parameter.
 * @param {string} opts.token (Loggly only) Token required for connecting to
 *   Loggly
 * @param {string} opts.subdomain (Loggly only) Subdomain required for
 *   connecting to Loggly.
 * @param {Object} opts.console (Console only) Console transport specific
 *   overrides
 * @param {Object} opts.loggly (Loggly only) Loggly transport specific
 *   overrides
 * @return {Object} A Winston logger object.
 */
function getLogger(opts = {}) {
  return new Winston.Logger({transports: getTransports(opts)});
}

/**
 * Set up default Morgan logging.
 *
 * @param {Object} logger Winston logger object for transport
 */
function initMorgan(logger) {
  return morgan('combined', {
    stream: {
      write: (message, encoding) => {
	logger.error(message);
      }
    },
    skip: (req, res) => {
      return res.statusCode < 400;
    }
  });
}

export { getLogger, initMorgan };
