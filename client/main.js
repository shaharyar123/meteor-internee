import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Router.route('/', function () {
    this.render("Home");
});

Template.signUpButton.events({
    'click button': (e)=> {
        e.preventDefault();

        let user = {
            username: document.getElementById('uusername').value,
            email: document.getElementById('uemail').value,
            password: document.getElementById('upassword').value,
            name: document.getElementById('uname').value,
            city: document.getElementById('ucity').value
        };

        Meteor.call('user.signUp', {user}, (err) => {
            if (err) {
                resetErrors();
                return document.getElementById("signup-error").innerHTML = err.reason;
            }
            document.getElementById("signup-success").innerHTML = "Account Created.";
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

        if (!Meteor.user()) return alert("Not logged in")

        Meteor.call('user.removeAccount', (error) => {
            if (error) {
                return alert(error);
            }
            alert("Deleted");
        });
    }
});

Template.logout.events({
    'click button': () => {

        if (!Meteor.user()) return alert("You are not logged in")

        Meteor.logout((err) => {
            if (err) return alert("Something went wrong");
            alert("Logged out");
        });
    }
});

Template.changePassword.events({
    'click button': () => {

        Accounts.changePassword("faheem", "demo", (err) => {
            if (err) return alert(err);

            alert("Password changed");
        })
    }
});

Template.resetPassword.events({
    'click button': () => {

        Accounts.forgotPassword({
            email: "hello@MFaheemAkhtar.com"
        }, (err) => {
            if (err) return alert(err);
            alert("Sent password reset email");
        });
    }
});

Template.setPassword().events({
    'click button': () => {
        Accounts.resetPassword(token, newPassword, [callback])
    }
});

function resetErrors () {
    setTimeout(() => {
        document.getElementById("signup-error").innerHTML = "";
        document.getElementById("signin-error").innerHTML = "";
    }, 3000);
}