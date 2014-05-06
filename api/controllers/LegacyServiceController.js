/**
 * LegacyServiceController
 * 
 * @module :: Controller
 * @description :: A set of functions called `actions`.
 * 
 * Actions contain code telling Sails how to respond to a certain type of
 * request. (i.e. do stuff, then send some JSON, show an HTML page, or redirect
 * to another URL)
 * 
 * You can configure the blueprint URLs which trigger these actions
 * (`config/controllers.js`) and/or override them with custom routes
 * (`config/routes.js`)
 * 
 * NOTE: The code you write here supports both HTTP and Socket.io automatically.
 * 
 * @docs :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	"getUser.php" : function(req, res) {
		var login = req.param("login");
		User.findOneByName(login).done(function(err, usr) {
		    if (err) {
		        res.send(500, { error: "DB Error" });
		    } else {
		        if (usr) {
					res.header('Content-Type', 'application/xml');
					return res.view('legacy/user', { user: usr });
		        } else {
		            res.send(404, { error: "User not Found" });
		        }		        
		    }
		});
	},

	"getRooms.php" : function(req, res) {
		res.header('Content-Type', 'application/xml');
		return res.view('legacy/rooms');
	},
	
	"getUsers.php" : function(req, res) {
		User.find({}, function(err, users) { //TODO err handling
			res.header('Content-Type', 'application/xml');
			return res.view('legacy/users', { users : users });
		});
	},
	
	"getMessages.php" : function(req, res) {
		Message.find({}, function(err, messages) { //TODO err handling
			res.header('Content-Type', 'application/xml');
			return res.view('legacy/messages', { messages : messages });
		});
	},
	
	"changeState.php" : function(req, res) {
		res.header('Content-Type', 'application/xml');
		return res.view('legacy/ok');
	},

	/**
	 * Overrides for the settings in `config/controllers.js` (specific to
	 * LegacyServiceController)
	 */
	_config : {}

};
