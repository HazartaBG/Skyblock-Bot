class ServerError {
  constructor(message) {
    this.message = message;
  }

  static invalidChannel(guild, channelId) {
    return new ServerError(
      'Invalid channel. Please send the command in ' +
        guild.channels.cache.get(channelId).toString()
    );
  }
}

exports.ServerError = ServerError;
