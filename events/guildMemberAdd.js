//This anti-raid is terrible

/*let raided = false
let joins = new Set()*/

module.exports = (client, member) => {
  /*joins.add(member.id)

  if(joins.size > client.serverconfig.antiraid.maxjoins) {
    raided = true
    client.logger.log('ANTI_RAID_AUTO_ENABLE', `:lock: Under attack mode automatically enabled: too many users joined in a short period of time`)
  }

  if(raided)
    member.kick('Automatic: raid going on')

  setTimeout(() => {
    return new Promise(function(resolve, reject) {
      resolve(joins.delete(member.id))
    })
  }, client.serverconfig.antiraid.time * 1000)*/
}
