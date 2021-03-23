const { getClient } = require('./connection')

async function getUser(email) {
  const client = getClient()

  const text = 'select id, nome, senha from usuario where email=$1'
  const params = [email]
  const result = await client.query(text, params)

  await client.end()
  return result.rows.length === 0 ? undefined : result.rows[0]
}

async function createUser(name, email, password) {
  const client = getClient()

  const text = 'insert into usuario (nome, email, senha, data_criacao) values ($1, $2, $3, $4) returning id, nome'
  const params = [name, email, password, new Date()]
  const result = await client.query(text, params)

  await client.end()
  return result.rows[0]
}

async function isFollowing(follower, following) {
  const client = getClient()

  const text = 'select exists (select id from follow where seguidor=$1 and seguindo=$2)'
  const params = [follower, following]
  const result = await client.query(text, params)

  await client.end()
  return result.rows[0]
}

async function getUserInfos(userIds) {
  const client = getClient()

  function getPlaceHolders(list) {
    let str = ''
    list.forEach((_, idx) => {
      str += `$${idx + 1}, `
    })
    str = str.slice(0, str.length - 2)
    return str
  }

  const text = `select id, nome, data_criacao from usuario where id in (${getPlaceHolders(userIds)})`
  console.log(text)
  const params = userIds
  const result = await client.query(text, params)

  await client.end()
  return result.rows
}

async function doFollow(follower, following) {
  const client = getClient()

  const text = 'insert into follow (seguidor, seguindo) values ($1, $2)'
  const params = [follower, following]
  await client.query(text, params)

  await client.end()
}

async function unFollow(follower, following) {
  const client = getClient()

  const text = 'delete from follow where seguidor=$1 and seguindo=$2'
  const params = [follower, following]
  await client.query(text, params)

  await client.end()
}

module.exports = {
  getUser,
  createUser,
  getUserInfos,
  isFollowing,
  doFollow,
  unFollow
}