/**
 * 
 */
module.exports = function(req, res, next) {
	if (req.session.user) {
		var action = req.method;
		if (action === "POST" && !req.body.sender) {
			req.body.sender = req.session.user.nickName;
		}
		next();
	} else {
		return res.forbidden('You are not permitted to perform this action.');
	}
};
