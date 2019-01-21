const userDB = require('../database/users')

module.exports = async (client, member) => {

  const data = await userDB.getUser(member.id)

  if(data) {
    const actualPoints = Math.floor(data.points * 0.25)
    console.log(`${member.user.tag} left the server, setting their points to ${actualPoints}`)

    userDB.updateUser({points: actualPoints}, member.id)
  }
}
