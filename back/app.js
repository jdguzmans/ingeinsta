const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fs = require('fs')
const cors = require('cors')
const config = require('./config')
const mongoCLient = require('mongodb').MongoClient

const app = express()

app.use(logger('dev'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

mongoCLient.connect(
  'mongodb://' + config.db.user + ':' + config.db.password + '@' + config.db.url + ':' + config.db.port + '/' + config.db.name
  , (err, db) => {
    if (err) throw err
    else console.log('connected to DB server\n')
    db.close()
  }
)

let routes = fs.readdirSync('./routes')
routes.forEach(routeStr => {
  let routeName = routeStr.slice(0, -3)
  let route = require('./routes/' + routeName)
  app.use('/' + routeName, route)
  console.log('loaded route ' + routeName)
})

module.exports = app
