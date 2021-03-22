const { Router } = require("express");
const { getUser, createUser } = require("../database/user");

const authRouter = Router()

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body
  const userInfo = await getUser(email, password)
  if(userInfo)
    res.status(200).send(userInfo)
  else
    res.status(400).send({ error: 'Incorrect Login' })
})

authRouter.post('/signup', async (req, res) => {
  const { email, password, name } = req.body
  createUser(name, email, password)
  .then(userInfo => res.status(200).send(userInfo))
  .catch(err => res.status(400).send({ error: 'Could not sign up user' }))
})

module.exports = {
  authRouter
}