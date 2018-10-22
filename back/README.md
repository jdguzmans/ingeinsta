# Backend

### Prerequisites
- [NodeJS](https://nodejs.org/en/).
- A package manager, I prefer [NPM](https://www.npmjs.com/) but [Yarn](https://yarnpkg.com/lang/en/) is OK too.
- There are [AWS](https://aws.amazon.com/) services used, you will need an AWS account, and two [AWS S3 (Simple Storage Service)](https://aws.amazon.com/s3/?nc1=h_ls) Buckets, one with the name ```'ingeinsta-dev'``` to run the app and another with the name ```ingeinsta-test``` to run the tests.
- [Nodemon](https://nodemon.io/) to run the project in development mode.

### Installing
- Run ```npm install``` to install all dependencies.
- Create the required environment variables, see file ```config.js```
  ```

### Running the app
Run ```npm dev```, the app then should be running on port ```3000```.

### Testing
To execute the tests run ```npm run test```. Test files are set in the subdirectory ```test/```.
