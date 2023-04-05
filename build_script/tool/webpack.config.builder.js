const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');

module.exports = function ()
{
    return {
        mode: 'production',
        devtool: 'cheap-module-source-map',
        entry: {
            backend: path.join(__dirname, '..', '..', 'src', 'app', 'backend', 'backend.entry.ts'),
            main: path.join(__dirname, '..', '..', 'src', 'app', 'document', 'main', 'main.entry.ts'),
            content: path.join(__dirname, '..', '..', 'src', 'app', 'document', 'content', 'content.entry.ts'),
            popup: path.join(__dirname, '..', '..', 'src', 'app', 'document', 'popup', 'popup.entry.ts')
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        module: {
            rules: [
                {
                    test: /\.(tsx|ts)$/,
                    use: [{
                        loader: 'ts-loader',
                        options: {
                            configFile: path.join(__dirname, '..', 'config', 'tsconfig.json')
                        },
                    }],
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        },
                    }]
                }
            ],
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    {
                        from: path.join(__dirname, '..', '..', 'src', 'asset'),
                        to: path.join(__dirname, '..', '..', 'output', 'asset')
                    },
                    {
                        from: path.join(__dirname, '..', '..', 'src', 'app', 'manifest.json'),
                        to: path.join(__dirname, '..', '..', 'output')
                    }
                ]
            }),
            ...getHtmlPlugins([
                'popup',
            ])
        ],
        output: {
            path: path.join(__dirname, '..', '..', 'output','src'),
            filename: '[name].js'
        },
        optimization: {
            splitChunks: {
                chunks: 'all',
            }
        }
    }
};

function getHtmlPlugins(chunks) 
{
    return chunks.map(chunk => new HTMLPlugin({
        title: 'React Extension',
        filename: `${chunk}.html`,
        chunks: [chunk]
    }))
}
