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
        if (Meteor.user())
            return alert("You are already logged in");

        let user = {
            username: "faheem",
            password: "faheem"
        };

        Meteor.loginWithPassword(user.username, user.password, (error) => {
            if (error) {
                return alert(error.reason);
            }
            alert("Logged in");
        });

        console.log(Meteor.user());
    }
});

Template.removeAccount.events({
    'click button': () => {

        if(!Meteor.user()) return alert("Not logged in")

        Meteor.call('user.removeAccount', (error) => {
            if(error){
                return alert(error);
            }
            alert("Deleted");
        });
    }
});

Template.logout.events({
    'click button': () => {

        if(!Meteor.user()) return alert("You are not logged in")

        Meteor.logout((err) => {
            if(err) return alert("Something went wrong");
            alert("Logged out");
        });
    }
});

Template.changePassword.events({
    'click button': () => {

        Accounts.changePassword("faheem", "demo", (err) => {
            if(err) return alert(err);

            alert("Password changed");
        })
    }
});