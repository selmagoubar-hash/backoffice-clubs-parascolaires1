const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class LocalStorageModel {
    constructor(collectionName) {
        this.collectionName = collectionName;
    }

    _applySelect(items, selectStr) {
        if (!selectStr) return items;
        const fields = selectStr.split(' ');
        const exclude = fields.every(f => f.startsWith('-'));

        return items.map(item => {
            const newItem = { ...item };
            if (exclude) {
                fields.forEach(f => delete newItem[f.substring(1)]);
            } else {
                // Not implementing inclusive select for now as not needed yet
            }
            return newItem;
        });
    }

    async find(query = {}) {
        let items = db.get(this.collectionName);
        if (Object.keys(query).length > 0) {
            items = items.filter(item => {
                return Object.entries(query).every(([key, value]) => {
                    if (item[key] === undefined) return false;
                    return item[key].toString() === value.toString();
                });
            });
        }

        // Return array with mock methods
        const result = items.map(item => this._wrap(item));
        result.populate = () => result;
        result.select = (str) => this._applySelect(result, str);
        return result;
    }

    _wrap(item) {
        if (!item) return null;
        const wrapped = { ...item };
        // Add save method
        wrapped.save = async () => this.findByIdAndUpdate(wrapped._id, wrapped);
        // Add select method
        wrapped.select = (str) => {
            const results = this._applySelect([wrapped], str);
            return results[0];
        };
        // Mock populate to return self (simple fix)
        wrapped.populate = () => wrapped;
        return wrapped;
    }

    async findOne(query) {
        const items = await this.find(query);
        return items[0] || null;
    }

    async findById(id) {
        const items = db.get(this.collectionName);
        const item = items.find(item => item._id === id || item.id === id) || null;
        return this._wrap(item);
    }

    async create(data) {
        const items = db.get(this.collectionName);
        const newItem = {
            ...data,
            _id: data._id || data.id || uuidv4(),
            id: data.id || data._id || uuidv4(),
            createdAt: new Date(),
            attendees: data.attendees || [] // Ensure arrays exist for events
        };
        items.push(newItem);
        db.save(this.collectionName, items);

        return this._wrap(newItem);
    }

    async findByIdAndUpdate(id, updateData, options = {}) {
        const items = db.get(this.collectionName);
        const index = items.findIndex(item => item._id === id || item.id === id);
        if (index === -1) return null;

        items[index] = { ...items[index], ...updateData };
        db.save(this.collectionName, items);
        return items[index];
    }

    async findByIdAndDelete(id) {
        const items = db.get(this.collectionName);
        const index = items.findIndex(item => item._id === id || item.id === id);
        if (index === -1) return null;

        const deletedItem = items.splice(index, 1)[0];
        db.save(this.collectionName, items);
        return deletedItem;
    }
}

module.exports = LocalStorageModel;
