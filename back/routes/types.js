var express = require('express')
var router = express.Router()

router.get('/', (req, res, next) => {
  let types = [{
    id: 0,
    name: 'Pavimento'
  }, {
    id: 1,
    name: 'Agua'
  }]
  res.send(types)
})

module.exports = router
