# Angular Starter Pack

- Typescript
- Angular 4
- Angular Material Design + Flex-Layout + SCSS
- NgX Translate
- Node.js + Express (body-parser, helmet, express-session/cookie-session, cookie-parser, connect-flash, compression)
- GraphQL + Express-GraphQL
- Passport + Passport-Local + Passport-JWT + Bcrypt
- Agenda
- Mongodb + Mongoose + Bluebird
- Gulp + Webpack2
- Protractor, Karma, Mocha, Chai, Sinon, Istanbul/NYC
- TSLint, ESLint

### Start

```
# install dependencies
npm install
```
```
# clean dist dir, start dev build, start backend server
# use browser-sync to load webpage in Firefox browser
npm run all:build_dev_deploy_local
```
```
# clean dist dir and start prod build
npm run all:build_prod
```
```
# unit testing for backend app with coverage report
npm run backend:test-coverage
```
```
# e2e testing for backend app
npm run backend:e2e
```
```
# testing for frontend angular app with coverage report
npm run frontend:test
```

### License

MIT