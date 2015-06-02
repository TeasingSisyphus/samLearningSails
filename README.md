# test\

a [Sails](http://sailsjs.org) application

Aesthetic fixes:

Fixing the program:
	Separate the test, association, and things
	Make the buttons a bit nicer looking
	Find a way to delete an entire html element when we destroy.  Will need to research how to destroy and html element with jQuery
	Specific thing to stuff, only takes the association first, fix it so you can click a thing first


Making the code cleaner:
	Change the console.log for remove to actually say remove not destroy, with one to many removal.
	Organize app.js into my on.click buttons, tests, associations etc.
	Give associations and things unique names like test
	Add console logs in app.js when a user clicks on a test and association during 'Connect a specific thing to stuff' so we have feedback showing the clicks

Homework:  Add a thing collection (scrap) to test (game), then make a button that removes two things from the stuff of two different associations (players) and put them both into the new collection