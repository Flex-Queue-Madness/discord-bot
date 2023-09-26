const {BOT_TOKEN, BOT_ID, RP_TYPE, RP_NAME, GUILD_ID} = process.env

import { Client, GatewayIntentBits, Routes } from 'discord.js'
import { REST } from '@discordjs/rest'

import * as commands from './commands'

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



client.on('ready', () => { console.log(`${client.user.tag} successfully logged in.`) })





const slashCommands = []

for (const key in commands) {

  const command = commands[key].buildCommand()
  slashCommands.push(command.toJSON())

}


try {

  await rest.put(Routes.applicationGuildCommands(BOT_ID, GUILD_ID), {
    body: slashCommands
  })

} catch (error) { console.log(error) }





client.on('interactionCreate', async interaction => {

  if (!interaction.isChatInputCommand()) return

  if (commands[interaction.commandName]) commands[interaction.commandName].execute(interaction)

})





client.login(BOT_TOKEN)
