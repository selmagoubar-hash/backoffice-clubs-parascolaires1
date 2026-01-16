const { LocalStorage } = require('node-localstorage');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataPath = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
}

const localStorage = new LocalStorage(dataPath);

const db = {
    get: (collection) => {
        const data = localStorage.getItem(collection);
        return data ? JSON.parse(data) : [];
    },
    save: (collection, data) => {
        localStorage.setItem(collection, JSON.stringify(data));
    }
};

console.log('✅ LocalStorage DB Initialized at:', dataPath);

module.exports = db;
