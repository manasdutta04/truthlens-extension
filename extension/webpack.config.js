const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    mode: isProduction ? 'production' : 'development',
    entry: {
      popup: './src/popup.tsx',
      background: './src/background.ts',
      contentScript: './src/contentScript.ts',
      settings: './src/settings.tsx',
      utils: './src/utils/config.ts',
      exportConfig: './src/utils/export-config.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
      }),
      new HtmlWebpackPlugin({
        template: './public/popup.html',
        filename: 'popup.html',
        chunks: ['popup'],
      }),
      new HtmlWebpackPlugin({
        template: './public/settings.html',
        filename: 'settings.html',
        chunks: ['settings'],
      }),
      new HtmlWebpackPlugin({
        template: './src/debug.html',
        filename: 'debug.html',
        chunks: ['exportConfig'],
        inject: true
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'public/manifest.json' },
          { from: 'public/icon*.png' },
          { from: 'src/utils/simple-config.js', to: 'utils/config.js' },
          { 
            from: 'src/utils/config.ts', 
            to: 'utils/config.ts',
            transform: (content) => {
              return content
                .toString()
                .replace(/export default/g, 'window.config =')
                .concat('\nexport default window.config;');
            }
          }
        ],
      }),
    ],
    devtool: isProduction ? false : 'source-map'
  };
}; 