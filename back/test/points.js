/* global before describe it */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

const assert = chai.assert
const should = chai.should()

// const config = require('./../config')
// const MongoCLient = require('mongodb').MongoClient

const pointsLogic = require('./../logic/points')

before(function () {
  // process.on('unhandledRejection', () => {})
//   MongoCLient.connect(config.db.uri, (err, client) => {

//   })
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
      pointsLogic.insertPoint('description', 2).should.be.rejectedWith('El punto debe tener un tipo válido')
      pointsLogic.insertPoint('description', 'typeId').should.not.be.rejectedWith('El punto debe tener un tipo válido')
      done()
    })

    it('should fail because point lat or lng are not valid', function (done) {
      pointsLogic.insertPoint('description', 'type').should.be.rejectedWith('El punto debe tener una latitud válida')
      pointsLogic.insertPoint('description', 'type', '71.85').should.be.rejectedWith('El punto debe tener una latitud válida')
      pointsLogic.insertPoint('description', 'type', 71.85).should.not.be.rejectedWith('El punto debe tener una latitud válida')
      pointsLogic.insertPoint('description', 'type', 71.85).should.be.rejectedWith('El punto debe tener una longitud válida')
      pointsLogic.insertPoint('description', 'type', 71.85, '49.74').should.be.rejectedWith('El punto debe tener una longitud válida')
      pointsLogic.insertPoint('description', 'type', 71.85, 49.74).should.not.be.rejectedWith('El punto debe tener una longitud válida')

      done()
    })

    it('should fail because point information is not valid', function (done) {
      pointsLogic.insertPoint('description', 'type', 71.85, 49.74).should.be.rejectedWith('El punto debe tener información asociada válida')
      pointsLogic.insertPoint('description', 'type', 71.85, 49.74, {}).should.not.be.rejectedWith('El punto debe tener información asociada válida')
      done()
    })
  })
})
