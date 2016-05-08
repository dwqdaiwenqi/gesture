



module.exports = {
  entry: {
    //开发入口js
    // main1: './src/scripts/main.js'
    main2: './src/scripts/main2.js'
  }
  ,output: {
    //开发js相对与这个目录
    path: __dirname+'/dist/scripts/',
    //生成合并的js
    //entry1.entry.js
    //entry2.entry.js
    filename: '[name].js'
  }
  ,resolve: {
    // 现在可以写 require('file') 代替 require('file.coffee')
    // extensions: ['', '.js', '.jsx', '.css','.png','.jpg'] 
    // ,alias: {
    //    //alias依旧相对于开发的js。。。
    //  // Dai: "http://localhost/default_web/js/Dai.js"
    //  Dai: "../../dist/scripts/Dai.js"
    // }
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
  //例如是cdn形式加载的全局
  ,externals: {
      // require("jquery") 是引用自外部模块的
      // 对应全局变量 jQuery
     // "_$": "Dai"
  }

};