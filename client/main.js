import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';

Router.route('/', function () {
    console.log(Meteor.user())
    if (Meteor.user())
        Router.go('/dashboard');
    else
        this.render("Home");
});

Router.route('/dashboard', function () {
    if (!Meteor.user())
        Router.go('/');
    else
        this.render("Dashboard");
});

Router.route('/reset', function () {
    this.render("Reset");
});

Router.route('/reset/new', function () {
    console.log(Session.get("passwordResetToken"));
    this.render("Reset-new");
});

Router.route('/logout', function () {
    Meteor.logout((err) => {
        if (err)
            console.log(err);
        else {
            Router.go('/');
        }
    });
});

Router.route('/change-password', function () {
    console.log("I was there")
    if (Meteor.user())
        //Router.go('/');
    console.log("You are logged in")
    else
        this.render("ChangePassword");
});

///////////////////////////
///////  EVENTS ///////////
///////////////////////////

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

///////////////////////////////
//// FORGOT PASSWORD //////////
//////////////////////////////

Template.forgotPasswordLink.events({
    'click': (e) => {
        e.preventDefault();
        Router.go("/reset");
    }
});

Template.sendResetEmail.events({
    'click button': (e) => {
        e.preventDefault();
        Accounts.forgotPassword({
            email: document.getElementById("email").value
        }, (err) => {
            if (err)
                return showAlert('reset-error', err.reason);
            showAlert('reset-success', "Please check your email for password reset link.", 3000);
        });
    }
});

Accounts.onResetPasswordLink(function (token, done) {
    Session.set("passwordResetToken", token);
    Router.go("/reset/new");
});

Template.resetPassword.events({
    'click button' : (e) => {
        e.preventDefault();
        let token = Session.get("passwordResetToken");
        let p = document.getElementById("newPassword").value;

        console.log(p);

        Accounts.resetPassword(token, p, function(err){
            if(err){
                showAlert('reset-error', err.reason);
            }
            else
                showAlert('reset-success', "Password successfully changed.");
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
//
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

function resetAlert(type, time) {
    setTimeout(() => {
        document.getElementById(type).innerHTML = "";;
    }, time || 2000);
}

function showAlert(type, err) {
    document.getElementById(type).innerHTML = err;
    resetAlert(type);
}