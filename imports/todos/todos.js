import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class TodosCollection extends Mongo.Collection {
}

export const Todos = new TodosCollection('todos');

// Deny all client-side updates since we will be using methods to manage this collection
Todos.deny({
    insert() {
        return true;
    },
    update() {
        return true;
    },
    remove() {
        return true;
    }
});

Todos.schema = new SimpleSchema({

    'text' : "String",
    'isCompleted': {
        type: "Boolean",
        defaultValue: false
    },
    userId: "String",

    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            } else {
                this.unset();
            }
        }
    },
    updatedAt: {
        type: Date,
        autoValue: function () {
            if (this.isUpdate) {
                return new Date();
            }
        },
        optional: true
    }
});

Todos.attachSchema(Todos.schema);