const config = require('./../config')
const MongoCLient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const eachLimit = require('async/eachLimit')

const TypesLogic = require('./types')

/**
 * Finds all the points
 * @returns {Promise <Object>} A promise that resolves with all the points
*/
exports.findAllPoints = () => {
  return new Promise((resolve, reject) => {
    MongoCLient.connect(config.db.uri,
      (err, client) => {
        if (err) reject(err)
        else {
          let Points = client.db().collection('points')
          Points.find({})
          .toArray(
          (err, points) => {
            if (err) reject(err)
            else resolve(points)
            client.close()
          })
        }
      }
    )
  })
}

/**
 * Inserts a point
 * @param description description of the point
 * @param typeId Identifier of the type of the point
 * @param lat latitude of the point
 * @param lng longitude of the point
 * @param information information of the point
 * @param information.images array of buffer
 * @returns {Promise <Object, Err>} a promise that resolves if inserted or rejects otherwise
*/
exports.insertPoint = (description, typeId, lat, lng, information) => {
  let date = new Date().getTime()

  return new Promise((resolve, reject) => {
    if (!description || typeof description !== 'string') reject(new Error('El punto debe tener una descripción válida'))
    else if (!typeId || typeof typeId !== 'string') reject(new Error('El punto debe tener un tipo válido'))
    else if (!lat || typeof lat !== 'number') reject(new Error('El punto debe tener una latitud válida'))
    else if (!lng || typeof lng !== 'number') reject(new Error('El punto debe tener una longitud válida'))
    else if (!information || typeof information !== 'object') reject(new Error('El punto debe tener información asociada válida'))
    else if (!information.images || typeof information.images !== 'object') reject(new Error('EL punto debe tener imágenes válidas'))
    else if (!information.images[0]) reject(new Error('El punto debe tener al menos una imagen asociada'))
    else if (information.images.filter((image, i) => {
      return !image.buffer || !image.extension
    }).length > 0) reject(new Error('Error en las imágenes, deben todas tener su buffer asociado y la extensión especificada'))
    else if (information.images.length >= 15) reject(new Error('El número de imáges máximo que puede tener un punto es de 15.'))
    else {
      TypesLogic.findTypeById(typeId)
      .then(type => {
        if (!type) reject(new Error('El tipo no existe'))
        else {
          MongoCLient.connect(config.db.uri, (err, client) => {
            if (err) {
              reject(err)
              client.close()
            } else {
              let Points = client.db().collection('points')
              let point = {
                description: description,
                type: typeId,
                lat: lat,
                lng: lng,
                date: date
              }
              Points.insertOne(point, (err, res) => {
                if (err) {
                  reject(err)
                  client.close()
                } else {
                  let insertedId = res.insertedId

                  let images = []
                  information.images.forEach((image, index) => {
                    images.push({
                      index: index,
                      date: date,
                      extension: image.extension
                    })
                    image.index = index
                  })
                  let PointInformation = client.db().collection('pointInformation')
                  let pointInformation = {
                    _id: ObjectId(insertedId),
                    images: images
                  }
                  PointInformation.insertOne(pointInformation, (err) => {
                    if (err) {
                      reject(err)
                      client.close()
                    } else {
                      eachLimit(information.images, 1, (image, cb) => {
                        s3.putObject({
                          Bucket: config.awsBucket,
                          Key: String(insertedId + '-' + image.index + '.' + image.extension),
                          Body: image.buffer,
                          ACL: 'public-read'
                        }, (err, data) => {
                          if (err) throw err
                          else cb()
                        })
                      }, (err) => {
                        if (err) reject(err)
                        else resolve()
                        client.close()
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}
