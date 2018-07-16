/* global before after describe it */
// https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/
// INTENTAR EN VEZ DE HACER DROP IR BORRANDO DOCUMENTO POR DOCUMENTO

const AWS = require('aws-sdk')
AWS.config.loadFromPath('./awsConfig.json')
const s3 = new AWS.S3()

const eachLimit = require('async/eachLimit')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

chai.should()

const config = require('./../config')
const MongoCLient = require('mongodb').MongoClient

const pointsLogic = require('./../logic/points')

describe('Points logic module', function () {
  let types

  before(function (done) {
    MongoCLient.connect(config.db.uri, function (err, client) {
      if (err) throw err
      let t = [{
        name: 'A'
      }, {
        name: 'B'
      }]

      let Types = client.db().collection('types')
      Types.insertMany(t, function (err, res) {
        if (err) {
          client.close()
          throw err
        } else {
          types = res.ops
          client.close()
          done()
        }
      })
    })
  })

  after(function (done) {
    MongoCLient.connect(config.db.uri, function (err, client) {
      if (err) throw err

      let Types = client.db().collection('types')
      Types.drop({}, function (err, res) {
        if (err) {
          client.close()
          throw err
        } else {
          client.close()
          done()
        }
      })
    })
  })

  describe('insertPoint', function () {
    after(function (done) {
      MongoCLient.connect(config.db.uri, function (err, client) {
        if (err) throw err
        else {
          let Points = client.db().collection('points')
          Points.drop({}, function (err, res) {
            if (err) throw err
            else {
              let PointInformation = client.db().collection('pointInformation')
              PointInformation.drop({}, function (err, res) {
                if (err) throw err
                else {
                  s3.listObjects({Bucket: config.awsBucket}, function (err, data) {
                    let objects = data.Contents
                    if (err) throw err
                    else {
                      eachLimit(objects, 2, function (object, cb) {
                        s3.deleteObject({Bucket: config.awsBucket, Key: object.Key}, function (err) {
                          if (err) throw err
                          else cb()
                        })
                      }, function (err) {
                        if (err) throw err
                        else done()
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    })

    it('should fail because point description is not valid', function (done) {
      pointsLogic.insertPoint().should.be.rejectedWith('El punto debe tener una descripción válida')
      pointsLogic.insertPoint(242).should.be.rejectedWith('El punto debe tener una descripción válida')
      pointsLogic.insertPoint('description1').should.not.be.rejectedWith('El punto debe tener una descripción válida')
      done()
    })

    it('should fail because point typeId is not valid', function (done) {
      pointsLogic.insertPoint('description2').should.be.rejectedWith('El punto debe tener un tipo válido')
      pointsLogic.insertPoint('description3', 'sfsfsa2').should.be.rejectedWith('El punto debe tener un tipo válido')
      pointsLogic.insertPoint('description4', types[0]._id).should.not.be.rejectedWith('El punto debe tener un tipo válido')
      done()
    })

    it('should fail because point lat or lng are not valid', function (done) {
      pointsLogic.insertPoint('description5', types[0]._id).should.be.rejectedWith('El punto debe tener una latitud válida')
      pointsLogic.insertPoint('description6', types[0]._id, '71.85').should.be.rejectedWith('El punto debe tener una latitud válida')
      pointsLogic.insertPoint('description7', types[0]._id, 71.85).should.not.be.rejectedWith('El punto debe tener una latitud válida')
      pointsLogic.insertPoint('description8', types[0]._id, 71.85).should.be.rejectedWith('El punto debe tener una longitud válida')
      pointsLogic.insertPoint('description9', types[0]._id, 71.85, '49.74').should.be.rejectedWith('El punto debe tener una longitud válida')
      pointsLogic.insertPoint('description10', types[0]._id, 71.85, 49.74).should.not.be.rejectedWith('El punto debe tener una longitud válida')
      done()
    })

    it('should fail because point information is not valid', function (done) {
      pointsLogic.insertPoint('description11', types[0]._id, 71.85, 49.74).should.be.rejectedWith('El punto debe tener información asociada válida')
      pointsLogic.insertPoint('description12', types[0]._id, 71.85, 49.74, {}).should.not.be.rejectedWith('El punto debe tener información asociada válida')
      done()
    })

    it('should fail because point information images are not valid', function (done) {
      pointsLogic.insertPoint('description13', types[0]._id, 71.85, 49.74, {images: []}).should.be.rejectedWith('El punto debe tener al menos una imagen asociada')
      pointsLogic.insertPoint('description14', types[0]._id, 71.85, 49.74, {images: [{extension: 'jpg'}]}).should.be.rejectedWith('Error en las imágenes, deben todas tener su buffer asociado y la extensión especificada')
      pointsLogic.insertPoint('description15', types[0]._id, 71.85, 49.74, {images: [{buffer: Buffer.from('a')}]}).should.be.rejectedWith('Error en las imágenes, deben todas tener su buffer asociado y la extensión especificada')
      pointsLogic.insertPoint('description16', types[0]._id, 71.85, 49.74, {images: [{buffer: Buffer.from('a'), extension: 'jpg'}]}).should.not.be.rejectedWith('Error en las imágenes, deben todas tener su buffer asociado y la extensión especificada')
      done()
    })
  })

  // describe('getPoints', function () {
  //   let pointIds = []

  //   before(function (done) {
  //     return pointsLogic.insertPoint('description1', types[0]._id, 71.85, 49.74, {images: [{buffer: Buffer.from('a'), extension: 'jpg'}]})
  //     .then(function (id) {
  //       pointIds.push(id)
  //       return pointsLogic.insertPoint('description2', types[0]._id, 71.85, 49.74, {images: [{buffer: Buffer.from('a'), extension: 'jpg'}]})
  //     })
  //     .then(function (id) {
  //       pointIds.push(id)
  //       return pointsLogic.insertPoint('description3', types[0]._id, 71.85, 49.74, {images: [{buffer: Buffer.from('a'), extension: 'jpg'}]})
  //     })
  //     .then(function (id) {
  //       pointIds.push(id)
  //       done()
  //     })
  //   })

  //   after(function (done) {
  //     return deletePoints()
  //     .then(function () {
  //       done()
  //     })
  //   })

  //   it('should get all the points', function (done) {
  //     return pointsLogic.findAllPoints()
  //     .then(function (dbPoints) {
  //       dbPoints.length.should.equal(pointIds.length)
  //       done()
  //     })
  //   })
  // })
})
