/* global before after describe it */
// https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

const assert = chai.assert
chai.should()

const config = require('./../config')
const MongoCLient = require('mongodb').MongoClient

const pointsLogic = require('./../logic/points')

let typeA

before(function (done) {
  MongoCLient.connect(config.db.uri, (err, client) => {
    if (err) throw err
    let types = [{
      name: 'A'
    }, {
      name: 'B'
    }]

    let Types = client.db().collection('types')
    Types.insertMany(types, (err, res) => {
      if (err) throw err
      else {
        typeA = res.ops[0]
        done()
      }
    })
  })
})

describe('Points logic module', function () {
  describe('getPoints', function () {
    it('should get all the points', function () {
      assert.equal(1, 1)
    })
  })

  describe('insertPoint', function () {
    it('should fail because point description is not valid', function (done) {
      pointsLogic.insertPoint().should.be.rejectedWith('El punto debe tener una descripción válida')
      pointsLogic.insertPoint(242).should.be.rejectedWith('El punto debe tener una descripción válida')
      pointsLogic.insertPoint('description').should.not.be.rejectedWith('El punto debe tener una descripción válida')
      done()
    })

    it('should fail because point typeId is not valid', function (done) {
      pointsLogic.insertPoint('description').should.be.rejectedWith('El punto debe tener un tipo válido')
      pointsLogic.insertPoint('description', 'sfsfsa2').should.be.rejectedWith('El punto debe tener un tipo válido')
      pointsLogic.insertPoint('description', typeA._id).should.not.be.rejectedWith('El punto debe tener un tipo válido')
      done()
    })

    it('should fail because point lat or lng are not valid', function (done) {
      pointsLogic.insertPoint('description', typeA._id).should.be.rejectedWith('El punto debe tener una latitud válida')
      pointsLogic.insertPoint('description', typeA._id, '71.85').should.be.rejectedWith('El punto debe tener una latitud válida')
      pointsLogic.insertPoint('description', typeA._id, 71.85).should.not.be.rejectedWith('El punto debe tener una latitud válida')
      pointsLogic.insertPoint('description', typeA._id, 71.85).should.be.rejectedWith('El punto debe tener una longitud válida')
      pointsLogic.insertPoint('description', typeA._id, 71.85, '49.74').should.be.rejectedWith('El punto debe tener una longitud válida')
      pointsLogic.insertPoint('description', typeA._id, 71.85, 49.74).should.not.be.rejectedWith('El punto debe tener una longitud válida')

      done()
    })

    it('should fail because point information is not valid', function (done) {
      pointsLogic.insertPoint('description', typeA._id, 71.85, 49.74).should.be.rejectedWith('El punto debe tener información asociada válida')
      pointsLogic.insertPoint('description', typeA._id, 71.85, 49.74, {}).should.not.be.rejectedWith('El punto debe tener información asociada válida')
      done()
    })

    // it('should fail because point information images are not valid', function (done) {
    //   pointsLogic.insertPoint('description', typeA._id, 71.85, 49.74, {images: []}).should.be.rejectedWith('El punto debe tener al menos una imagen asociada')
    //   pointsLogic.insertPoint('description', typeA._id, 71.85, 49.74, {images: [{buffer: Buffer.from('a'), extension: 'jpg'}]}).should.not.be.rejectedWith('Error en las imágenes, deben todas tener su buffer asociado y la extensión especificada')
    //   done()
    // })
  })

  after(function (done) {
    MongoCLient.connect(config.db.uri, (err, client) => {
      if (err) throw err

      let Types = client.db().collection('types')
      Types.drop({}, (err, res) => {
        if (err) throw err
        else done()
      })
    })
  })
})
