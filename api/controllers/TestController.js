/**
 * TestController
 *
 * @description :: Server-side logic for managing tests
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 //////////////////////
 ///////Server/////////
 //////////////////////

module.exports = {
	clicked: function(req, res) {
		console.log('Use of socket is: ' + req.isSocket);
		console.log(req.body);
		Test.create({thing: 'Testing 1, 2, 3', name: req.body.key}).exec(function createCB(err, created){
			if (err || !created) {
				console.log('There is an error.  It\'s probably Sam\'s code.  Big surprise');
			}
			else {
				console.log(created);
				var a = 4;
				console.log(a);
				res.send(created);
				Test.publishCreate({id: created.id, thing: created.thing, name: created.name});
			}
		});
		//res.send('Ganondorf');
	},
	association: function(req, res){
		console.log('The server is doing something with association');
		Test.find({}).exec(function (err, allTests){
			console.log('Finding all tests');
			Association.find({}).populateAll().exec(function (err, allAssociations){
				console.log('Finding all associations');
				//Might not want to be getting the id down below
				allTests[0].slave = allAssociations[0].id;
				allTests[0].save();
			});
		});
	},
	connected: function(req, res) {
		console.log('Hello world');
		Test.watch(req);
		Association.watch(req);
		Thing.watch(req);
	},
	clicks: function(req, res) {
		console.log('Use of socket is: ' + req.isSocket);
		console.log(req.body);
		Test.create({date: '3/5/15', name: req.body.key}).exec(function createCB(err, created){
			console.log(created);
			res.send(created);
			Test.publishCreate({id: created.id, date: created.date, name: created.name});
		});
	},
	createAssoc: function(req, res) {
		console.log('Server wants to create an Association');
		console.log(req.body);
		Association.create({date: 'The fruit, dummy', name: 'association'}).exec(function assocCreator(err, assoc){
			console.log(assoc);
			res.send(assoc);
			Association.publishCreate({id: assoc.id, name: assoc.name});
			console.log(assoc.id);
		});
	},
	createThing: function(req, res) {
		console.log(req.body);
		Thing.create({name: 'thing', id: req.body.id}).exec(function thingCreator(err, thing){
			console.log(thing);
			res.send(thing);
			Thing.publishCreate({name: thing.name, id: thing.id});
			console.log(thing.id);
		});
	},
	connect: function(req, res) {
		console.log('We are trying to connect associations with testes');
		console.log(req.body);
	},
	destroyed: function(req, res) {
		console.log('Use of socket is: ' + req.isSocket);
		console.log(req.body);
		Test.findOne(req.body.id).exec(function (err, deadId){
			console.log('Below is deadId');
			console.log(deadId);
			Test.destroy({id: deadId.id}).exec(function destroy(err){
				Test.publishDestroy(deadId.id);
			});
		});
	},
	findId: function(req, res) {
		console.log('teehee');
		Test.findOne(req.body.key).exec(function(e, test){
			console.log(req.body);
			console.log('Fuck you Sails Website.  Sam might be having a tough time.');
			console.log(test);
			Test.subscribe(req.socket, test);
		});
	},
	changeName: function(req, res) {
		console.log(req.body);
		console.log('Change Name');
		Test.findOne(req.body.id).exec(function(e, test){
			test.name = req.body.name;
			test.save(function(err, savedTest){
				Test.publishUpdate(test.id, {test: savedTest});
				res.send('Name Changed to: ' + test.name);
			});
		});
	},
	oneToOne: function(req, res) {
		console.log(req.body);
		console.log('Trying to do a one to one association');
		Test.findOne(req.body.testId).exec(function (err, associate){
			associate.slave = req.body.associationId;
			associate.save();
		});
		res.send("We're done");
	},
	oneToMany: function(req, res) {
		console.log('\nThe server is trying to do a one to many');
		//Put .populate after every .find()
		Test.find({}).populateAll().exec(function (err, allTests){
			console.log('Finding all tests for one to many on the server');
			Association.find({}).populateAll().exec(function (err, allAssociations){
				console.log('Finding all associations for one to many on the server');
				allTests[0].slaves.add(allAssociations[0].id);
				allTests[0].save();
			});
		});
	},
	oneToManyHW: function(req, res) {
		console.log('\nThe server is trying to do the one to many homework');
		console.log(req.body);
		Test.findOne(req.body.testId).exec(function (err, oneTest){
			Association.findOne(req.body.associationId).exec(function (err, oneAssociation){
				console.log('Found the test and association ids');
				oneTest.slaves.add(oneAssociation.id);
				oneTest.save();
			});
		});
	},
	oneToManyDestroyer: function(req, res) {
		console.log('Destruction of an association');
		console.log(req.body);
		Test.findOne(req.body.testId).exec(function (err, oneTest){
			Association.findOne(req.body.associationId).exec(function (err, oneAssociation){
				console.log('Found the test and association we want to destroy');
				oneTest.slaves.remove(oneAssociation.id);
				oneTest.save( function(){
					//Test.publishUpdate(oneTest);
				});
			});
		});
	},
	thingToStuff: function(req, res) {
		console.log('The server is doing a thing to stuff');
		console.log(req.body);
		Association.findOne(req.body.associationId).populateAll().exec(function (err, allAssociations){
			Thing.find({}).populateAll().exec(function (err, allThings){
				allAssociations.stuff.add(allThings[0].id);
				console.log('Did we add a thing?');
				allAssociations.save();
			});
		});
	},
	specificThingToStuff: function(req, res) {
		console.log('In specificThingToStuff');
		console.log(req.body);
		Association.findOne(req.body.associationId).populateAll().exec(function (err, oneAssociation){
			Thing.findOne(req.body.thingId).populateAll().exec(function (err, oneThing){
				console.log(oneAssociation);
				console.log(oneThing);
				oneAssociation.stuff.add(oneThing.id);
				oneAssociation.save();
				console.log('Going to send response right after these messages');
				res.send('Sending a response from specific thing to stuff');
			});
		});
	},
	jackPractice: function(req, res) {
		console.log('\n\nHow do I get two things ids');
		console.log(req.body);
		console.log('bitch: ');
		console.log(req.body.bitch);
		Association.find([req.body.thief, req.body.bitch]).populateAll().exec(function (error, associations){
			Thing.findOne(req.body.target).populateAll().exec(function (erro, target){
				console.log(associations[0].id);
				console.log(req.body.thief);
				console.log(parseInt(associations[0].id) === parseInt(req.body.thief) )
				if(parseInt(associations[0].id) === parseInt(req.body.thief) ) {
					var thief = 0;
				} else {
					var thief = 1;
				}
				console.log('associations[thief]');
				console.log(associations[thief]);
				console.log('associations[thief + 1 % 2]');
				console.log(associations[(thief + 1) % 2]);
				console.log('targetId: ' + target.id);
				associations[(thief + 1) % 2 ].stuff.remove(target.id);
				associations[(thief + 1) % 2].save(function (err, savedBitch) {
					console.log("savedBitch: ");
					console.log(savedBitch);
					associations[thief].stuff.add(req.body.target);
					associations[thief].stuff.remove(req.body.jack);
					associations[thief].save(function (er, savedThief){
						console.log("\nLogging error in savedThief find");
						console.log(err);
						console.log("\nLogging savedThief");
						console.log(savedThief);

						//Move the jack to the target's enchantments
						target.enchantments.add(req.body.jack);
						target.save(function (e, savedTarget) {
							console.log("SavedTarget: ");
							console.log(savedTarget);

						});
					});
				});
			});
		});
	},
	scuttle: function(req, res) {
		console.log('\n\nInside scuttle action');
		console.log(req.body);
		Test.findOne(req.body.game).populateAll().exec(function (error, theGame){
			Association.find([req.body.scuttler, req.body.scuttled]).populateAll().exec(function (erro, scuttlePlayers){
				Thing.find([req.body.highCard, req.body.lowCard]).populateAll().exec(function (err, scuttleCards){
					console.log('theGame id: ' + theGame.id);
					console.log('thingOne id: ' + scuttleCards[0].id);
					console.log('thingTwo id: ' + scuttleCards[1].id);
					console.log(parseInt(scuttleCards[0].id));
					console.log(parseInt(scuttleCards[1].id));
					console.log('associationOne: ' + scuttleCards[0].id);
					console.log('associationTwo: ' + scuttleCards[1].id);
					scuttlePlayers[0].stuff.remove(scuttleCards[0].id);
					scuttlePlayers[0].save(function (er, savedScuttler) {
						console.log('\nLogging savedScuttler:')
						console.log(savedScuttler);
						scuttlePlayers[1].stuff.remove(scuttleCards[1].id);
						scuttlePlayers[1].save(function (e_rror, savedScuttled){
							console.log('\nLogging savedScuttled');
							console.log(savedScuttled);
							theGame.scrap.add(req.body.highCard);
							theGame.scrap.add(req.body.lowCard);
							theGame.save(function (er_ror, savedGame){
								console.log('\nLogging savedGame');
								console.log(savedGame);
							});
						});
					});
				});
			});
		});
		
	}
};

//Make all console.log's start with a new line for the first thing in an action
// Association.create({date: 'The fruit, dummy', name: 'association'}).exec(function assocCreator(err, assoc){
// 			console.log(assoc);
// 			res.send(assoc);
// 			Association.publishCreate({id: assoc.id, name: assoc.name});
// 			console.log(assoc.id);
// 		});