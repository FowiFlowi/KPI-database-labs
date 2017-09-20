const util = require('util'),
      writeFile = util.promisify(require('fs').writeFile),
      data = require('./data')

function Model(collection) {
  if (Object.keys(data).includes(collection)) {
    this.name = collection
    this.data = data[collection]
  } else
    throw new Error('Wrong collection')
}

Model.prototype = { view, remove, get, insert, update, save }

const common = new Model('comp_hard'),
      computers = new Model('computers'),
      hardware = new Model('hardware')


function view() {
  console.log('\n' + this.name.toUpperCase() + ':')
  this.data.forEach(item => console.log(item))
  console.log()
}


function get(selector) {
  return selector
    ? this.data.reduce((res, item) => {
        res.includes(item[selector]) ? null : res.push(item[selector])
        return res
      }, [])
    : this.data
}


function remove(id) {
  if (this.name === 'computers')
    throw new Error(`You can't remove or update records from the main model`)

  const indx = this.data.map(i => i.id).indexOf(id)
  if (~indx) {
    // remove records from 'comp_hard'
    if (this.name === 'hardware') {
      let i = 0
      while (i < common.data.length)
        common.data[i].hid === id ? common.data.splice(i, 1) : i++
    }
    common.view()

    const removed = this.data.splice(indx, 1)[0]
    this.save()
    return removed
  } else
    throw new Error('Wrong id')
}


function insert(element, hardwareIDs) {
  let nextId = 1
  while (this.data[nextId - 1]) {
    if (this.data[nextId - 1].id != nextId)
      break
    nextId++
  }
  if (this.name === 'computers') {
    if (!hardwareIDs)
      throw new Error(`hardware doesn't specified`)
    hardwareIDs.forEach(id => common.data.push({ cid: nextId, hid: id }))
    common.view()
  }

  element.id = nextId
  this.data.splice(nextId - 1, 0, element)
  this.save()
}


function update(id, newElem) {
  if (this.name === 'computers')
    throw new Error(`You can't remove or update records from the main model`)

  const indx = this.data.map(i => i.id).indexOf(id)
  if (~indx) {
    // if new type is different then delete old hardware from all computers
    if (newElem.type !== this.data[indx].type) {
      let i = 0
      while (i < common.data.length)
        common.data[i].hid === id ? common.data.splice(i, 1) : i++
    }
    common.view()

    newElem.id = id
    this.data[indx] = newElem
    this.save()
  } else
    throw new Error('Wrong id')
}


async function save() {
  try {
    const json = JSON.stringify(data, null, 2)
    await writeFile('./data.json', json, 'utf-8')
  } catch(e) {
    console.error(e)
    process.exit(1)
  }
}


module.exports = { computers, hardware }
