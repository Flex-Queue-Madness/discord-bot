import { Client, GatewayIntentBits, Routes } from 'discord.js'
import { REST } from '@discordjs/rest'
import { SlashCommandBuilder } from '@discordjs/builders'


// THIS IS A CALCULATED SECURITY RISK
const TOKEN     = '[REDACTED]'
const CLIENT_ID = '1069102550621630546'
const GUILD_ID  = '705754361640517685'




const rest = new REST({ version: '10'}).setToken(TOKEN)



const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ],
  presence: {
    activities: [{
      /*  0 - playing
       *  1 - streaming
       *  2 - listening
       *  3 - watching
       *  5 - competing
       */
      type: 5,
      name: 'Valorant'
    }]
  }
})



client.on('ready', () => {
  console.log(`${client.user.tag} successfully logged in.`)
})



client.on('interactionCreate', async interaction => {

  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'plan') {

    const week = interaction.options.getString('kalenderwoche')

    const results = {}


    const message = await interaction.reply({
      content: `**Wochenplan für KW ${week}**\nBitte tragt eure Verfügbarkeiten von Montag bis Sonntag unten ein. ✅ setzt die komplette Woche auf verfügbar. 🧡\n_ _`,
      fetchReply: true
    })


    const emojiMo = message.guild.emojis.cache.find(emoji => emoji.name === 'montag')
    const emojiDi = message.guild.emojis.cache.find(emoji => emoji.name === 'dienstag')
    const emojiMi = message.guild.emojis.cache.find(emoji => emoji.name === 'mittwoch')
    const emojiDo = message.guild.emojis.cache.find(emoji => emoji.name === 'donnerstag')
    const emojiFr = message.guild.emojis.cache.find(emoji => emoji.name === 'freitag')
    const emojiSa = message.guild.emojis.cache.find(emoji => emoji.name === 'samstag')
    const emojiSo = message.guild.emojis.cache.find(emoji => emoji.name === 'sonntag')


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

      if (user.tag === 'Cypher#0563') return

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

      let final = `**Wochenplan für KW ${week}**\nBitte tragt eure Verfügbarkeiten von Montag bis Sonntag unten ein. ✅ setzt die komplette Woche auf verfügbar. 🧡\n\n${emojiMo} ${emojiDi} ${emojiMi} ${emojiDo} ${emojiFr} ${emojiSa} ${emojiSo}\n`
      for (const [key, value] of Object.entries(results)) {
        final += `${value} – ${key}\n`
      }

      message.edit(`${final.replaceAll(',', ' ')}\n_ _`)

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

      let final = `**Wochenplan für KW ${week}**\nBitte tragt eure Verfügbarkeiten von Montag bis Sonntag unten ein. ✅ setzt die komplette Woche auf verfügbar. 🧡\n\n${emojiMo} ${emojiDi} ${emojiMi} ${emojiDo} ${emojiFr} ${emojiSa} ${emojiSo}\n`
      for (const [key, value] of Object.entries(results)) {
        final += `${value} – ${key}\n`
      }

      message.edit(`${final.replaceAll(',', ' ')}\n_ _`)

    })

  }

})



const planCommand = new SlashCommandBuilder()
  .setName('plan')
  .setDescription('Erstelle einen Wochenplan')
  .addStringOption(option =>
    option
      .setName('kalenderwoche')
      .setDescription('Welche Kalenderwoche wird geplant?')
      .setRequired(true)
  )




const commands = [
  planCommand.toJSON()
]



try {

  await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
    body: commands
  })

} catch (error) { console.log(error) }



client.login(TOKEN)
