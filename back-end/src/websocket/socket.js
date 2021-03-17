const { Chess } = require("chess.js")
const { createGame, getGame } = require("../database/game")
const { createMove } = require("../database/moves")

const userMap = {}
const socketMap = {}
const waitingSockets = []
const rithmMap = {}
const gameMap = {}
const userGameMap = {}
let i = 0;

function configureListeners(io) {
  io.on('connection', (socket) => {
    socket.on('userData', (data) => {
      userMap[i] = socket.id
      socketMap[socket.id] = i
      i = i == 1 ? 0 : 1
    })

    socket.on('waitGame', async (data) => {
      if(rithmMap[data.rithm]) {
        const user1 = socketMap[socket.id]
        const user2 = socketMap[rithmMap[data.rithm]]
        const newGame = await createGame(user1, user2, data.rithm)
        gameMap[newGame] = new Chess()
        userGameMap[user1] = newGame
        userGameMap[user2] = newGame
        io.to(socket.id).emit('gameCreated', {
          gameId: newGame,
          color: 'white',
          ritmo: data.rithm
        })
        io.to(rithmMap[data.rithm]).emit('gameCreated', {
          gameId: newGame,
          color: 'black',
          ritmo: data.rithm
        })
        delete rithmMap[data.rithm]
        waitingSockets.pop()
      }
      else {
        waitingSockets.push([socket.id, data.rithm])
        rithmMap[data.rithm] = socket.id
      }
    })

    socket.on('joinGame', async (data) => {
      const game = await getGame(data.gameId)
      const userId = socketMap[socket.id]
      const roomId = `game${data.gameId}`
      if(userId !== game.player_brancas && userId !== game.player_pretas) {
        console.log('here')
        socket.disconnect()
      }
      else {
        socket.join(roomId)
        io.to(roomId).emit('message', {
          message: `User ${userId} has connected to the game.`
        })
      }
    })

    socket.on('move', async (data) => {
      const { from, to } = data
      const userId = socketMap[socket.id]
      const gameId = userGameMap[userId]
      const dbGame = await getGame(gameId)
      const game = gameMap[gameId]
      let move = game.move({
        from: from,
        to: to,
        promotion: "q" // always promote to a queen for example simplicity
      })
      if (move === null) return
      const madeMove = await createMove(dbGame, from, to)
      const roomId = `game${gameId}`
      io.to(roomId).emit('madeMove', { ...madeMove, color: madeMove.sequencial % 2 === 1 ? 'white' : 'black' })
    })

    socket.on('disconnect', () => {
      const userId = socketMap[socket.id]
      delete socketMap[socket.id]
      delete userMap[userId]
      const index = waitingSockets.findIndex(el => el === socket.id)
      if(index !== -1) {
        const data = waitingSockets[index]
        delete rithmMap[data[1]]
        waitingSockets.splice(index, 1)
      }
      Array.from(socket.rooms).filter(el => el !== socket.id).forEach(room => io.to(room).emit('message', {
        message: `User ${userId} has disconnected to the game.`
      }))
    })
  })
}

module.exports = {
  configureListeners
}