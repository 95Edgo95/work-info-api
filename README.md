# Work Info API

API was written with nodeJs express framework.
https://expressjs.com/

For authentication JWT tokens were used and were implemented with passport authentication middleware and passport JWT strategy.
https://www.npmjs.com/package/jsonwebtoken
http://www.passportjs.org/
https://www.npmjs.com/package/passport-jwt

For request validation express validator were used, which is using validator.js functions.
https://express-validator.github.io
https://github.com/chriso/validator.js

To limit request from same IP express rate limit were used.
https://www.npmjs.com/package/express-rate-limit

To make API a bit more secure helmet were used, which is adding some useful headers.
https://helmetjs.github.io/

To protect API from csrf attacks csurf were used.
https://www.npmjs.com/package/csurf

To protect API from external requests cors were used.
https://www.npmjs.com/package/cors

To make API more bugless and understandable TypeScript were used, which is a JavaScript superset and making possible to do write JavaScript with type definitions.
https://www.typescriptlang.org/

To write test chai library were used.
https://www.chaijs.com/

To keep code consistent tslint static analysis tool were used.
https://palantir.github.io/tslint/

To run project locally clone it from github
Run "npm i" to install dependencies
Run "npm run compile" to compile TypeScript
Run "npm run seed:dev" to fill data in public api
Run "npm run start:dev" to run local node server

Run "npm test" to run tests
Before running tests run "npm run seed:dev" as data may be modified at public api and cause tests to fail
