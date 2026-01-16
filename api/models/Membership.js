const LocalStorageModel = require('./LocalStorageModel');

class Membership extends LocalStorageModel {
    constructor() {
        super('memberships');
    }
}

module.exports = new Membership();
