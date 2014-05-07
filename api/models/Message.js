/**
 * Message
 *
 * @module :: Model
 * @description :: A short summary of how this model works and what it
 *              represents.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes : {

		sender : {
			type : 'integer',
			required : true
		},
		recipients : {
			type : 'array',
			required : false
		},
		content : {
			type : 'string',
			required : true
		}
	}
};
