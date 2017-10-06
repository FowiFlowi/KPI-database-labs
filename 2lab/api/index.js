const multer = require('multer')(),
      router = require('express').Router(),

      pgdb = require('../modules/pgdb'),
      factsRouter = require('./facts'),
      uploadHandler = require('./upload'),
      { 
        selectAllTables,
        selectInstanceColumns,
        selectInstance
      } = require('../queries')

router.use('/facts', factsRouter)

router.post('/upload', multer.single('file'), uploadHandler)

router.get('/instance/:name?', (req, res) => {
  if (!req.params.name) {
    return pgdb.query(selectAllTables)
      .then(({ rows }) => 
        res.json({ data: rows.map(({ table }) => table) })
      )
      .catch(e => {
        console.error(e)
        res.status(500).json({ error: e.message })
      })
  }

  const instance = req.params.name
  if (!req.query.data) {
    query = selectInstance(instance)
  } else {
    let conditions = []
    const data = JSON.parse(req.query.data)

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
    query = selectInstance(instance, conditions.join(' AND ') || 'true')
  }

  pgdb.query(query)
    .then(data => {
      data.tableName = req.params.name ? req.params.name : null
      res.json({ data })
    })
    .catch(e => {
      console.error(e)
      res.status(400).json({ error: 'Некоректний запит' })
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
      res.status(500).json({ error: e.message })
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