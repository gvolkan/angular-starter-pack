import mongoose = require("mongoose");

export class DataQueryApi<T extends mongoose.Document> {

    public model: mongoose.Model<mongoose.Document>;

    constructor(schemaModel: mongoose.Model<mongoose.Document>) {
        this.model = schemaModel;
    }

    getModel() {
        return this.model;
    }

    create(item: T, callback: (error: any, result: any) => void) {
        return this.model.create(item, callback);
    }

    createMany(items: T[], callback: (error: any, result: any) => void) {
        return this.model.create(items, callback);
    }

    update(_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
        this.model.update({ _id: _id }, item, callback);
    }

    delete(_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
        this.model.update({ _id: _id }, item, callback);
    }

    retrieve(callback: (error: any, result: T[]) => void, limit?: number, skip: number = 0, criteria: any = {}, sort: any = { itemCreatedTimestamp: -1 }, populate: string = "") {
        if (limit) {
            return this.model.find(criteria, callback).populate(populate).sort(sort).limit(limit).skip(skip);
        } else {
            return this.model.find(criteria, callback).populate(populate).sort(sort);
        }
    }

    retrieveOne(callback: (error: any, result: T) => void, criteria: any = {}, populate: string = "") {
        return this.model.findOne(criteria, callback).populate(populate);
    }
}