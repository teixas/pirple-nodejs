'use strict';
/*
 * Create and export configuration variables
 *
 */

// Container for all environments
var environments = {};

// Staging (default) environment
environments.staging = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'staging',
    'hashingSecret' : 'thisIsASecret'
};
environments.staging.mailgun = {
    'apiKey': '5e1c759ef02be9a184674eb9d22f6d85-7efe8d73-4fef498e',
    'domain': 'sandbox433973840f7b46e1b4fd2afd323167ae.mailgun.org',
    'sender': 'pirple@sandbox433973840f7b46e1b4fd2afd323167ae.mailgun.org'
};

// Production environment
environments.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'production',
    'hashingSecret' : 'thisIsAlsoASecret'
};
environments.production.mailgun = {
    'apiKey': '5e1c759ef02be9a184674eb9d22f6d85-7efe8d73-4fef498e',
    'domain': 'sandbox433973840f7b46e1b4fd2afd323167ae.mailgun.org',
    'sender': 'pirple@sandbox433973840f7b46e1b4fd2afd323167ae.mailgun.org'
};

// Determine which environment was passed as a command-line argument
var node_env = process.env.NODE_ENV,
    currentEnvironment =
        typeof node_env  === 'string' ? node_env.toLowerCase() : '',

    // Check that the current environment is one of the environments above,
    // if not default to staging
    environmentToExport =
        environments[currentEnvironment] || environments.staging;

// Export the module
module.exports = environmentToExport;
