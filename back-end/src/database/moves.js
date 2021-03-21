const { getClient } = require('./connection')

async function createMove(game, from, to) {
  const client = getClient()

  const timeInfo = game.ritmo.split('+')
  const gameTotalTime = Number.parseInt(timeInfo[0]) * 60
  const increment = Number.parseInt(timeInfo[1])

  const lastMoveQuery = 'select momento_lance, tempo from lance where id_partida=$1 and ' +
  'sequencial in((select max(sequencial) from lance where id_partida=$1), (select max(sequencial - 1) from lance where id_partida=$1)) order by sequencial'
  const lastMoveParams = [game.id]
  const lastMoveR = await client.query(lastMoveQuery, lastMoveParams)
  const lastMove = lastMoveR.rows[1]
  const lastOwnMove = lastMoveR.rows[0]

  let remaining
  const date2 = new Date()
  if(lastMove) {
    const date1 = new Date(lastMove.momento_lance)
    remaining = Math.floor((lastOwnMove.tempo - ((date2 - date1) / 1000)) + increment)
    console.log(`Tinha ${lastMove.tempo}, gastou: `)
    console.log(((date2 - date1) / 1000))
    console.log(`Agora tem: ${remaining}`)
  }
  else {
    remaining = gameTotalTime
  }

  const text = 'insert into lance (id_partida, sequencial, tempo, de, para, momento_lance) values ' + 
  '($1, coalesce((select max(sequencial) + 1 from lance where id_partida=$1), 1), $2, $3, $4, $5) returning tempo, de, para, sequencial, momento_lance'
  const params = [game.id, remaining, from, to, date2]
  const result = await client.query(text, params)
  await client.end()
  return result.rows[0]
}

async function getMoves(game) {
  const client = getClient()

  const text = 'select * from lance where id_partida=$1'
  const params = [game.id]
  const result = await client.query(text, params)

  await client.end()
  return result
}

module.exports = {
  createMove,
  getMoves
}