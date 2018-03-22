import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Router.route('/', function () {
    this.render("Home");
});

Router.route('/dashboard', function () {
    this.render("Dashboard");
});

Router.route('/reset', function () {
    this.render("Reset");
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
                return showAlert("signup-error", err.reason);
            }
            showAlert("signup-success", "Account Created");
        });
    }
});

Template.signInButton.events({
    'click button': (e) => {
        e.preventDefault();

        if (Meteor.user())
            return showAlert("signin-error", "Already logged in.");

        let user = {
            username: document.getElementById('iusername').value,
            password: document.getElementById('ipassword').value
        };

        Meteor.loginWithPassword(user.username, user.password, (error) => {
            if (error) {
                return showAlert("signin-error", error.reason);
            }
            showAlert("signin-error", "Successfully logged in.");
            Router.go("/dashboard");
        });

        console.log(Meteor.user());
    }
});

Template.forgotPasswordLink.events({
    'click': (e) => {
        e.preventDefault();
        Router.go("/reset");
    }
});

Template.sendResetEmail.events({
    'click button': () => {
        Accounts.forgotPassword({
            email: document.getElementById("email").value
        }, (err) => {
            if (err)
                return showAlert('reset-error', err.reason);
            showAlert('reset-success', "Password reset code sent.");
        });
    }
});
//
//Template.removeAccount.events({
//    'click button': () => {
//
//        if (!Meteor.user()) return alert("Not logged in")
//
//        Meteor.call('user.removeAccount', (error) => {
//            if (error) {
//                return alert(error);
//            }
//            alert("Deleted");
//        });
//    }
//});
//
//Template.logout.events({
//    'click button': () => {
//
//        if (!Meteor.user()) return alert("You are not logged in")
//
//        Meteor.logout((err) => {
//            if (err) return alert("Something went wrong");
//            alert("Logged out");
//        });
//    }
//});
//
//Template.changePassword.events({
//    'click button': () => {
//
//        Accounts.changePassword("faheem", "demo", (err) => {
//            if (err) return alert(err);
//
//            alert("Password changed");
//        })
//    }
//});
//
//Template.setPassword().events({
//    'click button': () => {
//        Accounts.resetPassword(token, newPassword, [callback])
//    }
//});

function resetAlerts() {
    setTimeout(() => {
        document.getElementById("signup-error").innerHTML = "";
        document.getElementById("signin-error").innerHTML = "";
        document.getElementById("signup-success").innerHTML = "";
        document.getElementById("signin-success").innerHTML = "";
    }, 2000);
}

function showAlert(type, err) {
    document.getElementById(type).innerHTML = err;
    resetAlerts();
}