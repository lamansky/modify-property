'use strict'

const check = require('check-types')

/**
 * Retrieves an object property descriptor, passes it through a callback,
 * and saves it back to the object.
 * @param  {object} object The object which has the property we want to modify.
 * @param  {string} propName The name of the property to modify.
 * @param  {PropertyModifier} modifier A function which accepts the property
 *   descriptor object and either modifies it directly or returns a new one.
 * @return {void}
 */
module.exports = function modifyProperty (object, propName, modifier) {
  check.assert.object(object, 'Cannot edit the property of a non-object.', TypeError)
  check.assert.string(propName, 'The name of the property must be a string.', TypeError)

  const desc = Object.getOwnPropertyDescriptor(object, propName)
  check.assert.object(desc, `Property '${propName}' not found.`, ReferenceError)
  check.assert(desc.configurable, `The '${propName}' property is not configurable.`, Error)

  check.assert.function(modifier, 'Third parameter must be a function.', TypeError)

  let modifiedDesc = modifier(desc)
  if (typeof modifiedDesc === 'undefined') {
    modifiedDesc = desc
  } else {
    check.assert.object(modifiedDesc, 'Modifier callback must not return a non-object.', TypeError)
  }

  Object.defineProperty(object, propName, modifiedDesc)
}

/**
 * A function which accepts, modifies, and returns a property descriptor object.
 * @callback PropertyModifier
 * @param {object} desc The descriptor object containing the property's properties.
 * @return {void|object} The modified descriptor (optional, since the object can
 *   be modified directly).
 */
