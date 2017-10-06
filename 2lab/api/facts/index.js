const router = require('express').Router(),
      pgdb = require('../../modules/pgdb')


router.post('/', (req, res) => {
  const raw = []
  req.on('data', chunk => raw.push(chunk))
  req.on('end', () => {
    const body = JSON.parse(Buffer.concat(raw))
    body.date = `to_timestamp(${body.date})`

    const columns = Object.keys(body),
          values = Object.values(body),
          conditions = columns.map((column, i) => `${column} = ${values[i]}`).join(' AND '),
          insertQuery = `INSERT INTO f_colonizations (id, ${columns.join(', ')}) VALUES (default, ${values.join(', ')})`,
          selectQuery = `SELECT ${columns} FROM f_colonizations WHERE ${conditions}`

    pgdb.query(selectQuery)
      .then(({ rows }) => {
        if (rows.length > 0) {
          res.status(400).json({ error: 'Такий запис вже існує' })
          return null
        }
        return pgdb.query(insertQuery)
      })
      .then(result => {
        if (result)
          res.json({ })
      })
      .catch(e => {
        console.error(e)
        res.status(400).json({ error: 'Некоректний запит' })
      })
  })
})

router.delete('/:id', (req, res) => {
  const query = `DELETE FROM f_colonizations WHERE id = ${req.params.id}`
  pgdb.query(query)
    .then((response) => {
      res.json({ })
    })
    .catch(e => {
      console.error(e)
      res.status(400).json({ error: 'Некоректний запит' })
    })
})

router.patch('/:id', (req, res) => {
  const raw = []
  req.on('data', chunk => raw.push(chunk))
  req.on('end', () => {
    const body = JSON.parse(Buffer.concat(raw)),
          fact_id = req.params.id
    if (body.date) 
      body.date = `to_timestamp(${body.date})`

    const columns = Object.keys(body),
          values = Object.values(body),
          conditions = columns.map((column, i) => `${column} = ${values[i]}`).join(', '),
          updateQuery = `UPDATE f_colonizations SET ${conditions} WHERE id = ${fact_id}`,
          selectQuery = `SELECT * FROM f_colonizations WHERE id = ${fact_id}`

    pgdb.query(selectQuery)
      .then(({ rows }) => {
        if (rows.length = 0) {
          res.status(204).json({ error: 'Такого запису не існує' })
          return null
        }
        return pgdb.query(updateQuery)
      })
      .then(result => {
        if (result)
          res.json({ })
      })
      .catch(e => {
        console.error(e)
        res.status(400).json({ error: 'Некоректний запит' })
      })
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