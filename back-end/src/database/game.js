const { getClient } = require('./connection')

async function createGame(user1, user2) {
  const client = getClient()

  const text = 'insert into partida (data_criacao, ritmo, player_brancas, player_pretas) values ' + 
  '(now(), 5+3, $1, $2) RETURNING id'
  const params = [user1, user2]
  const result = await client.query(text, params)
  const gameId = result.rows[0].id
  await client.end()
  return gameId
}

module.exports = {
  createGame
}