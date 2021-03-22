const { getClient } = require('./connection')

async function getUser(email) {
  const client = getClient()

  const text = 'select id, nome, senha from usuario where email=$1'
  const params = [email]
  const result = await client.query(text, params)

  await client.end()
  return result.rows.length === 0 ? undefined : result.rows[0]
}

async function createUser(name, email, password) {
  const client = getClient()

  const text = 'insert into usuario (nome, email, senha) values ($1, $2, $3) returning id, nome'
  const params = [name, email, password]
  const result = await client.query(text, params)

  await client.end()
  return result.rows[0]
}

module.exports = {
  getUser,
  createUser
}