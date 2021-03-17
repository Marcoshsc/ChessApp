const { getClient } = require('./connection')
const moment = require('moment')

async function createMove(game, from, to) {
  const client = getClient()

  console.log(game)
  const t1 = 'select coalesce(max(sequencial), 0) as s from lance where id_partida=$1'
  const p1 = [game.id]
  const totalMoves = await client.query(t1, p1)
  console.log(game.data_criacao)
  const date1 = new Date(game.data_criacao)
  console.log(date1)
  const date2 = new Date()
  console.log(date2)
  console.log((date2 - date1) / 1000)
  const diffTime = Math.ceil((date2 - date1) / 1000)
  const actualTime = diffTime + Math.trunc(totalMoves.rows[0].s / 2)
  console.log(actualTime)

  const timeInfo = game.ritmo.split('+')
  const gameTotalTime = Number.parseInt(timeInfo[0]) * 60
  const increment = Number.parseInt(timeInfo[1])

  const text = 'insert into lance (id_partida, sequencial, tempo, de, para) values ' + 
  '($1, coalesce((select max(sequencial) + 1 from lance where id_partida=$1), 1), $2, $3, $4) returning tempo, de, para, sequencial'
  const params = [game.id, gameTotalTime - actualTime + increment, from, to]
  const result = await client.query(text, params)
  console.log(result)
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