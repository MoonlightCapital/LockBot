module.exports = async (client, reaction, user) => {
  if(user.bot) return

  if(reaction.emoji.name === "⭐") {
    console.log('star')
  }
}
