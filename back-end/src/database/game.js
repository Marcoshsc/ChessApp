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

async function getGames(userId) {
  const client = getClient()

  const text = 'select * from partida where player_brancas=$1 or player_pretas=$1'
  const params = [userId]
  const result = await client.query(text, params)
  await client.end()
  return result.rows
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

async function finishGame(id, reason, winner) {
  const client = getClient()

  const text = winner ? `update partida set finalizada=true, vencedor=$1, motivo_final=$2 where id=$3` : `update partida set finalizada=true, motivo_final=$1 where id=$2`
  const params = winner ? [winner, reason, id] : [reason, id]
  await client.query(text, params)
  await client.end()
}

module.exports = {
  createGame,
  getGame,
  finishGame,
  getGames
}