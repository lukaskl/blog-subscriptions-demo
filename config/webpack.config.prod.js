const webpack = require('webpack');
const path = require('path');
const paths = require('./paths');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('./plugins/dotenv-webpack');
const TreatWarningsAsErrors = require('./plugins/treat-warnings-as-errors');

process.env.NODE_ENV = 'production';

module.exports = {
  entry: [
    './src/index.ts'
  ],
  output: {
    path: path.join(__dirname, '../build/prod/'),
    filename: 'server.js'
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ['node_modules', paths.appNodeModules, paths.appSrc].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      //  process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    extensions: ['.js', '.json', '.ts'],
    alias: {
      '~': paths.appSrc,
    }
  },
  //devtool: 'source-map',
  target: 'node',
  devtool: 'source-map',
  //TODO: In the docker container, during the start add check whether there are node_modules folder and if not -> install 
  externals: [nodeExternals()],
  module: {
    rules: [
      // {
      //   test: /\.(ts|tsx)$/,
      //   enforce: 'pre',
      //   loader: require.resolve('tslint-loader'),
      //   include: paths.appSrc,
      //   options: {
      //     configFile: 'tslint.json',
      //     formatter: 'stylish'
      //   }
      // },
      {
        oneOf: [
          {
            test: /\.(js|ts)$/,
            include: paths.appSrc,
            use: [require.resolve('awesome-typescript-loader')],
          },
          {
            test: /\.(gql|graphql)$/,
            include: paths.appSrc,
            use: 'raw-loader',
          }
        ]
      }
    ]
  },
  plugins: [
    new Dotenv({
      systemvars: true,
    }),
    new TreatWarningsAsErrors(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        "BUILD_TARGET": JSON.stringify('server')
      }
    }),
  ]
}