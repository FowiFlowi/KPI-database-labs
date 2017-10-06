const getFacts = () => new Promise((resolve, reject) => {
  fetch('/api/instance/f_colonizations')
    .then(res => Promise.all([res.status, res.json()]))
    .then(([status, response]) => {
      if (status !== 200)
        return reject(response.error)
      
      const facts = response.data.rows.map(item => {
        item.date = item.date.substring(0, 10)
        const res = { id: item.id },
              buf = []
        for (const key in item) {
          if (key !== 'id')
            buf.push(`${key}: ${item[key]}`)
        }
        res.value = buf.join(' | ')
        return res
      })
      resolve(facts)
    })
    .catch(e => reject(e.message))
})

module.exports = getFacts