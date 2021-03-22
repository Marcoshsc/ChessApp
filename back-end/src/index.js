const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')
const socketIo = require('socket.io')
const { configureListeners } = require('./websocket/socket')
const { authRouter } = require('./routes/auth')


const app = express()
const server = http.Server(app)
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
})

app.use(bodyParser.json())
app.use(cors())
app.use('/user', authRouter)

configureListeners(io)

server.listen(3001, () => {
  console.log('Listening at port 3001.')
})