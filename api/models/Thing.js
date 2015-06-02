/**
* Thing.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	enchantments:{
  		collection: 'thing',
  		via: 'bigThing'
  	},
  	bigThing:{
  		model: 'thing'
  	},
  	board:{
  		model: 'test'
  	}
  }
};

//A model inside here isn't actually a model, it is a record

