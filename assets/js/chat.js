$(document).ready(function() {

	var UserModel = Backbone.Model.extend({
		urlRoot : '/user',
	});

	var UserCollection = Backbone.Collection.extend({
		url : '/user',
		model : UserModel
	});

	// var MessageModel = Backbone.Model.extend({
	// urlRoot : '/message',
	// });
	//
	// var MessageCollection = Backbone.Collection.extend({
	// url : '/message',
	// model : MessageModel
	// });

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

	var users = new UserCollection();

	var mView = new UsersView({
		collection : users
	});

	users.fetch();

//	var UsersView = Backbone.View.extend({
//
//		el : $('#usersContainer'),
//
//		initialize : function() {
//			var self = this;
//			this.collection = new UserCollection();
//			this.collection.fetch().done(function() {
//				self.render();
//			});
//
//		},
//		render : function() {
//			this.collection.each(function(user) {
//				var template = _.template($("#userTemplate").html(), user);
//				alert(template);
//				$("#usersContainer").append(template);
//			});
//		}
//	});
//
//	new UsersView();
	// usersView.render();

	/*
	 * $("#postMessageButton").click(function(){ var messageText =
	 * $("#message").val(); messages.create({message: messageText}, {wait:
	 * true}); $("#message").val(""); });
	 */
});