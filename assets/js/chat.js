$(document).ready(function() {

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

	var MessageCollection = Backbone.Collection.extend({
		url : '/message',
		model : MessageModel
	});

	_.templateSettings = {
		interpolate : /\{\{(.+?)\}\}/g
	};

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

	/*
	 * $("#postMessageButton").click(function(){ var messageText =
	 * $("#message").val(); messages.create({message: messageText}, {wait:
	 * true}); $("#message").val(""); });
	 */
});