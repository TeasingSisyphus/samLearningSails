/**
* Association.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
		owner: {
			model: 'test'
		},
		stuff: {
			collection: 'thing'
		},
  }
};

//A model inside here isn't actually a model, it is a record