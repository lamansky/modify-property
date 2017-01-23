# modify-property

A [Node.js](https://nodejs.org/) module which lets you patch the descriptor of
an existing object property. This is primarily useful for swapping out getters or setters.

## Installation

```bash
npm install modify-property --save
```

## Usage

```javascript
const obj = {}
Object.defineProperty(obj, 'name', {
  configurable: true, // <- Won't work if this isn't true
  enumerable: true,
  get () { return 'Bill' },
})

// Now we want to modify this property.

const modifyProperty = require('modify-property')

modifyProperty(obj, 'name', prop => { prop.get = () => 'Ben' })

obj.name // Ben
```
