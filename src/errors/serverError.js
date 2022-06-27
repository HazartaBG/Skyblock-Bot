class ServerError {
  constructor(message, flag = 'none') {
    this.message = message;
    this.flag = flag;
  }

  static invalidChannel(guild, channelId) {
    return new ServerError(
      'Invalid channel. Sent the command in ' +
        guild.channels.cache.get(channelId).toString(),
      'ephemeral'
    );
  }
}

exports.ServerError = ServerError;
