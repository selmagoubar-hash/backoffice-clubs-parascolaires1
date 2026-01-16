const LocalStorageModel = require('./LocalStorageModel');

class Club extends LocalStorageModel {
    constructor() {
        super('clubs');
    }
}

module.exports = new Club();
