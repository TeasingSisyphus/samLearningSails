/**
* Test.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	thing: {
  		type: "string", //Might need to be uppercase
  		required: false,
  	},
  	name: {
  		type: 'string',
  		required: true,
  	},
    date: {
      type: 'string',
      required: false,
    },
    slave:{
      model: 'association'
    },
    slaves:{
      collection: 'association',
      via: 'owner'
    },
    scrap:{
      collection: 'thing',
      via: 'board'
    },
  },
};

//A model inside here isn't actually a model, it is a record