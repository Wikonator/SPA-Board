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





// window.location.hash = "registration";



     var HomePageView = Backbone.View.extend({
         initialize: function () {
             this.render();
             console.log("ding dong");
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
        events: {"click #submitButton": "saveThis"
        },
        saveThis: function() {
        //
            this.model.save({
                "usename": $('#usename').val(),
                "pass" : $('#pass').val()
            });
        },
        el: "#main",
    })


    var Router = Backbone.Router.extend({
        routes: {
            "homepage" : "homepage",
            "registration" : "register"
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
        }
    });

    var router = new Router();

    Backbone.history.start();

})();
