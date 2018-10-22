const express = require('express')
const router = express.Router()

const typesLogic = require('./../logic/types')

router.get('/', async (req, res, next) => {
  try {
    const types = await typesLogic.findAllTypes()
    res.send(types)
  } catch (e) {
    res.sendStatus(400)
  }
})

module.exports = router
