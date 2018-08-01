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
    'hashingSecret' : 'thisIsASecret',
};

// Production environment
environments.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'production',
    'hashingSecret' : 'thisIsAlsoASecret',
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
