const LocalStorageModel = require('./LocalStorageModel');

class Event extends LocalStorageModel {
    constructor() {
        super('events');
    }
}

module.exports = new Event();
