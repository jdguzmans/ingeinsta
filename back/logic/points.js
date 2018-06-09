const config = require('./../config')
const MongoCLient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const eachLimit = require('async/eachLimit')

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
          let Points = client.db(config.db.name).collection('points')
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
 * @param type type of the point
 * @param lat latitude of the point
 * @param lng longitude of the point
 * @param information information of the point
 * @param information.images array of buffer
 * @returns {Promise <Object, Err>} a promise that resolves if inserted or rejects otherwise
*/
exports.insertPoint = (description, type, lat, lng, information) => {
  let date = new Date().getTime()

  return new Promise((resolve, reject) => {
    if (!description) reject(new Error('El punto debe tener una descripción'))
    else if (!type) reject(new Error('El punto debe tener un tipo'))
    else if (!lat) reject(new Error('El punto debe tener una latitud'))
    else if (!lng) reject(new Error('El punto debe tener una longitud'))
    else if (!information) reject(new Error('El punto debe tener información asociada'))
    else if (!information.images || !information.images[0]) reject(new Error('El punto debe tener al menos una imagen asociada'))
    else if (information.images.filter(image => {
      return !image.buffer || !image.extension
    }).length > 0) reject(new Error('Imágenes no válidas'))
    else {
      MongoCLient.connect(
        config.db.uri,
        (err, client) => {
          if (err) reject(err)
          else {
            let Types = client.db(config.db.name).collection('types')
            Types.findOne({_id: ObjectId(type)},
            (err, res) => {
              if (err) {
                reject(err)
                client.close()
              } else if (!res) {
                reject(new Error('Tipo inválido'))
                client.close()
              } else {
                let Points = client.db(config.db.name).collection('points')
                Points.insertOne({
                  description: description,
                  type: type,
                  lat: lat,
                  lng: lng,
                  date: date
                }, (err, res) => {
                  if (err) {
                    client.close()
                    reject(err)
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
                    let PointInformation = client.db(config.db.name).collection('pointInformation')
                    PointInformation.insertOne({
                      _id: ObjectId(insertedId),
                      images: images
                    }, (err) => {
                      if (err) reject(err)
                      else {
                        eachLimit(information.images, 1,
                        (image, cb) => {
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
                        })
                      }
                      client.close()
                    })
                  }
                })
              }
            })
          }
        }
      )
    }
  })
}

// mock()

// function mock () {
//   const fs = require('fs')
//   let points = [{
//     lat: 4.6837668,
//     lng: -74.0524933,
//     type: '5b0f6852cf2d6c3d6e8e9049',
//     description: 'Hueco en la 100 con 19',
//     information: {
//       images: [{
//         buffer: fs.readFileSync('/home/jdguzmans/Downloads/ivan0.jpeg'),
//         extension: 'jpeg'
//       }, {
//         buffer: fs.readFileSync('/home/jdguzmans/Downloads/ivan1.jpg'),
//         extension: 'jpg'
//       }]
//     }
//   }, {
//     lat: 4.697668,
//     lng: -74.0624933,
//     type: '5b0f6852cf2d6c3d6e8e904a',
//     description: 'Semáforo',
//     information: {
//       images: [{
//         buffer: fs.readFileSync('/home/jdguzmans/Downloads/alvaro0.jpg'),
//         extension: 'jpg'
//       }, {
//         buffer: fs.readFileSync('/home/jdguzmans/Downloads/alvaro1.jpg'),
//         extension: 'jpg'
//       }, {
//         buffer: fs.readFileSync('/home/jdguzmans/Downloads/alvaro2.jpg'),
//         extension: 'jpg'
//       }]
//     }
//   }]

//   exports.insertPoint(points[0].description, points[0].type, points[0].lat, points[0].lng, points[0].information)
//   .then(() => {
//     exports.insertPoint(points[1].description, points[1].type, points[1].lat, points[1].lng, points[1].information)
//   })
//   .then(() => {
//     console.log('coronamos')
//   })
//   .catch(e => {
//     console.log('paila')
//     console.log(e)
//   })
// }
