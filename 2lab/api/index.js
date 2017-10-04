// пошук за атрибутами
//діапазон чисел,
//перелічення

// повнотекстовий пошук
//обов’язкове входження
//слова, ціла фраза

const multer = require('multer')(),
      util = require('util'),
      parseXML = util.promisify(require('xml2js').parseString),
      router = require('express').Router(),

      pgdb = require('../modules/pgdb'),
      { 
        selectAllTables,
        selectInstanceColumns,
        selectInstance
      } = require('../queries')


router.post('/upload', multer.single('file'), (req, res) => {
  if (req.file.mimetype !== 'text/xml')
    throw new Error('Очікується файл формату XML')
  if (!req.file.buffer.toString())
    throw new Error('Файл порожній')

  parseXML(req.file.buffer.toString())
    .then(({ input }) => {
      if (!input)
        throw new Error('Неправильна форма')

      const insertQueries = []
      for (const instance in input) {
        if (typeof input[instance] !== 'object')
          throw new Error('Неправильна форма')

        const values = input[instance].map(row => 
          `(${Object.values(row)
              .map(i => isNaN(i[0]) ? `'${i[0]}'` : i[0])
              .join(', ')})`
        )
        .join(', ')

        insertQueries.push(`INSERT INTO ${instance} VALUES ${values}`)
      }

      return Promise.all([
        insertQueries,
        pgdb.query(selectAllTables)
      ])
    })
    .then(([insert, { rows: tables }]) => {
      const deleteTables = tables.map(({ table }) => `DELETE FROM ${table}`)
      return Promise.all(
        deleteTables
          .concat(insert)
          .map(i => pgdb.query(i))
      )
    })
    .then(() => res.json({ data: 'Дані завантажені' }))
    .catch(e => {
      console.error(e)
      res.status(400).json({ error: e.message })
    })
})

router.get('/instance/:name?', (req, res) => {
  if (!req.params.name) {
    return pgdb.query(selectAllTables)
      .then(({ rows }) => 
        res.json({ data: rows.map(({ table }) => table) })
      )
      .catch(e => {
        console.error(e)
        res.status(500).json({ error: e })
      })
  }

  const instance = req.params.name,
        data = JSON.parse(req.query.data)

  if (!data) return res.status(400).json({ error: 'Data in query doesn\'t exist' })

  let conditions = []
  for (const column in data) {
    const { type } = data[column]
    if (type === 'numeric') {
      const { max, min } = data[column]
      conditions.push(`(${column} <= ${max} AND ${column} >= ${min})`)
    }
    if (type === 'text') {
      const words = data[column].words.map(i => i.replace(' ', '')).join(' & ')
      if (words)
        conditions.push(`(to_tsvector(${column}) @@ to_tsquery('${words}'))`)
    }
  }
  conditions = conditions.join(' AND ') 
  
  pgdb.query(selectInstance(instance, conditions))
    .then(data => {
      console.log(data.rows)
      res.json({ data })
    })
    .catch(e => {
      console.error(e)
      res.status(500).json({ error: e })
    })
})

router.get('/attributes/:instance', (req, res) => {
  pgdb.query(selectInstanceColumns(req.params.instance))
    .then(async ({ rows: data }) => {

      for (let i = 0; i < data.length; i++) {
        const r = data[i]
        if (['numeric', 'integer'].includes(r.data_type)) {

          const query = `
            SELECT min(${r.column_name}), max(${r.column_name}) FROM ${req.params.instance}
          `
          const { rows } = await pgdb.query(query),
                [{ min, max }] = rows,
                seriesLength = min === max ? 2 : 4,
                step = (max - min) / (seriesLength - 1)

          r.interval = new Array(seriesLength)
          r.interval[0] = Number(min)
          r.interval[r.interval.length - 1] = Number(max)
          for (let j = 1; j < r.interval.length - 1; j++)
            r.interval[j] = Math.floor(r.interval[j - 1] + step)
        } 
      }

      res.json({ data })
    })
    .catch(e => {
      console.error(e)
      res.status(500).json({ error: e })
    })
})

router.use((req, res, next) => {
  res.status(404).json({ error: 404 })
  next()
})

router.use((err, req, res, next) => {
  console.error(err)
  res.json({ error: err.message })
  next()
})

module.exports = router