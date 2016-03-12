# DGX Loggly

Conveniently create a Winston logger with one of a few configurations for different environments, for logging to the console or to Loggly.

## Usage

The default configuration logs to the console for development:

    import getLogger from 'dgx-loggly';

	const logger = getLogger();

Loggly options can be provided to set up logging for production:

    # With Loggly options for production
	const logger = getLogger({
	  env: 'production',
	  appTag: 'DGX-App',
	  token: 'TOKEN',
	  subdomain: 'SUBDOMAIN',
	});

Other environments can be configured to send messages to Loggly with the
`remote: true` option. The environment name will be added to the tag
(e.g. `DGX-App-qa`):

    # Or other environments 
	const logger = getLogger({
	  env: 'qa',
	  appTag: 'DGX-App',
	  token: 'TOKEN',
	  subdomain: 'SUBDOMAIN',
	  remote: true,
    });

Any Loggly options can passed. See
[winston-loggly](https://github.com/winstonjs/winston-loggly) for the full list.

`getLogger` returns a [winston](https://github.com/winstonjs/winston) object, configured according to the environment and options, to be used as normal:

	logger.debug('What just happened?');

See [winston](https://github.com/winstonjs/winston) documentation for more.
