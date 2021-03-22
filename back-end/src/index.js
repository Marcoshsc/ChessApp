const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')
const socketIo = require('socket.io')
const { configureListeners } = require('./websocket/socket')
const { authRouter, validateJwt } = require('./routes/auth')
const { gamesRouter } = require('./routes/games')

const app = express()
const server = http.Server(app)
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
})

app.use(bodyParser.json())
app.use(cors())

app.use((req, res, next) => {
  if (req.url === '/user/login' || req.url === '/user/signup') {
    next()
    return
  }
  if (!req.headers.authorization) {
    res.status(401).json({
      error: 'No authorization data was provided.'
    })
    return
  }
  const token = req.headers.authorization.replace('Bearer ', '')
  const userId = validateJwt(token)
  res.locals.jwtPayload = userId
  next()
})

app.use('/user', authRouter)
app.use('/games', gamesRouter)

configureListeners(io)

server.listen(3001, () => {
  console.log('Listening at port 3001.')
})