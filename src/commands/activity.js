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

    try {

      interaction.client.user.setPresence({
        activities: [{ name: status, type: +type }],
        status: 'online',
      })

      return true

    } catch (error) {

      console.log(error)
      return false

    }

  }


  async execute (interaction) {

    const newActivity = this.#setActivity(interaction)
    const reply = newActivity ? 'Neuer Status gesetzt' : 'Da ist etwas schief gelaufen...'

    return interaction.reply({content: reply, ephemeral: true})

  }

}


export const activity = new Activity (commandMeta)
