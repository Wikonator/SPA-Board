(function(){
    var isLoggedIn;
    var templates = document.querySelectorAll('script[type="text/handlebars"]');

    Handlebars.templates = Handlebars.templates || {};

    Array.prototype.slice.call(templates).forEach(function(script){
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    })


    var RegistrationModel = Backbone.Model.extend({
        initialize: function() {

        },

        url: "/register"
    });

    var HomePageModel = Backbone.Model.extend({
        initialize: function(){
            console.log("yo i got intialized");
        },

        url: "/homepage"
    });

    var LoginModel = Backbone.Model.extend({
        initialize: function(){

        },

        url: "/login"
    });

    var LogoutModel = Backbone.Model.extend({
        initialize: function(){

        },

        url: "/logout"
    });

     var HomePageView = Backbone.View.extend({
         initialize: function () {
             this.render();
            //  console.log("ding dong");
         },
         render: function () {
             this.$el.html(Handlebars.templates.homePage())
         },
         events: {
             "click #logoutButton": "goLogout"
         },
         goLogout: function () {
             console.log("loggin out");
             window.location.hash = "logout";
         },
         el: "#main",
     });

    var registrationView = Backbone.View.extend({
        initialize: function() {
            this.render();
        },
        render: function() {
            this.$el.html(Handlebars.templates.falls());
        },
        events: {
            "click #submitButton": "saveThisAndGo"
        },
        saveThisAndGo: function() {
            console.log("I was clicked!");
            this.model.save({
                "email" : $('#email').val(),
                "usename": $('#usename').val(),
                "pass" : $('#pass').val()
            },
            {
                error: function(){
                    console.log("error");
                },
                success: function() {
                    console.log("success");
                    window.location.hash = "homepage";
                }
            });
        },
        el: "#main",
    });

    var loginView = Backbone.View.extend({
        initialize: function() {
            this.render();
        },
        render: function() {
            console.log(window.location.search);
            if (window.location.search === "?notloggedin=true") {
            var displayWarning = true;
            } else {
                var displayWarning = false;
            }
                this.$el.html(Handlebars.templates.login({
                    warning: displayWarning
                }));
        },
        events: {
            "click #goButton": "checkThisAndGo"
        },
        checkThisAndGo: function() {
            this.model.save({
                "usename": $("#usename").val(),
                "pass": $("#pass").val()
            })
        },
        el: "#main"
    });

    var logoutView = Backbone.View.extend({
        initialize: function() {
            this.render();
        },
        render: function () {
            this.$el.html(Handlebars.templates.logout());
        },
        el: "#main"
    });


     $.getJSON("/isLoggedIn").done(function(response){
         isLoggedIn = response.user

    var Router = Backbone.Router.extend({
        routes: {
            "homepage" : "homepage",
            "registration" : "register",
            "login" : "login",
            "logout" : "logout"
        },
        register : function() {
            if(!isLoggedIn) {
                var regModel = new RegistrationModel();
                new registrationView({
                    model: regModel
                });
            } else {
                router.homepage();
            }
        },
        homepage : function() {
            if (isLoggedIn) {
                var homeModel = new HomePageModel();
                new HomePageView({
                    model: homeModel
                });
            } else {
                router.login();
            }
        },
        login : function() {
            if (!isLoggedIn) {
                    var loginModel = new LoginModel();
                    new loginView({
                        model: loginModel
                    });
                } else {
                    router.homepage();
                }
        },
        logout : function() {
            isLoggedIn = false;
            var logoutModel = new LogoutModel();
            new logoutView({
                model: logoutModel
            });
        }
    });
    var router = new Router();

    Backbone.history.start();
     });



})();
