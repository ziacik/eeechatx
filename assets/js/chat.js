$(document).ready(function() {
	var SailsCollection = Backbone.Collection.extend({
	    sailsCollection: "",
	    socket: null,
	    where: { },
	    sync: function(method, model, options){
	        if (options.where) {
	            this.where = options.where;
	        }
	        if(typeof this.sailsCollection === "string" && this.sailsCollection !== "") {
	            this.socket = io.connect();
	            this.socket.on("connect", _.bind(function(){
	                this.socket.request("/" + this.sailsCollection, this.where, _.bind(function(models){
	                    this.set(models);
	                }, this));

	                this.socket.on("someoneDisconnected", _.bind(function(data) {
	                	alert('hey!');
	                }));

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
	    model: MessageModel,
	    where: { createdAt : { '>' : Date.today() } }
	});

	var MessagesView = Backbone.View.extend({
		el : '#messagesContainer',
		initialize : function() {
			this.collection.on('change reset add remove', this.render, this);
			this.render();
		},
		template : _.template($("#messageTemplate").html()),
		render : function(model, x, y) {
			if (model && model.id) {
				var modelObj = model.toJSON();
				var user = users.get(modelObj.sender);
				var data = { model : modelObj, user : user.toJSON(), renderUser : renderUserTemplate };
				var messageElement = $("#Message" + model.id, this.$el);

				if (messageElement.length > 0)
					messageElement = messageElement.html(this.template(data));
				else
					messageElement = this.$el.append(this.template(data));

				$('.messageInput', $(messageElement)).editable({ success: send, rows: 2 });
				$('#newMessageInput').editable('show');
			}
		}
	});

	var messages = new MessageCollection();

	var messagesView = new MessagesView({
		collection : messages
	});

	messages.fetch();

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
	
	var users = new UserCollection();

	var usersView = new UsersView({
		collection : users
	});

	users.fetch();	

	var renderUserTemplate = _.template($("#userTemplate").html());

	$.fn.editable.defaults.mode = 'inline';

	var send = function(response, newValue) {
		var id = $(this).attr('data-pk');

		if (id) {
			var message = messages.get(id);
			message.save({ content: newValue });
		} else {
			messages.create({ content: newValue });
			$('#newMessageInput').editable('setValue', null);
		}
	}

	$('#newMessageInput').editable({
		success: send,
		rows: 2
	});

	$('#newMessageInput').editable('show');
});