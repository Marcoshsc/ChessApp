const { Client } = require('pg')

function getClient() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'ChessApp',
    password: '12345',
    port: 5432,
  })
  client.connect(err => console.log(err))
  return client
}

module.exports = {
  getClient
}