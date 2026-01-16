const LocalStorageModel = require('./LocalStorageModel');

class User extends LocalStorageModel {
    constructor() {
        super('users');
    }
}

module.exports = new User();
