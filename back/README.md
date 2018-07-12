# Backend

### Prerequisites
- The JavaScript runtime, [NodeJS](https://nodejs.org/en/).
- A package manager, I prefer [NPM](https://www.npmjs.com/) but [Yarn](https://yarnpkg.com/lang/en/) is OK too.
- There are [AWS](https://aws.amazon.com/) services used, you will need an AWS account, and two [AWS S3 (Simple Storage Service)](https://aws.amazon.com/s3/?nc1=h_ls) Buckets, one with the name ```'ingeinsta-dev'``` to run the app and another with the name ```ingeinsta-test``` to run the tests.

### Installing
- Run ```npm install```
- Create a file in this directory called ```config.js```. In this file you will set the MongoDB URIs and the AWS S3 Buckets:
    ```javascript
    let config = {
      db: {}
    }
    
    if (process.env.DEV) {
      config.db.uri = 'your-mongodb-development-uri'
      config.awsBucket = 'ingeinsta-dev'
    } else if (process.env.TEST) {
      config.db.uri = 'your-mongodb-test-uri'
      config.awsBucket = 'ingeinsta-test'
    } 
    
    module.exports = config
  ```
  
  
- Create a file in this directory called ```awsConfig.json```. In this file you will load your AWS credentials:
  ```javascript
  {   
      "accessKeyId": "YOUR_ACCESS_KEY_ID",
      "secretAccessKey": "YOUR_SECRET_ACCESS_KEY",
      "region": "YOUR_REGION"
  }
  ```
  
### Running the app
Run ```npm start```, the app then should be running on port ```3000```.

### Testing
Tests are set in the subdirectory ```test/```. To execute the tests go to this subdirectory and run ```npm run test```.
