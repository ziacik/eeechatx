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
			type: 'email',
			unique: true,
			required: true
		},
		passwordHash: {
			type: 'string'
		},
		salt: {
			type: 'string'
		},
		name : {
			type : 'string',
			required : true
		},
		picture : {
			type : 'url'
		},
		color: {
			type: 'string'
		}
	}
};
