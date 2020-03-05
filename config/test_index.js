// TODO: check this repository to enable sourcemaps-for both Development and mocha tests
// https://www.npmjs.com/package/karma-webpack-with-fast-source-maps

// tslint:disable-next-line
if (!Symbol.asyncIterator) {
  Object.defineProperty(Symbol, 'asyncIterator', {
    value: Symbol.for('Symbol.asyncIterator')
  })
}

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
var chaiSubset = require('chai-subset')
chai.use(chaiSubset)

var config = require.context('../src/graph/test/', true, /mocha_config.ts$/)
var testsContext = require.context('../src', true, /test.ts$/)

config.keys().forEach(config)
testsContext.keys().forEach(testsContext)
