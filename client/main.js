import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';

//////////////////////////////////////////////////////
////////////////     ROUTES       ////////////////////
//////////////////////////////////////////////////////

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
    if(Meteor.user() !== undefined){
        if (!Meteor.user())
            Router.go('/');
        //console.log("You are logged in")
        else
            this.render("ChangePassword");
    }
});

//////////////////////////////////////////////////////
////////////////     SIGNUP       ////////////////////
//////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////
////////////////     SIGNIN       ////////////////////
//////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////
///////////     FORGOT PASSWORD       ////////////////
//////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////
///////////     CHANGE PASSWORD       ////////////////
//////////////////////////////////////////////////////

Template.ChangePasswordButton.events({
    'click button'(event, instance){
        event.preventDefault();
        let oldPassword = document.getElementById("oldPassword").value,
            newPassword = document.getElementById("newPassword").value

        Accounts.changePassword(oldPassword, newPassword, (err, res) => {
            if(err) return showAlert("change-error", "Failed to change password");
            showAlert("change-success", "Password changed");
        });
    }
});


//////////////////////////////////////////////////////
////////////////     HELPERS       ///////////////////
//////////////////////////////////////////////////////

function resetAlert(type, time) {
    setTimeout(() => {
        document.getElementById(type).innerHTML = "";;
    }, time || 2000);
}

function showAlert(type, err) {
    document.getElementById(type).innerHTML = err;
    resetAlert(type);
}


Template.DashboardFormSubmit.events({
    'click button'(event) {
        event.preventDefault();

        let todo = {
            text: "Hi"
        };

        Meteor.call('todo.add', { todo });


    }
});

console.log(Meteor.subscribe('todos'));