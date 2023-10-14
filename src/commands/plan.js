import { Command } from '../command.class.js'


const { BOT_NAME } = process.env

const commandMeta = {
  commandName: 'plan',
  commandDescription: 'Erstellt einen Wochenplan für die gegebene Kalenderwoche.',
  commandArguments: []
}


class Plan extends Command {

  #baseMessage = `# Wochenplan \nBitte tragt eure Verfügbarkeiten von Montag bis Sonntag unten ein. 🧡`
  #reactionEmojis = ['<:montag:1069195713797439578>', '<:dienstag:1069195704683212822>', '<:mittwoch:1069195711876444170>', '<:donnerstag:1069195706516123679>', '<:freitag:1069195709213069382>', '<:samstag:1069195716402089984>', '<:sonntag:1069195717874307183>']


  #buildMessage (hasResults=false, results) {

    if (!hasResults) return this.#baseMessage

    let resultsHeader = '\n\n'
    for (const emoji of this.#reactionEmojis) {
      resultsHeader += `${emoji} `
    }

    let resultsMessage = `${this.#baseMessage}${resultsHeader}\n`
    for (const [key, value] of Object.entries(results)) {
      resultsMessage += `${value} – ${key}\n`
    }

    return resultsMessage.replaceAll(',', ' ')

  }


  #addVoteReactions (message) { return this.#reactionEmojis.forEach(emoji => message.react(emoji)) }


  #processVotes (reaction, user, results, add=true) {

    if (user.tag === BOT_NAME) return

    const player  = user.tag.split('#')[0]

    if (!results.hasOwnProperty(player)) {
      results[player] = ['🟥','🟥','🟥','🟥','🟥','🟥','🟥']
    }

    if (reaction._emoji.name === ('montag'))     { results[player][0] = add ? '🟩' : '🟥' }
    if (reaction._emoji.name === ('dienstag'))   { results[player][1] = add ? '🟩' : '🟥' }
    if (reaction._emoji.name === ('mittwoch'))   { results[player][2] = add ? '🟩' : '🟥' }
    if (reaction._emoji.name === ('donnerstag')) { results[player][3] = add ? '🟩' : '🟥' }
    if (reaction._emoji.name === ('freitag'))    { results[player][4] = add ? '🟩' : '🟥' }
    if (reaction._emoji.name === ('samstag'))    { results[player][5] = add ? '🟩' : '🟥' }
    if (reaction._emoji.name === ('sonntag'))    { results[player][6] = add ? '🟩' : '🟥' }

  }


  #updatePlan (reaction, user, results, message, add=true) {

    if (user.tag === BOT_NAME) return

    this.#processVotes(reaction, user, results, add)

    const resultsMessage = this.#buildMessage(true, results)
    return message.edit(`${resultsMessage}\n`)

  }


  async execute (interaction) {

    const baseMessage = this.#buildMessage()

    const message = await interaction.reply({
      content: baseMessage,
      fetchReply: true
    })

    this.#addVoteReactions(message)


    const collector = message.createReactionCollector({ dispose: true })
    const results   = {}

    collector.on('collect', (reaction, user) => this.#updatePlan(reaction, user, results, message, true))
    collector.on('remove', (reaction, user) => this.#updatePlan(reaction, user, results, message, false))

  }

}


export const plan = new Plan (commandMeta)
