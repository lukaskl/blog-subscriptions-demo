// tslint:disable-next-line
if (!Symbol.asyncIterator) {
  Object.defineProperty(Symbol, 'asyncIterator', {
    value: Symbol.for('Symbol.asyncIterator')
  })
}

import './server'
