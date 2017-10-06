const webpack = require('webpack'),
      webpackConfig = require('./webpack.config'),
      compiler = webpack(webpackConfig)

const express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),

      port = process.env.PORT || 3001

const api = require('./api')

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true
}))

app.use(require('webpack-hot-middleware')(compiler, {
  path: '/__webpack_hmr'
}))


app.use((req, res, next) => {
  console.log(req.method, req.url)
  next()
})

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/', api)

app.use((req, res, next) => {
  res.end('404 Error')
  next()
})

app.use((err, req, res, next) => {
  console.error(err)
  res.end('500 Error')
  next()
})

app.listen(port, () => console.log(`Server is running on port ${port}`))