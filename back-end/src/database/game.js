const { getClient } = require('./connection')

async function createGame(user1, user2, rithm) {
  const client = getClient()

  const text = 'insert into partida (data_criacao, ritmo, player_brancas, player_pretas) values ' + 
  '($4, $3, $1, $2) RETURNING id'
  const params = [user1, user2, rithm, new Date()]
  const result = await client.query(text, params)
  const gameId = result.rows[0].id
  await client.end()
  return gameId
}

async function getGame(id) {
  const client = getClient()

  const text = 'select * from partida where id=$1'
  const params = [id]
  const result = await client.query(text, params)
  const data = result.rows[0]
  await client.end()
  return data
}

module.exports = {
  createGame,
  getGame
}