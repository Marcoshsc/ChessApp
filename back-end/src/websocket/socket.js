const { createGame } = require("../database/game")

const userMap = {}
const socketMap = {}
const waitingSockets = []
const rithmMap = {}

function configureListeners(io) {
  io.on('connection', (socket) => {
    socket.on('userData', (data) => {
      userMap[data.userId] = socket.id
      socketMap[socket.id] = data.userId
    })
    socket.on('waitGame', async (data) => {
      if(rithmMap[data.rithm]) {
        const user1 = socketMap[socket.id]
        const user2 = socketMap[rithmMap[data.rithm]]
        const newGame = await createGame(user1, user2)
        io.to(socket.id).emit('gameCreated', {
          gameId: newGame
        })
        io.to(rithmMap[data.rithm]).emit('gameCreated', {
          gameId: newGame
        })
        delete rithmMap[data.rithm]
        waitingSockets.pop()
      }
      else {
        waitingSockets.push([socket.id, data.rithm])
        rithmMap[data.rithm] = socket.id
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
    })
  })
}

module.exports = {
  configureListeners
}