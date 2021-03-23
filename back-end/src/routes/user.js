const { Router } = require("express");
const { getUser, createUser, getUserInfos, isFollowing, doFollow, unFollow, getFollowers, getFollowing, searchUser } = require("../database/user");
const { getWonGamesByRithm, getDrawnGamesByRithm, getLostGamesByRithm } = require('../database/game')
const bcrypt = require('bcrypt')
const { secret } = require('../jwt/info')
const jwt = require('jsonwebtoken')

const userRouter = Router()

const validateJwt = (token) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { userId } = jwt.verify(token, secret)
  return userId
}

userRouter.post('/login', async (req, res) => {
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

userRouter.get('/profile/:userId', async (req, res) => {
  const { userId } = req.params
  try {
    const wonGames = await getWonGamesByRithm(userId)
    const lostGames = await getLostGamesByRithm(userId)
    const drawnGames = await getDrawnGamesByRithm(userId)
    const userInfos = await getUserInfos([userId])
    const following = await isFollowing(res.locals.jwtPayload, userId)
    const userInfo = userInfos[0]
    const finalJson = {
      user: userInfo,
      gamesInfo: {
        won: wonGames,
        lost: lostGames,
        drawn: drawnGames
      },
      isFollowing: following.exists
    }
    res.status(200).send(finalJson)
  } catch(err) {
    console.log(err)
    res.status(400).send({ error: 'Could not retrieve profile' })
  }
})

userRouter.post('/follow/:userId', async (req, res) => {
  const { userId } = req.params
  try {
    const loggedUser = res.locals.jwtPayload
    const following = await isFollowing(loggedUser, userId)
    console.log(following)
    if(following.exists)
      await unFollow(loggedUser, userId)
    else
      await doFollow(loggedUser, userId)
    res.status(200).send()
  } catch(err) {
    console.log(err)
    res.status(400).send('Could not handle follow/unfollow.')
  }
})

userRouter.get('/follows/:userId', async (req, res) => {
  const { userId } = req.params
  try {
    const followers = await getFollowers(userId)
    const following = await getFollowing(userId)
    const userIds = [userId]
    followers.forEach(el => userIds.push(el.seguidor))
    following.forEach(el => userIds.push(el.seguindo))
    const userInfos = await getUserInfos(userIds)
    const userInfoMap = new Map()
    userInfos.forEach(el => userInfoMap.set(el.id, el))
    const finalResult = {
      user: userInfoMap.get(userId),
      followers: followers.map(el => ({
        data_criacao: el.data_criacao,
        seguidor: userInfoMap.get(el.seguidor)
      })),
      following: following.map(el => ({
        data_criacao: el.data_criacao,
        seguindo: userInfoMap.get(el.seguindo)
      }))
    }
    res.status(200).send(finalResult)
  } catch(err) {
    console.log(err)
    res.status(400).send('Could not get follow info.')
  }
})

userRouter.get('/search/:username', async (req, res) => {
  const { username } = req.params
  try {
    const user = await searchUser(username)
    if(user)
      res.status(200).send(user)
    else
      res.status(204).send()
  } catch(err) {
    console.log(err)
    res.status(400).send('Could not search for user.')
  }
})

userRouter.post('/signup', async (req, res) => {
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
  userRouter,
  validateJwt
}