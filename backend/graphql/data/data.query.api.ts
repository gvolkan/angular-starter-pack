import mongoose = require("mongoose");

export class DataQueryApi<T extends mongoose.Document> {

    public model: mongoose.Model<mongoose.Document>;

    constructor(schemaModel: mongoose.Model<mongoose.Document>) {
        this.model = schemaModel;
    }

    getModel() {
        return this.model;
    }

    create(item: T) {
        return this.model.create(item);
    }

    createMany(items: T[]) {
        return this.model.create(items);
    }

    update(_id: mongoose.Types.ObjectId, item: T) {
        this.model.update({ _id: _id }, item);
    }

    delete(_id: mongoose.Types.ObjectId, item: T) {
        this.model.update({ _id: _id }, item);
    }

    retrieve(limit?: number, skip: number = 0, criteria: any = {}, sort: any = { itemCreatedTimestamp: -1 }, populate: string = "") {
        if (limit) {
            return this.model.find(criteria).populate(populate).sort(sort).limit(limit).skip(skip);
        } else {
            return this.model.find(criteria).populate(populate).sort(sort);
        }
    }
}