$(document).ready(function() {
	console.log('Qq');

	var SailsCollection = Backbone.Collection.extend({
	    sailsCollection: "",
	    socket: null,
	    sync: function(method, model, options){
	    	console.log('sync');
	        var where = {};
	        if (options.where) {
	            where = {
	                where: options.where
	            };
	        }
	        if(typeof this.sailsCollection === "string" && this.sailsCollection !== "") {
	        	console.log('gonna connect');
	            this.socket = io.connect();
	            this.socket.on("connect", _.bind(function(){
		        	console.log('connected');
	                this.socket.request("/" + this.sailsCollection, where, _.bind(function(users){
			        	console.log('users');
	                    this.set(users);
	                }, this));

	                this.socket.on("message", _.bind(function(msg){
			        	console.log('message');
	                    var m = msg.verb;
	                    if (m === "create") {
	                        this.add(msg.data);
	                    } else if (m === "update") {
	                        this.get(msg.data.id).set(msg.data);
	                    } else if (m === "destroy") {
	                        this.remove(this.get(msg.data.id));
	                    }
	                }, this));
	            }, this));
	        } else {
	            console.log("Error: Cannot retrieve models because property 'sailsCollection' not set on the collection");
	        }
	    }
	});

	var UserModel = Backbone.Model.extend({
		urlRoot : '/user',
	});

	var UserCollection = Backbone.Collection.extend({
		url : '/user',
		model : UserModel
	});

	var MessageModel = Backbone.Model.extend({
		urlRoot : '/message',
	});

	var MessageCollection = SailsCollection.extend({
	    sailsCollection: 'message',
	    model: MessageModel
	});

//	_.templateSettings = {
//		interpolate : /\{\{(.+?)\}\}/g
//	};

	var UsersView = Backbone.View.extend({
		el : '#usersContainer',
		initialize : function() {
			this.collection.on('add', this.render, this);
			this.render();
		},
		template : _.template($("#userTemplate").html()),
		render : function() {
			this.$el.html("");
			this.collection.each(function(msg) {
				this.$el.append(this.template(msg.toJSON()));
			}, this);
		}
	});

	var MessagesView = Backbone.View.extend({
		el : '#messagesContainer',
		initialize : function() {
			this.collection.on('add', this.render, this);
			this.render();
		},
		template : _.template($("#messageTemplate").html()),
		render : function() {
			this.$el.html("");
			this.collection.each(function(msg) {
				this.$el.append(this.template(msg.toJSON()));
			}, this);
		}
	});

	var users = new UserCollection();

	var usersView = new UsersView({
		collection : users
	});

	users.fetch();

	var messages = new MessageCollection();

	var messagesView = new MessagesView({
		collection : messages
	});

	messages.fetch();


	$("#sendButton").click(function() {
		var messageText = $("#message").val();
		messages.create({sender:'kolik', content: messageText}, {wait: true});
		$("#message").val("");
	});
});