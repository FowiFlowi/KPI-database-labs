const { Client } = require('pg'),
      client = new Client()

client.connect()

module.exports = client