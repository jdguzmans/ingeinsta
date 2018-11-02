const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fs = require('fs')
const cors = require('cors')

const app = express()

app.use(logger('dev'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const routes = fs.readdirSync('./routes')
routes.forEach(routeStr => {
  const routeName = routeStr.slice(0, -3)
  const route = require('./routes/' + routeName)
  app.use('/' + routeName, route)
})

module.exports = app
