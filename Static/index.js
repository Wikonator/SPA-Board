(function(){
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

        },

        url: "/homepage"
    });

    var LoginModel = Backbone.Model.extend({
        initialize: function(){

        },

        url: "/login"
    });

     var HomePageView = Backbone.View.extend({
         initialize: function () {
             this.render();
            //  console.log("ding dong");
         },
         render: function () {
             this.$el.html(Handlebars.templates.homePage())
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
            this.$el.html(Handlebars.templates.login());
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

    var Router = Backbone.Router.extend({
        routes: {
            "homepage" : "homepage",
            "registration" : "register",
            "login" : "login"
        },
        register : function() {
            var regModel = new RegistrationModel();
            new registrationView({
                model: regModel
            });
        },
        homepage : function() {
            var homeModel = new HomePageModel();
            new HomePageView({
                model: homeModel
            });
        },
        login : function() {
            var loginModel = new LoginModel();
            new loginView({
                model: loginModel
            });
        }
    });

    var router = new Router();

    Backbone.history.start();

})();
