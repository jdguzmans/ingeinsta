
const MongoCLient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID

const { MONGODB_URI } = require('./../config')

/**
 * Finds the information of a point
 * @param pointId the identifier of the point the information is wanted
 * @returns {Promise <Object>} A promise that resolves with the point information or rejects if it does not exist
*/
exports.findPointInformationById = (pointId) => {
  return new Promise((resolve, reject) => {
    MongoCLient.connect(MONGODB_URI, (err, client) => {
      if (err) reject(err)
      else {
        let Points = client.db().collection('pointInformation')
        Points.findOne({_id: new ObjectId(pointId)}, (err, res) => {
          if (err) reject(err)
          else if (!res) reject(new Error('No existe un punto con ese identificador.'))
          else resolve(res)
          client.close()
        })
      }
    })
  })
}
