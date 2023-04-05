const webpack = require('webpack');
const webpackConfigBuilder = require('./webpack.config.builder.js');

module.exports = function ()
{
    const config = webpackConfigBuilder();
    const compiler = webpack(config);

    compiler.run(function (_, stat) 
    {
        if (stat.compilation.errors.length > 0) 
        {
            console.log(stat.compilation.errors);
        }
    });
};
