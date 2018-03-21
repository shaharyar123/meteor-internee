import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.signUp.events({
    'click button': () => {
        let user = {
            username: "faheem",
            password: "faheem",
            name: "Muhammad Faheem Akhtar",
            city: "Karachi"
        };
        Meteor.call('user.signUp', {user}, (err) => {
            if (err) {
                return alert(err.reason);
            }
            alert("Account created.");
        });
    }
});

Template.signIn.events({
    'click button': () => {
        let user = {
            username: "faheem",
            password: "faheem"
        };
        //Meteor.call('user.signIn', {user}, (err) => {
        //    if(err){
        //        return alert(err.reason);
        //    }
        //    alert("Logged in.");
        //});

        Meteor.loginWithPassword(user.username, user.password, (error) => {
            if (error) {
                return alert(error.reason);
            }
            alert("Logged in");
        });

        console.log(currentUser)
    }
});