export class Command {

  constructor ({
    commandName,
    commandDescription
  }) {
    this.commandName = commandName
    this.commandDescription = commandDescription
  }


  get help () {
    return `**/${this.commandName}** – Help\n${this.commandDescription}`
  }

}
