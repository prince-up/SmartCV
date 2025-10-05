const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add alias for process
  config.resolve.alias = {
    ...config.resolve.alias,
    'process/browser': require.resolve('process/browser'),
    'process': require.resolve('process/browser'),
  };

  // Resolve fallbacks
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "http": false,
    "https": false,
    "zlib": false,
    "stream": false,
    "util": false,
    "url": false,
    "assert": false,
    "crypto": false,
    "buffer": require.resolve("buffer/"),
    "process/browser": require.resolve("process/browser"),
  };

  // Add resolve extensions
  config.resolve.extensions = [...(config.resolve.extensions || []), '.js', '.jsx', '.json'];
  
  // Ensure fullySpecified is false for .mjs files
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  });

  // Add plugins
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  );

  // Ignore warnings
  config.ignoreWarnings = [/Failed to parse source map/];

  return config;
};
