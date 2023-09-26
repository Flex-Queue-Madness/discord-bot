const {BOT_TOKEN, BOT_ID, RP_TYPE, RP_NAME, GUILD_ID} = process.env

import { Client, GatewayIntentBits, Routes } from 'discord.js'
import { REST } from '@discordjs/rest'
import { SlashCommandBuilder } from '@discordjs/builders'

import { plan } from './commands/plan.js'

const rest = new REST({ version: '10'}).setToken(BOT_TOKEN)


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ],
  presence: {
    activities: [{
      // The plus sign converts the format from string to number.
      type: +RP_TYPE,
      name: RP_NAME
    }]
  }
})



client.on('ready', () => {
  console.log(`${client.user.tag} successfully logged in.`)
})



client.on('interactionCreate', async interaction => {

  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'plan') {

    plan(interaction)

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

  await rest.put(Routes.applicationGuildCommands(BOT_ID, GUILD_ID), {
    body: commands
  })

} catch (error) { console.log(error) }



client.login(BOT_TOKEN)
