module.exports = {
  entry: {
    //开发入口js
    // main1: './src/scripts/main.js'
    main2: './src/scripts/main2.js'
  }
  ,output: {
    path: __dirname+'/dist/scripts/',
    filename: '[name].js'
  }
  ,resolve: {

  }
 , module: {
    loaders: [
      // { test: /\.jsx?$/, loaders: ['jsx?harmony']}
      {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel',
          query: {
              presets: ['es2015']
          }

      }
     , { test: /\.css$/, loader: 'style-loader!css-loader' }
      ,{test: /\.(png|jpg)$/, loader: 'url-loader'} // 内
    ]
  }

  ,externals: {

  }

};