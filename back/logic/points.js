const config = require('./../config')
const MongoCLient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID

// mock()

// function mock () {
//   let points = [{
//     lat: 4.6837668,
//     lng: -74.0524933,
//     type: ObjectId('5b0f6852cf2d6c3d6e8e9049'),
//     description: 'Hueco en la 100 con 19'
//   }, {
//     lat: 4.697668,
//     lng: -74.0624933,
//     type: ObjectId('5b0f6852cf2d6c3d6e8e904a'),
//     description: 'Semáforo'
//   }]

//   MongoCLient.connect(config.db.uri,
//     (err, client) => {
//       if (err) throw err
//       else {
//         let Points = client.db('ingenieria-visible').collection('points')
//         Points.insertMany(points,
//         (err) => {
//           if (err) throw err
//           else console.log('Database mock POINTS created')
//         })
//       }
//     }
//   )
// }

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
          let Points = client.db('ingenieria-visible').collection('points')
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
 * Finds the point by it's id
 * @param pointId the identifier (_id) of the point
 * @returns {Promise <Object>} A promise that resolves with the point searched or null if it does not exit
*/
exports.findPointById = (pointId) => {
  return findPointById(pointId)
}

function findPointById (pointId) {
  return new Promise((resolve, reject) => {
    MongoCLient.connect(config.db.uri,
      (err, client) => {
        if (err) reject(err)
        else {
          let Points = client.db('ingenieria-visible').collection('points')
          Points.findOne({_id: new ObjectId(pointId)},
          (err, res) => {
            if (err) reject(err)
            else if (!res) reject(new Error('No existe un punto con ese identificador.'))
            else resolve(res)
            client.close()
          })
        }
      }
    )
  })
}

/**
 * Inserts a point
 * @param point point to insert
 * @returns {Promise <Object, Err>} A promise that resolves if inserted or rejects otherwise
*/
exports.insertPoint = (description, type, lat, lng) => {
  return new Promise((resolve, reject) => {
    if (description) reject(new Error('El punto debe tener una descripción'))
    if (type) reject(new Error('El punto debe tener un typo'))
    if (lat) reject(new Error('El punto debe tener una latitud'))
    if (lng) reject(new Error('El punto debe tener una longitud'))
    else {
      MongoCLient.connect(
        config.db.uri,
        (err, client) => {
          if (err) reject(err)
          else {
            let Points = client.db('ingenieria-visible').collection('points')
            Points.insertOne({
              description: description,
              type: type,
              lat: lat,
              lng: lng
            },
            (err) => {
              if (err) reject(err)
              else resolve()
              client.close()
            })
          }
        }
      )
    }
  })
}
