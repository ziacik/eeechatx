/**
 * 
 */
module.exports = function(req, res, next) {
	if (req.user) {
		var action = req.method;
		if (action === "POST" && !req.body.sender) {
			req.body.sender = req.user.id;
		}
		next();
	} else if (req.session.passport.user) {
		var action = req.method;
		if (action === "POST" && !req.body.sender) {
			req.body.sender = req.session.passport.user;
		}
		next();
	} else {
		return res.forbidden('You are not permitted to perform this action.');
	}
};
