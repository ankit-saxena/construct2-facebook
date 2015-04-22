function GetPluginSettings()
{
	return {
		"name":			"Facebook",
		"id":			"Facebook",
		"version":		"1.0",
		"description":	"Access Facebook API features.",
		"author":		"Scirra",
		"help url":		"http://www.scirra.com/manual/112/facebook",
		"category":		"Platform specific",
		"type":			"object",			// not in layout
		"rotatable":	false,
		"flags":		pf_singleglobal,
		"dependency":	"channel.html"
	};
};

//////////////////////////////////////////////////////////////
// Conditions
AddCondition(0,	0, "Is ready", "Facebook", "Is ready", "True when the Facebook API has loaded and is ready to be used.", "IsReady");
AddCondition(1,	0, "Is user logged in", "Facebook", "Is user logged in", "True if currently being viewed inside Facebook by a logged in user.", "IsLoggedIn");

AddCondition(2, cf_trigger, "On user logged in", "Facebook", "On user logged in", "Triggered when the user successfully logs in.", "OnLogIn");
AddCondition(3, cf_trigger, "On user logged out", "Facebook", "On user logged out", "Triggered when the user logs out.", "OnLogOut");
AddCondition(4, cf_trigger, "On name available", "Facebook", "On name available", "Triggered after login when the user's name becomes available.", "OnNameAvailable");

AddCondition(5, cf_trigger, "On user top score available", "Scores (when logged in with permission)", "On user top score available", "Triggered after the 'request user top score' action.", "OnUserTopScoreAvailable");

AddCondition(6, cf_trigger, "On hi-score", "Scores (when logged in with permission)", "On hi-score", "Triggered for each top score after the 'request hi-score board' action.", "OnHiscore");

AddCondition(7, cf_trigger, "On score submitted", "Scores (when logged in with permission)", "On score submitted", "Triggered when the 'publish score' action completes.", "OnScoreSubmitted");

AddCondition(8,	cf_trigger, "On ready", "Facebook", "On ready", "Triggered when the Facebook API has loaded and is ready to be used.", "OnReady");

//////////////////////////////////////////////////////////////
// Actions
AddComboParamOption("None");
AddComboParamOption("Publish to stream");
AddComboParam("Stream permission", "Ask user for permission to automatically (without prompting) publish to the user's stream.  Do not ask for permissions you don't need!");
AddComboParamOption("None");
AddComboParamOption("Publish scores");
AddComboParam("Action permission", "Ask user for permission to publish scores for the user.  The App Secret is required to post scores.  Do not enter the App Secret if you are not using scores.");
AddAction(2, 0, "Log in", "Facebook", "Log in (request <i>{0}</i>, <i>{1}</i>)", "Log the user in to the application so their details can be accessed.", "LogIn");
AddAction(3, 0, "Log out", "Facebook", "Log out", "Log the user out.", "LogOut");

AddAction(4, 0, "Prompt wall post", "Prompt (no permissions required)", "Prompt wall post", "Bring up a dialog where the user can share some text on their wall or choose to cancel.", "PromptWallPost");

AddStringParam("Name", "The name of the app that will appear in the Share dialog.");
AddStringParam("Caption", "The caption appearing beneath the name in the Share dialog.");
AddStringParam("Description", "The description appearing beneath the caption in the Share dialog.");
AddStringParam("Picture URL (optional)", "The URL of an image on your server to use on the Share dialog.  Must include the http://.  Defaults to the exported loading-logo.png.");
AddAction(5, 0, "Prompt to share this app", "Prompt (no permissions required)", "Prompt to share this app (<i>{0}</i>, <i>{1}</i>, <i>{2}</i>, <i>{3}</i>)", "Bring up a dialog where the user can share a link to the app on their wall or choose to cancel.", "PromptToShareApp");

AddStringParam("URL", "The link to share.", "\"http://\"");
AddStringParam("Name", "The link text that will appear in the Share dialog.");
AddStringParam("Caption", "The caption appearing beneath the link text in the Share dialog.");
AddStringParam("Description", "The description appearing beneath the caption in the Share dialog.");
AddStringParam("Picture URL (optional)", "The URL of an image on your server to use on the Share dialog.  Must include the http://");
AddAction(6, 0, "Prompt to share link", "Prompt (no permissions required)", "Prompt to share link <b>{0}</b> (<i>{1}</i>, <i>{2}</i>, <i>{3}</i>, <i>{4}</i>)", "Bring up a dialog where the user can share a link on their wall or choose to cancel.", "PromptToShareLink");

AddStringParam("Message", "The text to publish to the user's feed.  It is recommended to only do this when the user initiates the action.");
AddAction(7, 0, "Publish wall post", "Publish to stream (when logged in with permission)", "Publish wall post with text <i>{0}</i>", "Publish a message to the user's wall.  The user should explicitly initiate this.", "PublishToWall");

AddStringParam("Message", "The text to publish to the user's feed.  It is recommended to only do this when the user initiates the action.");
AddStringParam("URL", "The link to share.", "\"http://\"");
AddStringParam("Name", "The link text.");
AddStringParam("Caption", "The caption appearing beneath the link text.");
AddStringParam("Description", "The description appearing beneath the caption.");
AddStringParam("Picture URL (optional)", "The URL of an image on your server to use on the Share dialog.  Must include the http://");
AddAction(8, 0, "Publish link", "Publish to stream (when logged in with permission)", "Publish link <b>{1}</b> (<i>{0}</i>, <i>{2}</i>, <i>{3}</i>, <i>{4}</i>, <i>{5}</i>)", "Publish a link to the user's wall.  The user should explicitly initiate this.", "PublishLink");

AddNumberParam("Score", "The user's score for this game to publish.");
AddAction(9, 0, "Publish score", "Scores (when logged in with permission)", "Publish score <b>{0}</b>", "Publish a score for this user.", "PublishScore");

AddAction(10, 0, "Request user top score", "Scores (when logged in with permission)", "Request user top score", "Request the user's top score, triggering 'on user top score available' when received.", "RequestUserHiscore");

AddNumberParam("Number of scores", "The number of hi-scores to retrieve.", "10");
AddAction(11, 0, "Request hi-score board", "Scores (when logged in with permission)", "Request hi-score board top {0} scores", "Request the app's hi-score board, triggering 'on hi-score' for each hi-score received.", "RequestHiscores");

//////////////////////////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_string, "Get full name", "Facebook", "FullName", "Get the user's full name, if they are logged in.");
AddExpression(1, ef_return_string, "Get first name", "Facebook", "FirstName", "Get the user's first name, if they are logged in.");
AddExpression(2, ef_return_string, "Get last name", "Facebook", "LastName", "Get the user's last name, if they are logged in.");

AddExpression(3, ef_return_number, "Get score", "Scores (when logged in with permission)", "Score", "Get the score, when in a 'on user top score' or 'on hi-score' event.");
AddExpression(5, ef_return_string, "Get hi-score name", "Scores (when logged in with permission)", "HiscoreName", "Get the name of the user with hi-score, when in an 'on hi-score' event.");
AddExpression(6, ef_return_number, "Get hi-score rank", "Scores (when logged in with permission)", "HiscoreRank", "Get the rank of the hi-score, when in an 'on hi-score' event.");

AddExpression(7, ef_return_number, "Get user ID", "Facebook", "UserID", "Get the user's ID, which is different even for users with the same name.");

AddExpression(8, ef_return_number, "Get hi-score user ID", "Scores (when logged in with permission)", "HiscoreUserID", "Get the user ID of the user with hi-score, when in an 'on hi-score' event.");

AddExpression(9, ef_return_string, "Get email of user ID", "Facebook", "Email", "Get the email of user event.");
//////////////////////////////////////////////////////////////
ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_text,		"App ID",		"",			"The App ID Facebook gives you after creating an app."),
	new cr.Property(ept_text,		"App secret",	"",			"The App Secret Facebook gives you after creating an app.  Only necessary for submitting scores!")
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}
	
// Called by the IDE to draw this instance in the editor
IDEInstance.prototype.Draw = function(renderer)
{
}

// Called by the IDE when the renderer has been released (ie. editor closed)
// All handles to renderer-created resources (fonts, textures etc) must be dropped.
// Don't worry about releasing them - the renderer will free them - just null out references.
IDEInstance.prototype.OnRendererReleased = function()
{
}
