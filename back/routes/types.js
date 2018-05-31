const express = require('express')
const router = express.Router()

const typesLogic = require('./../logic/types')

router.get('/', (req, res, next) => {
  typesLogic.findAllTypes()
  .then(points => {
    res.send(points)
  })
})

module.exports = router
