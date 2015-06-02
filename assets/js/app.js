////////////////////
////////Client//////
////////////////////

(function() {
	var socket = io.connect('http://localhost:1337');
	var app = angular.module('homepage', []);
	var testId = null;
	var associationId = null;
	var thingId = null;
	var thingOne = null;
	var thingTwo = null;
	var associationOne = null;
	var associationTwo = null;

	app.controller('homepageController', function($scope){
		this.value = 'value';
		this.tests = [];
		this.associations = [];
		this.things = [];
		io.socket.on('test', function(obj){
			console.log('\nA test event is happening');
			console.log(obj.data);
			switch(obj.verb) {
				case 'created':
					$scope.homepage.tests.push(obj.data.test);
					console.log(obj.data);
					console.log($scope.homepage.tests);
					if ('date' in obj.data) {
						$('#list').append("<li class = 'test' id = " + obj.data.id + ">name: " + obj.data.name + " date: " + obj.data.date + "</li>");
					}
					else {$('#list').append("<li class = 'test' id = " + obj.data.id + ">name: " + obj.data.name + "</li>");}
					$('.test').off();
					$('.test').on('click', function(){
						console.log('It turned off and on');
						io.socket.get('/test/subscribe', {key: $(this).prop('id')}, function(res){
							console.log('Suck it Angular');
						});
					});
					break;
				case 'updated':
					console.log('Updated');
					console.log(obj.data.test);
					$('.test').each(function(index){
						// Below was the troubleshooting for the if statement
						// console.log(index);
						// console.log($(this));
						// console.log($(this).prop('id'));
						// console.log(obj.data.test.id);
						// console.log(obj.data.test.id === parseInt($(this).prop('id')));
						// console.log(typeof obj.data.test.id);
						// console.log(typeof $(this).prop('id'));
						if(obj.data.test.id === parseInt($(this).prop('id')))
							if('date' in obj.data.test) {
								var str = "name: " + obj.data.test.name + ' date: ' + obj.data.test.date;
							}
						else {
							var str = "name: " + obj.data.test.name;
						}
						$(this).html(str);
					});
					break;
				case 'destroyed':
					console.log('Destroyed');2
					$('.test').each(function(index){
						if(obj.id === parseInt($(this).prop('id'))) {
							var str = '';
						}
						$(this).html(str);
					});			
				}
			$scope.$apply();
		});
	});

	$("#button").on('click', function(){
		console.log("woot");
		var thing = prompt("What do you want to type?");
		io.socket.get('/test/button', {key: thing}, function(res) {
			console.log(res);
;		});
	});
	$('#button2').on('click', function(){
		console.log('Homework');
		var date = prompt('This is for homework');
		io.socket.get('/test/button2', {key: date}, function(res) {
			console.log(res);
		});
	});
	$('#field').on('click', function(){
		console.log('\nIn field button, Ryan you classifying dingus');
		var name = prompt('You are going to rename, the name of a test model, what shall it be?');
		if(name) {
			$('.test').off();
			$('.test').on('click', function(){
				io.socket.get('/test/nameButton', {name: name, id: $(this).prop('id')}, function(res) {
					console.log(res);
					$('.test').off();
					$('.test').on('click', function(){
						console.log('It turned off and on');
						io.socket.get('/test/subscribe', {key: $(this).prop('id')}, function(res){
							console.log('Suck it Angular');
						});
					});
				});
			});
		}

	});
	$('#connector').on('click', function(){
		console.log('Connecting');
		var connect = confirm('Would you like to create a slave?');
		if(connect) {
			$('.test').off();
			$('.association').off();
			$('.test').on('click', function(){
				testId = $(this).prop('id');
				if(associationId){
					io.socket.get('/test/oneToOne', {testId: testId, associationId:associationId}, function(res) {
						console.log('It is called associationId associating');
						$('.test').off();
						$('.association').off();
						testId = null;
						associationId = null;
					});
				}
			});
			$('.association').on('click', function(){
				associationId = $(this).prop('id');
				if(testId){
					io.socket.get('/test/oneToOne', {testId: testId, associationId: associationId}, function(res){
						console.log('It is called testId associating');
						$('.test').off();
						$('.association').off();
						testId = null;
						associationId = null;
					});
				}
			});
		}
	});
	$('#destroyer').on('click', function(){
		console.log('Destroying');
		var destruction = confirm('Would you like to destroy a model?');
		if(destruction) {
			$('.test').off();
			$('.test').on('click', function(){
				io.socket.get('/test/destroy', {name: name, id: $(this).prop('id')}, function(res) {
					console.log(res);
				});	
			});
		}
	});
	$('#association').on('click', function(){
		console.log('We are associating');
		io.socket.get('/test/association', function(res){
			console.log('Sending an association response......but not really');
		});
	});
	$('#createAssoc').on('click', function(){
		console.log('Creating an association');
		var assoc = confirm('Would you like to create an association?');
		if(assoc) {
			console.log('We are in createAssoc');
				io.socket.get('/test/createAssoc', {name: name, id: $(this).prop('id')}, function(res){
					console.log('Associations...associations created');
			});
		}
	});
	$('#manyConnections').on('click', function(){
		console.log('One to many practice');
		io.socket.get('/test/oneToMany', function(res){
			console.log('We are practicing one to many');
		});
	});
	$('#oneToMany').on('click', function(){
		console.log('One to many homework');
		var conf = confirm('Would you like to connect and Test to an Association?')
		if(confirm){
			$('.test').off;
			$('.association').off;
			$('.test').on('click', function(){
				testId = $(this).prop('id');
				if(associationId){
					io.socket.get('/test/oneToManyHW', {testId: testId, associationId:associationId}, function(res) {
						console.log('It is called associationId associating');
						$('.test').off();
						$('.association').off();
						testId = null;
						associationId = null;
					});
				}
				$('.association').on('click', function(){
				associationId = $(this).prop('id');
				if(testId){
					io.socket.get('/test/oneToManyHW', {testId: testId, associationId: associationId}, function(res){
						console.log('It is called testId associating');
						$('.test').off();
						$('.association').off();
						testId = null;
						associationId = null;
					});
				}
			});
		});
		}
	});
	$('#oneToManyDestroyer').on('click', function(){
		console.log('One to many destruction');
		var conf = confirm('Would you like to destroy a Test and an association association?');
		if(conf){
			$('.test').off;
			$('.association').off;
			$('.test').on('click', function(){
				testId = $(this).prop('id');
				if(associationId){
					io.socket.get('/test/oneToManyDestroyer', {testId: testId, associationId:associationId}, function(res) {
						console.log('It is called associationId associating');
						$('.test').off();
						$('.association').off();
						testId = null;
						associationId = null;
					});
				}
			$('.association').on('click', function(){
				associationId = $(this).prop('id');
				if(testId){
					io.socket.get('/test/oneToManyDestroyer', {testId: testId, associationId: associationId}, function(res){
						console.log('It is called testId associating');
						$('.test').off();
						$('.association').off();
						testId = null;
						associationId = null;
					});
				}
			});
		});
		}
	});
	$('#thingToStuff').on('click', function(){
		console.log('We are in things to stuff');
		var conf = confirm('Would you like to connect a thing to stuff?');
		if(conf){
			$('.association').off;
			$('.association').on('click', function(){
				associationId = $(this).prop('id');
				io.socket.get('/test/thingToStuff', {associationId: associationId}, function(res){
					console.log('Inside the action for thingToStuff');
				});
			});
		}
	});
	$('#specificThingToStuff').on('click', function(){
		console.log('Doing specific things to stuff connections');
		var conf = confirm('Would you like to connect a specific thing to stuff');
		if(conf){
			$('.thing').off();
			$('.association').off();
			$('.association').on('click', function(){
				associationId = $(this).prop('id');
				if(thingId){
					io.socket.get('/test/specificThingToStuff', {associationId: associationId, thingId: thingId}, function(res){
						console.log('Getting the associationId for thing to stuff specifically');
						$('.thing').off();
						$('.association').off();
						thingId = null;
						associationId = null;
					});
				}
			$('.thing').on('click', function(){
				thingId = $(this).prop('id');
				if(associationId){
					io.socket.get('/test/specificThingToStuff', {associationId: associationId, thingId: thingId}, function(res){
						console.log('Getting the thingId for thing to stuff specifically');
						$('.thing').off();
						$('.association').off();
						thingId = null;
						associationId = null;
					});
				}
			});
			});
		}
	});
	$('#things').on('click', function(){
		console.log('Trying to create a thing');
		var promp = prompt('What would like to name your thing?');
		if(promp){
			io.socket.get('/test/createThing', {name: name, id: $(this).prop('id')}, function(res){
					console.log('Things, there are things');
			});
		}
	});
	$('#scuttle').on('click', function(){
		console.log('Practicing scuttling');
		var conf = confirm('Woud you like to scuttle?');
		if(conf) {
			$('.test').off();
			$('.thing').off();
			$('.association').off();
			$('.test').on('click', function(){
				console.log('Clicked a test');
				testId = $(this).prop('id');
				if(thingOne && thingTwo && associationOne && associationTwo) {
					console.log('We have a game');
					io.socket.get('/test/scuttle', {game: testId, scuttler: associationOne, scuttled: associationTwo, highCard: thingOne, lowCard: thingTwo}, function(res){
						console.log('Server responded to request for scuttle practice \n');
						$('.thing').off();
						$('.test').off();
						$('.association').off();
						associationOne = null;
						associationTwo = null;
						thingOne = null;
						thingTwo = null;
						testId = null;
					});
				}
			})
			$('.association').on('click', function(){
				console.log('Clicked an association');
				if(associationOne) {
					console.log('Have Scuttler');
					if($(this).prop('id') !== associationOne) {
						associationTwo = $(this).prop('id');
						if(thingOne && thingTwo && testId) {
							io.socket.get('/test/scuttle', {game: testId, scuttler: associationOne, scuttled: associationTwo, highCard: thingOne, lowCard: thingTwo}, function(res){
								console.log('Server responded to request for scuttle practice \n');
								$('.thing').off();
								$('.association').off();
								associationOne = null;
								associationTwo = null;
								thingOne = null;
								thingTwo = null;
								testId = null;
							});
						}
					}
				} else {
					associationOne = $(this).prop('id');
					console.log("Didn't have scuttler, assigning it to " + associationOne);
				}
			});
			$('.thing').on('click', function(){
				console.log('Clicked a thing');
				if(thingOne) {
					console.log('Have the highCard');
					if($(this).prop('id') !== thingOne) {
						thingTwo = $(this).prop('id');
						console.log('highCard is different from clicked thing, assigning lowCard to ' + thingTwo);
						if(associationOne && associationTwo && testId) {
							io.socket.get('/test/scuttle', {game: testId, scuttler: associationOne, scuttled: associationTwo, highCard: thingOne, lowCard: thingTwo}, function(res){
								console.log('Server responded to request for scuttle practice\n');
								$('.thing').off();
								$('.association').off();
								associationOne = null;
								associationTwo = null;
								thingOne = null;
								thingTwo = null;
								testId = null;
							});
						}
					}
				} else {
					thingOne = $(this).prop('id');
					console.log("Didn't have highCard, assigning it to " + thingOne);
				}
			});
		}
	});
	$('#jack').on('click', function(){
		console.log('\n\nJack practice initiated');
		var conf = confirm('Would you like to try some jack stuff?  Click the thief, then the bitch, then the jack then the target');
		if(conf){
			console.log('Is the button working?')
			$('.thing').off();
			$('.association').off();
			$('.association').on('click', function(){
				console.log('Click an association');
				if(associationOne) {
					console.log('Had thief');
					if($(this).prop('id') !== associationOne) {
						associationTwo = $(this).prop('id');
						console.log('Thief is different from clicked association, assigning bitch to' + associationTwo);
						if(thingOne && thingTwo) {
							io.socket.get('/test/jackPractice', {bitch: associationTwo, jack: thingOne, target: thingTwo, thief: associationOne}, function(res){
								console.log('Server responded to request for jack practice\n');
								console.log(res);
								$('.thing').off();
								$('.association').off();
								associationOne = null;
								associationTwo = null;
								thingOne = null;
								thingTwo = null;
							});
						}
					}
				} else {
					associationOne = $(this).prop('id');
					console.log("Didn't have thief, assigning it to " + associationOne);
				}
			});
			$('.thing').on('click', function(){
				console.log('You clicked some thing');
				if(thingOne) {
					console.log('Found jack ' + thingOne);
					if($(this).prop('id') !== thingOne) {
						thingTwo = $(this).prop('id');
						console.log('Target is not jack ' + thingTwo);
						if(associationOne && associationTwo) {
							console.log('We have a thief and a bitch');
							io.socket.get('/test/jackPractice', {target: thingTwo, jack: thingOne, thief: associationOne, bitch: associationTwo}, function(res){
								console.log('Server responded to request for jack practice\n');
								$('thing').off();
								$('association').off();
								associationOne = null;
								associationTwo = null;
								thingOne = null;
								thingTwo = null;
							});
						}
					}
				} else {
					thingOne = $(this).prop('id');
					console.log("Didn't have Jack, assigning it to " + thingOne);
				}
			});
		}
	});

	io.socket.on('association', function(obj){
		console.log('Trying to show an association');
		console.log(obj);
		console.log(obj.data);
		switch(obj.verb) {
			case 'created':
				var test = "<li class = 'association' id = " + obj.data.id + ">name: " + obj.data.name + "</li>";
				$('#list').append(test);
				console.log(test);
				break;
		}
	});
	io.socket.on('thing', function(obj){
		console.log('Trying to type out a thing');
		switch(obj.verb) {
			case 'created':
				var thingList = "<li class = 'thing' id = " + obj.data.id + ">name: " + obj.data.name + "</li>";
				$('#list').append(thingList);
				console.log(thingList);
				break;
		}
	});

	io.socket.on('connect', function(){
		console.log('worked');
		io.socket.get('/test/connect', function(res){
			console.log(res);
		});
	});
})();

//Obj is built into Sails.  It is connected to publish