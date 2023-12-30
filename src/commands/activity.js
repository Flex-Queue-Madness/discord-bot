const { ActivityType } = require('discord.js')

import { Command } from '../command.class.js'


const commandMeta = {
  commandName: 'activity',
  commandDescription: 'Setzt einen neuen Status.',
  commandArguments: [
    {
      argumentName: 'type',
      argumentDescription: '0 playing – 1 streaming – 2 listening – 3 watching – 5 competing',
      argumentRequired: true
    },
    {
      argumentName: 'status',
      argumentDescription: 'Statustext',
      argumentRequired: true
    }
  ]
}


class Activity extends Command {

  #setActivity (interaction) {

    const type   = interaction.options.getString('type')
    const status = interaction.options.getString('status')

    return interaction.client.user.setPresence({
      activities: [{ name: status, type: +type }],
      status: 'online',
    })

  }


  async execute (interaction) {

    this.#setActivity(interaction)
    return interaction.reply({content: 'Status updated', ephemeral: true})

  }

}


export const activity = new Activity (commandMeta)
