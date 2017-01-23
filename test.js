'use strict'

const assert = require('assert')
const modifyProperty = require('.')

describe('modifyProperty()', function () {
  it('should be able to replace a value', function () {
    const obj = {}
    Object.defineProperty(obj, 'name', {
      configurable: true,
      enumerable: true,
      value: 'value1',
    })

    modifyProperty(obj, 'name', desc => { desc.value = 'value2' })
    assert.strictEqual(obj.name, 'value2')
  })

  it('should be able to replace a getter', function () {
    class TestClass {
      get name () { return 'Bill' }
    }

    modifyProperty(TestClass.prototype, 'name', desc => { desc.get = () => 'Ben' })
    const obj = new TestClass()
    assert.strictEqual(obj.name, 'Ben')
  })

  it('should be able to replace a setter', function () {
    class TestClass {
      get name () { return this._name }
      set name (name) { this._somethingElse = name }
    }

    const obj = new TestClass()

    obj.name = 'Bill'
    assert.notStrictEqual(obj.name, 'Bill')

    modifyProperty(TestClass.prototype, 'name', desc => {
      desc.set = function (name) { this._name = name }
    })

    obj.name = 'Bill'
    assert.strictEqual(obj.name, 'Bill')
  })

  it('should be able to replace the entire descriptor', function () {
    const obj = {}
    Object.defineProperty(obj, 'name', {
      configurable: true,
      enumerable: true,
      get () { return 'Bill' },
    })

    const newDesc = {
      configurable: true,
      enumerable: true,
      get () { return 'Ben' },
    }

    modifyProperty(obj, 'name', desc => newDesc)
    assert.strictEqual(obj.name, 'Ben')
  })

  it('should throw an error if the first parameter is not an object', function () {
    assert.throws(() => { modifyProperty('not an object', 'n/a', () => {}) })
  })

  it('should throw an error if the second parameter is not a string', function () {
    assert.throws(() => { modifyProperty({}, [], () => {}) })
  })

  it('should throw an error if the property does not exist', function () {
    assert.throws(() => {
      modifyProperty({}, 'name', desc => { desc.value = 'value' })
    })
  })

  it('should throw an error if the property is non-configurable', function () {
    const obj = {}
    Object.defineProperty(obj, 'name', {
      configurable: false,
      enumerable: true,
      value: 'value',
    })

    assert.throws(() => {
      modifyProperty(obj, 'name', desc => { desc.value = 'other value' })
    })
  })

  it('should throw an error if the third parameter is not a function', function () {
    assert.throws(() => { modifyProperty({}, 'prop', 'not a function') })
  })

  it('should throw an error if the modifier function returns a non-object', function () {
    const obj = {}
    Object.defineProperty(obj, 'name', {
      configurable: true,
      enumerable: true,
      value: 'value',
    })

    assert.throws(() => {
      modifyProperty(obj, 'name', desc => 'not an object')
    })
  })
})
