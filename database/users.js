const db = require('./connection')
const S = require('sequelize')
const cache = new Map()

const Users = db.define('users', {
  id: {
      type: S.STRING,
      unique: true,
      primaryKey: true
  },
  points: {
    type: S.INTEGER,
    defaultValue: 0
  },
  pointsMultiplier: {
    type: S.INTEGER,
    defaultValue: 1
  },
  starsReceived: {
    type: S.INTEGER,
    defaultValue: 0
  },
  starsGiven: {
    type: S.INTEGER,
    defaultValue: 0
  },
})

Users.sync()

async function getUser(user) {
  const data = cache.get(user) || await Users.findOne({where: {id: user}})
  if(data) await cacheUser(data)
  return data
}

async function cacheUser(user) {
  const stuff = {
    id: user.id,
    points: user.points,
    pointsMultiplier: user.pointsMultiplier
  }
  cache.set(user.id, stuff)
}

async function addUser(id) {
  const user = await Users.create({id: id})
  await cacheUser(user)
  return user
}

async function forceUser(id) {
  const user = await getUser(id)
  if(user) return user
  return await addUser(id)
}

async function getUserFresh(user) {
  return await Users.findOne({where: {id: user}})
}

async function updateUser(data, user) {
  await Users.update(data, {where: {id: user}})

  const update = await getUserFresh(user)

  await cacheUser(update)

  return update
}

module.exports = {getUser, cacheUser, addUser, forceUser, getUserFresh, updateUser}
