const { Router } = require("express");
const { getUser, createUser } = require("../database/user");
const bcrypt = require('bcrypt')
const { secret } = require('../jwt/info')
const jwt = require('jsonwebtoken')

const authRouter = Router()

const validateJwt = (token) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { userId } = jwt.verify(token, secret)
  return userId
}

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body
  const userInfo = await getUser(email)
  if(userInfo) {
    const valid = await bcrypt.compare(password, userInfo.senha)
    if(!valid) {
      res.status(400).send({ error: 'Incorrect Login' })
      return
    }
    const jwt = generateJwt(userInfo.id)
    res.status(200).send({...userInfo, senha: undefined, jwt})
  }
  else
    res.status(400).send({ error: 'Incorrect Login' })
})

authRouter.post('/signup', async (req, res) => {
  const { email, password, name } = req.body
  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(password, salt)
  createUser(name, email, hashedPassword)
  .then(userInfo => { 
    const jwt = generateJwt(userInfo.id)
    res.status(200).send({...userInfo, jwt})
  })
  .catch(err => {
    console.log(err)
    res.status(400).send({ error: 'Could not sign up user' })
  })
})

function generateJwt(userId) {
  const payload = { userId }
  const token = jwt.sign(payload, secret, {
    expiresIn: '24h'
  })
  return token
}

module.exports = {
  authRouter,
  validateJwt
}