import { SlashCommandBuilder } from '@discordjs/builders'


export class Command {

  #name
  #description
  #arguments

  constructor ({
    commandName,
    commandDescription,
    commandArguments
  }) {
    this.#name = commandName
    this.#description = commandDescription
    this.#arguments = commandArguments
  }


  get name () { return this.#name }
  get description () { return this.#description }
  get arguments () { return this.#arguments }


  buildCommand () {

    const build = new SlashCommandBuilder()

    build.setName(this.#name)
    build.setDescription(this.#description)

    for (const argument of this.#arguments) {

      const { argumentName, argumentDescription, argumentRequired } = argument

      build.addStringOption(option =>
        option
          .setName(argumentName)
          .setDescription(argumentDescription)
          .setRequired(argumentRequired)
      )

    }

    return build

  }

}
