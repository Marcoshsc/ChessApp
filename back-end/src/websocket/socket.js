const { Chess } = require("chess.js")
const { createGame, getGame, finishGame } = require("../database/game")
const { createMove, getLastMove } = require("../database/moves")
const { validateJwt } = require('../routes/auth')

const userMap = {}
const socketMap = {}
const waitingSockets = []
const rithmMap = {}
const gameMap = {}
const userGameMap = {}
const gameTimeMap = {}

function configureListeners(io) {
  io.on('connection', (socket) => {
    socket.on('userData', (data) => {
      console.log(data)
      const userId = validateJwt(data.token)
      userMap[userId] = socket.id
      socketMap[socket.id] = userId
      // i = i == 1 ? 0 : 1
    })

    socket.on('waitGame', async (data) => {
      if(rithmMap[data.rithm]) {
        const user1 = socketMap[socket.id]
        const user2 = socketMap[rithmMap[data.rithm]]
        const newGame = await createGame(user1, user2, data.rithm)
        const totalGameTime = Number.parseInt(data.rithm.split('+')[0]) * 60
        gameMap[newGame] = new Chess()
        userGameMap[user1] = newGame
        userGameMap[user2] = newGame
        gameTimeMap[newGame] = {}
        gameTimeMap[newGame][user1] = {
          interval: null,
          time: totalGameTime
        }
        gameTimeMap[newGame][user2] = {
          interval: null,
          time: totalGameTime
        }
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

    socket.on('resign', async () => {
      const userId = socketMap[socket.id]
      const gameId = userGameMap[userId]
      const dbGame = await getGame(gameId)
      const roomId = `game${gameId}`
      const lastMove = await getLastMove(dbGame)
      io.to(roomId).emit('gameover', { 
        winner: lastMove % 2 === 1 ? 'white' : 'black',
        reason: 'resign' 
      })
      finishGame(gameId, 'resign', lastMove % 2 === 1 ? 'white' : 'black')
    })

    socket.on('move', async (data) => {
      const { from, to } = data
      const userId = socketMap[socket.id]
      const gameId = userGameMap[userId]
      const dbGame = await getGame(gameId)
      if(dbGame.finalizada)
        return
      const game = gameMap[gameId]
      let move = game.move({
        from: from,
        to: to,
        promotion: "q" // always promote to a queen for example simplicity
      })
      if (move === null) return
      const madeMove = await createMove(dbGame, from, to)
      const roomId = `game${gameId}`
      const key = Object.keys(gameTimeMap[gameId]).find(el => {
        const numEl = Number.parseInt(el)
        return numEl !== userId
      })
      // console.log(gameTimeMap[gameId])
      const color = madeMove.sequencial % 2 === 1 ? 'white' : 'black'
      // console.log(`${color} played by ${userId} clock is stopped and reseted with ${madeMove.tempo}`)
      clearInterval(gameTimeMap[gameId][userId].interval)
      clearInterval(gameTimeMap[gameId][key].interval)
      gameTimeMap[gameId][userId].time = madeMove.tempo
      // console.log(`${madeMove.sequencial % 2 === 1 ? 'black' : 'white'} played by ${key} clock is started with ${gameTimeMap[gameId][key].time}`)
      gameTimeMap[gameId][key].interval = setInterval(() => {
        io.to(roomId).emit('gameover', {
          winner: madeMove.sequencial % 2 === 1 ? 'white' : 'black',
          reason: 'timeout'
        })
        clearInterval(gameTimeMap[gameId][userId])
        clearInterval(gameTimeMap[gameId][key])
        finishGame(gameId, 'timeout', madeMove.sequencial % 2 === 1 ? 'white' : 'black')
      }, gameTimeMap[gameId][key].time * 1000)
      io.to(roomId).emit('madeMove', { ...madeMove, color: madeMove.sequencial % 2 === 1 ? 'white' : 'black' })
      if(game.game_over()) {
        clearInterval(gameTimeMap[gameId][userId])
        clearInterval(gameTimeMap[gameId][key])
        if(game.in_checkmate()) {
          io.to(roomId).emit('gameover', { 
            winner: madeMove.sequencial % 2 === 1 ? 'white' : 'black',
            reason: 'checkmate' 
          })
          finishGame(gameId, 'checkmate', madeMove.sequencial % 2 === 1 ? 'white' : 'black')
        }
        else {
          io.to(roomId).emit('gameover', {
            winner: null,
            reason: 'draw'
          })
          finishGame(gameId, 'draw')
        }
        return
      }
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