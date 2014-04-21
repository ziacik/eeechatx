/**
 * User
 *
 * @module :: Model
 * @description :: A short summary of how this model works and what it
 *              represents.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes : {
		email: {
			type: 'string',
			unique: true,
			required: true
		},
		password: {
			type: 'string'
		},
		salt: {
			type: 'string'
		},
		nickName : {
			type : 'string',
			required : false
		},
		color: {
			type: 'string'
		}
	}
};
