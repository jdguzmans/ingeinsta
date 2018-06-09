const config = require('./../config')
const MongoCLient = require('mongodb').MongoClient

// mock()

// function mock () {
//   let types = [{
//     name: 'Pavimento'
//   }, {
//     name: 'Espacio Público'
//   }]

//   MongoCLient.connect(config.db.uri,
//     (err, client) => {
//       if (err) throw err
//       else {
//         let Types = client.db(config.db.name).collection('types')
//         Types.insertMany(types,
//         (err) => {
//           if (err) throw err
//           else console.log('Database mock TYPES created')
//         })
//       }
//     }
//   )
// }

/**
 * Finds all the types
 * @returns {Promise <Object>} A promise that resolves with all the types
*/
exports.findAllTypes = () => {
  return new Promise((resolve, reject) => {
    MongoCLient.connect(config.db.uri,
      (err, client) => {
        if (err) reject(err)
        else {
          let Types = client.db(config.db.name).collection('types')
          Types.find({})
          .toArray(
          (err, types) => {
            if (err) reject(err)
            else resolve(types)
            client.close()
          })
        }
      }
    )
  })
}

/**
 * Inserts a type
 * @param type type to insert
 * @returns {Promise <Object, Err>} A promise that resolves if inserted or rejects otherwise
*/
exports.insertType = (name) => {
  return new Promise((resolve, reject) => {
    if (!name) reject(new Error('El tipo debe tener un nombre'))
    else {
      MongoCLient.connect(config.db.uri,
        (err, client) => {
          if (err) reject(err)
          else {
            let Types = client.db(config.db.name).collection('types')
            Types.insertOne({
              name: name
            }, (err) => {
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
