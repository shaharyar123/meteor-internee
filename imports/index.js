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
        'user.password': String
    }).validator(),
    run: function({user}){
        console.log(user);

        let newUser = Accounts.createUser({
            username: user.username,
            password: user.password
        });

        console.log(newUser);
        console.log("Users so far: ", Meteor.users)
    }
});