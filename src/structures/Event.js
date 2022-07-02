class Event {
  constructor(name, callback) {
    if (typeof callback != 'function') {
      throw new Error('Callback must be a function');
    }

    if (typeof name != 'string') {
      throw new Error('Name must be a string');
    }

    this.name = name;
    this.callback = callback;
  }
}

exports.Event = Event;
