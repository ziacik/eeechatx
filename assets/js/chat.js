$(document).ready(function() {
	var SailsCollection = Backbone.Collection.extend({
	    sailsCollection: "",
	    socket: null,
	    sync: function(method, model, options){
	        var where = { createdAt : { '>' : '2014-04-19' } }; //TODO hardcoded
	        if (options.where) {
	            where = {
	                where: options.where
	            };
	        }
	        if(typeof this.sailsCollection === "string" && this.sailsCollection !== "") {
	            this.socket = io.connect();
	            this.socket.on("connect", _.bind(function(){
	                this.socket.request("/" + this.sailsCollection, where, _.bind(function(users){
	                    this.set(users);
	                }, this));

	                this.socket.on("message", _.bind(function(msg){
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
		
	var UsersView = Backbone.View.extend({
		el : '#usersContainer',
		initialize : function() {
			this.collection.on('change reset add remove', this.render, this);
			this.render();
		},
		template : _.template($("#userTemplate").html()),
		render : function() {
			this.$el.html("");
			this.collection.each(function(msg) {
				var data = { model : msg.toJSON(), options : { size : 32 } };
				this.$el.append(this.template(data));
			}, this);
		}
	});

	var renderUserTemplate = _.template($("#userTemplate").html());

	var MessagesView = Backbone.View.extend({
		el : '#messagesContainer',
		initialize : function() {
			this.collection.on('change reset add remove', this.render, this);
			this.render();
		},
		template : _.template($("#messageTemplate").html()),
		render : function(model, x, y) {
			if (model && model.id) {
				var data = { model : model.toJSON(), renderUser : renderUserTemplate };				
				var messageElement = $("#Message" + model.id, this.$el);
				
				if (messageElement.length > 0)
					messageElement = messageElement.html(this.template(data));
				else				
					messageElement = this.$el.append(this.template(data));					
					
				$('.messageInput', $(messageElement)).editable({ success: send });		
				$('#newMessageInput').editable('show');		
			}			
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

	$.fn.editable.defaults.mode = 'inline';

	var send = function(response, newValue) {		
		var id = $(this).attr('data-pk');
		
		if (id) {
			var message = messages.get(id);
			message.save({ content: newValue });
		} else {
			messages.create({sender:'kolik', content: newValue});
		}
	}
	
	$('#newMessageInput').editable({
		success: send
	});
	
	$('#newMessageInput').editable('show');
});