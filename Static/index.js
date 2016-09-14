(function(){
    var templates = document.querySelectorAll('script[type="text/handlebars"]');

    Handlebars.templates = Handlebars.templates || {};

    Array.prototype.slice.call(templates).forEach(function(script){
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    })


    var Router = Backbone.Router.extend({
        routes: {
            "/frank" : "/frank",
            "/login" : "/login"
        }
    })

    var router = new Router();

    Backbone.history.start();

    var UserModel = Backbone.Model.extend({
        initialize: function() {
        },
            url: "/frank"
    })

     var userModel = new UserModel();

    var UsersView = Backbone.View.extend({
        initialize: function() {
            this.render();
        },
        render: function() {
            console.log("render just ran");
            this.$el.html(Handlebars.templates.falls())
        },
        el: "#main"
    })
    new UsersView();
})();
