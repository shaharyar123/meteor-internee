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
        'user.email': SimpleSchema.RegEx.EmailWithTLD,
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

        if (Meteor.user())
            throw new Meteor.Error('user.signUp.already', "Please logout to create a new account");

        try {
            Accounts.createUser({
                username: user.username,
                password: user.password,
                email: user.email,
                profile: {
                    name: user.name,
                    city: user.city
                }
            });
        }
        catch(err){
            throw new Meteor.Error("error", err.reason);
        }

        if (!user) {
            throw new Meteor.Error("user.signUp.error", "Failed to create an account.");
        }
    }
});

export const removeAccount = new ValidatedMethod({
    name: 'user.removeAccount',
    validate: null,
    run: function () {
        if (!Meteor.user())
            throw new Error('user.removeAcccount.notLoggedIn', "Login to delete your account")

        try {
            Meteor.users.remove({username: Meteor.user().username});
        }
        catch (error) {
            throw new Error('user.removeAccount.error', "Failed to delete account");
        }
    }
});