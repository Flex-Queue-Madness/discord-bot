import { Command } from '../command.class.js'


const { BOT_NAME } = process.env

const commandMeta = {
  commandName: 'plan',
  commandDescription: 'Dieser Command generiert einen Wochenplan.'
}


class Plan extends Command {

  async execute (interaction) {

    const week = interaction.options.getString('kalenderwoche')
    const baseMessage = `**Wochenplan für KW ${week}**\nBitte tragt eure Verfügbarkeiten von Montag bis Sonntag unten ein. ✅ setzt die komplette Woche auf verfügbar. 🧡\n_ _`

    const results = {}


    const message = await interaction.reply({
      content: baseMessage,
      fetchReply: true
    })

    const emojiMo = message.guild.emojis.cache.find(emoji => emoji.name === 'montag')
    const emojiDi = message.guild.emojis.cache.find(emoji => emoji.name === 'dienstag')
    const emojiMi = message.guild.emojis.cache.find(emoji => emoji.name === 'mittwoch')
    const emojiDo = message.guild.emojis.cache.find(emoji => emoji.name === 'donnerstag')
    const emojiFr = message.guild.emojis.cache.find(emoji => emoji.name === 'freitag')
    const emojiSa = message.guild.emojis.cache.find(emoji => emoji.name === 'samstag')
    const emojiSo = message.guild.emojis.cache.find(emoji => emoji.name === 'sonntag')

    const tableHeader = `\n${emojiMo} ${emojiDi} ${emojiMi} ${emojiDo} ${emojiFr} ${emojiSa} ${emojiSo}\n`



    message.react(emojiMo)
    message.react(emojiDi)
    message.react(emojiMi)
    message.react(emojiDo)
    message.react(emojiFr)
    message.react(emojiSa)
    message.react(emojiSo)
    message.react('✅')



    const collector = message.createReactionCollector({ dispose: true })



    collector.on('collect', (reaction, user) => {

      if (user.tag === BOT_NAME) return

      const player = user.tag.split('#')[0]
      if (!results.hasOwnProperty(player)) { results[player] = ['🟥','🟥','🟥','🟥','🟥','🟥','🟥'] }

      if (reaction._emoji.name === ('montag')) { results[player][0] = '🟩' }
      if (reaction._emoji.name === ('dienstag')) { results[player][1] = '🟩' }
      if (reaction._emoji.name === ('mittwoch')) { results[player][2] = '🟩' }
      if (reaction._emoji.name === ('donnerstag')) { results[player][3] = '🟩' }
      if (reaction._emoji.name === ('freitag')) { results[player][4] = '🟩' }
      if (reaction._emoji.name === ('samstag')) { results[player][5] = '🟩' }
      if (reaction._emoji.name === ('sonntag')) { results[player][6] = '🟩' }

      if (reaction._emoji.name === ('✅')) { results[player] = ['🟩','🟩','🟩','🟩','🟩','🟩','🟩'] }

      let finalMessage = `${baseMessage}${tableHeader}`
      for (const [key, value] of Object.entries(results)) {
        finalMessage += `${value} – ${key}\n`
      }

      message.edit(`${finalMessage.replaceAll(',', ' ')}\n_ _`)

    })



    collector.on('remove', (reaction, user) => {

      const player = user.tag.split('#')[0]

      if (reaction._emoji.name === ('montag')) { results[player][0] = '🟥' }
      if (reaction._emoji.name === ('dienstag')) { results[player][1] = '🟥' }
      if (reaction._emoji.name === ('mittwoch')) { results[player][2] = '🟥' }
      if (reaction._emoji.name === ('donnerstag')) { results[player][3] = '🟥' }
      if (reaction._emoji.name === ('freitag')) { results[player][4] = '🟥' }
      if (reaction._emoji.name === ('samstag')) { results[player][5] = '🟥' }
      if (reaction._emoji.name === ('sonntag')) { results[player][6] = '🟥' }

      if (reaction._emoji.name === ('✅')) { results[player] = ['🟥','🟥','🟥','🟥','🟥','🟥','🟥'] }

      let finalMessage = `${baseMessage}${tableHeader}`
      for (const [key, value] of Object.entries(results)) {
        finalMessage += `${value} – ${key}\n`
      }

      message.edit(`${finalMessage.replaceAll(',', ' ')}\n_ _`)

    })

  }

}


export const plan = new Plan (commandMeta)
