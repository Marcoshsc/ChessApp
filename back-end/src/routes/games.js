const { Router } = require("express")
const { getGames } = require("../database/game")
const { getUserInfos } = require("../database/user")

const gamesRouter = Router()

gamesRouter.get('/:userId', (req, res) => {
  const { userId } = req.params
  getGames(userId)
  .then(async games => {
    const opponentIds = games.map(game => game.player_brancas === userId ? game.player_pretas : game.player_brancas)
    opponentIds.push(userId)
    const opponentInfos = await getUserInfos(opponentIds)
    const opponentInfoMaps = new Map()
    opponentInfos.forEach(el => opponentInfoMaps.set(el.id, el))
    const gamesFinal = games.map(game => {
      const whiteInfo = opponentInfoMaps.get(game.player_brancas)
      const blackInfo = opponentInfoMaps.get(game.player_pretas)
      const gameFinal = {
        ...game,
        player_pretas: {
          id: blackInfo.id,
          nome: blackInfo.nome
        },
        player_brancas: {
          id: whiteInfo.id,
          nome: whiteInfo.nome
        }
      }
      return gameFinal
    })
    res.status(200).send(gamesFinal)
  })
  .catch(err => {
    console.log(err)
    res.status(400).send({ error: 'Could not retrieve games '})
  })
})

module.exports = {
  gamesRouter
}