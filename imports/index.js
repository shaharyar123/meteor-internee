import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';

// simple method
//Meteor.methods({
//    printCurrentUser(){
//        console.log("Working");
//    }
//});

export const signUp = new ValidatedMethod({
    name: 'user.signUp',
    validate: new SimpleSchema({
        user: Object,
        'user.username': String,
        'user.password': String,
        'user.name': {
            type: String,
            optional: true
        },
        'user.city': {
            type: String,
            optional: true
        }
    }).validator(),
    run: function ({user}) {

        let newUser = Accounts.createUser({
            username: user.username,
            password: user.password,
            profile: {
                name: user.name,
                city: user.city
            }
        });

        if (!user) {
            throw new Meteor.Error("user.signUp.error", "Failed to create an account.");
        }
    }
});

// We already have builtin login feature from client side
//export const signIn = new ValidatedMethod({
//    name: 'user.signIn',
//    validate: new SimpleSchema({
//        user: Object,
//        'user.username': String,
//        'user.password': String
//    }).validator(),
//    run: function({user}){
//
//        Meteor.loginWithPassword(user.username, user.password,(Error) => {
//           if(Error){
//               throw new Meteor.Error("user.signIn.error", "Failed to login to the account.");
//           }
//        });
//    }
//});