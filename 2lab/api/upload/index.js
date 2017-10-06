const util = require('util'),
      parseXML = util.promisify(require('xml2js').parseString),
      pgdb = require('../../modules/pgdb'),
      { selectAllTables } = require('../../queries')

module.exports = (req, res) => {
  if (req.file.mimetype !== 'text/xml')
    throw new Error('Очікується файл формату XML')
  const data = req.file.buffer.toString()
  if (!data)
    throw new Error('Файл порожній')

  parseXML(data)
    .then(({ input }) => {
      if (!input)
        throw new Error('Неправильна форма')

      const insertQueries = []
      for (const instance in input) {
        if (typeof input[instance] !== 'object')
          throw new Error('Неправильна форма')

        const result = input[instance].reduce((acc, item) => {
          if (!acc.columns)
            acc.columns = ['id'].concat(Object.keys(item))
          acc.values.push(`(default, ${Object.values(item)
              .map(i => isNaN(i[0]) ? `'${i[0]}'` : i[0])
              .join(', ')})`)
          return acc
        }, { values: [] })

        insertQueries.push(`INSERT INTO ${instance} (${result.columns.join(', ')}) VALUES ${result.values.join(', ')}`)
      }
      return Promise.all([
        insertQueries,
        pgdb.query(selectAllTables)
      ])
    })
    .then(([insert, { rows: tables }]) => {
      const deleteTables = tables.map(({ table }) => `DELETE FROM ${table}`)
      return Promise.all(
        ['DELETE FROM f_colonizations']
          .concat(deleteTables, insert)
          .map(i => pgdb.query(i))
      )
    })
    .then(() => res.json({ data: 'Дані завантажені' }))
    .catch(e => {
      console.error(e)
      res.status(400).json({ error: e.message })
    })
}
// module.exports = (req, res) => {
//   if (req.file.mimetype !== 'text/xml')
//     throw new Error('Очікується файл формату XML')
//   const data = req.file.buffer.toString()
//   if (!data)
//     throw new Error('Файл порожній')

//   parseXML(data)
//     .then(({ input }) => {
//       if (!input)
//         throw new Error('Неправильна форма')

//       const insertQueries = []
//       for (const instance in input) {
//         if (typeof input[instance] !== 'object')
//           throw new Error('Неправильна форма')

//         const values = input[instance].map(row => 
//           `(default, ${Object.values(row)
//               .map(i => isNaN(i[0]) ? `'${i[0]}'` : i[0])
//               .join(', ')})`
//         ).join(', ')

//         insertQueries.push(`INSERT INTO ${instance} VALUES ${values}`)
//       }

//       return Promise.all([
//         insertQueries,
//         pgdb.query(selectAllTables)
//       ])
//     })
//     .then(([insert, { rows: tables }]) => {
//       const deleteTables = tables.map(({ table }) => `DELETE FROM ${table}`)
//       return Promise.all(
//         ['DELETE FROM f_colonizations']
//           .concat(deleteTables, insert)
//           .map(i => pgdb.query(i))
//       )
//     })
//     .then(() => res.json({ data: 'Дані завантажені' }))
//     .catch(e => {
//       console.error(e)
//       res.status(400).json({ error: e.message })
//     })
// }