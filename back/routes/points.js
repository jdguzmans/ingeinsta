const express = require('express')
const router = express.Router()

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const pointsLogic = require('./../logic/points')
const pointInformationLogic = require('./../logic/pointInformation')

router.get('/', async (req, res, next) => {
  try {
    const points = await pointsLogic.findAllPoints()
    res.send(points)
  } catch (e) {
    res.sendStatus(400)
  }
})

router.get('/:pointId/information', async (req, res, next) => {
  try {
    const { params: { pointId } } = req

    const point = await pointInformationLogic.findPointInformationById(pointId)
    res.send(point)
  } catch (e) {
    res.sendStatus(400)
  }
})

router.post('/', upload.any(), async (req, res, next) => {
  try {
    const { body: { description, type, lat, lng } } = req

    const latNumber = Number(lat)
    const lngNumber = Number(lng)

    const information = {
      images: []
    }

    const files = req.files
    files.forEach(file => {
      const { originalname } = file
      const parts = originalname.split('.')
      const extension = parts[parts.length - 1]
      information.images.push({
        buffer: file.buffer,
        extension: extension
      })
    })

    const insertedPoint = await pointsLogic.insertPoint(description, type, latNumber, lngNumber, information)
    res.send(insertedPoint)
  } catch (e) {
    res.sendStatus(400)
  }
})

module.exports = router
