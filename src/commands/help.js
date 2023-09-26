import { EmbedBuilder } from 'discord.js'

const { BOT_NAME } = process.env
import { Command } from '../command.class.js'
import * as commands from './'


const commandMeta = {
  commandName: 'help',
  commandDescription: 'Hilfestellung zu den verfügbaren Commands.',
  commandArguments: [
    {
      argumentName: 'command',
      argumentDescription: 'Spezifiziere einen Command',
      argumentRequired: false
    }
  ]
}


class Help extends Command {


  #commandList (interaction) {

    const reply = new EmbedBuilder()

    reply.setColor(0x0099FF)
    reply.setTitle(`${BOT_NAME.split('#')[0]} – Commands`)

    let commandList = ''
    for (const key in commands) {
      commandList += `${commands[key].name}\n`
    }

    reply.setDescription(commandList)
    reply.setFooter({ text: 'Für weitere Informationen nutze `/help <command name>`.' })

    return interaction.reply({ embeds: [reply] })

  }


  #commandHelp (interaction, command) {

    const reply = new EmbedBuilder()

    reply.setColor(0x0099FF)
    reply.setTitle(commands[command].name)
    reply.setDescription(`
      ${commands[command].description}\n
      ${commands[command].arguments ? 'Argumente:' : 'Dieser Command hat keine weiteren Argumente.'}
    `)

    for (const arg of commands[command].arguments) {
      reply.addFields({
        name: `${arg.argumentName}${arg.argumentRequired ? '*' : ''}`,
        value: arg.argumentDescription
      })
    }

    reply.setFooter({ text: '* notwendig' })

    return interaction.reply({ embeds: [reply] })

  }


  async execute (interaction) {

    const command = interaction.options.getString('command')

    if (!command) return this.#commandList(interaction)
    return this.#commandHelp(interaction, command)

  }

}


export const help = new Help (commandMeta)
