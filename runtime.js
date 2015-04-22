// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Facebook = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.Facebook.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;
	
	var fbAppID = "";
	var fbAppSecret = "";
	var fbReady = false;
	var fbLoggedIn = false;
	var fbUserID = "";
	var fbFullName = "";
	var fbFirstName = "";
	var fbLastName = "";
	var fbEmail ="";
	var fbRuntime = null;
	var fbInst = null;
	
	var fbScore = 0;
	var fbHiscoreName = "";
	var fbHiscoreUserID = 0;
	var fbRank = 0;
	
	var fbCanPublishStream = false;
	var fbCanPublishAction = false;
	var fbPerms = "";
	
	function onFBLogin()
	{
		if (!fbLoggedIn)
		{
			fbLoggedIn = true;
			fbRuntime.trigger(cr.plugins_.Facebook.prototype.cnds.OnLogIn, fbInst);
			
			FB.api('/me', function(response) {
							fbFullName = response["name"];
							fbFirstName = response["first_name"];
							fbLastName = response["last_name"];
							fbEmail = response["email"];
							fbRuntime.trigger(cr.plugins_.Facebook.prototype.cnds.OnNameAvailable, fbInst);
						});
		}
	};

	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.onCreate = function()
	{
		if (this.runtime.isDomFree)
		{
			cr.logexport("[Construct 2] Facebook plugin not supported on this platform - the object will not be created");
			return;
		}
		
		fbAppID = this.properties[0];
		fbAppSecret = this.properties[1];
		fbRuntime = this.runtime;
		fbInst = this;
		
		window.fbAsyncInit = function() {
		
			var channelfile = '//' + location.hostname;
			var pname = location.pathname;
			
			if (pname.substr(pname.length - 1) !== '/')
				pname = pname.substr(0, pname.lastIndexOf('/') + 1);
			
			FB.init({
			  "appId"      : fbAppID,
			  "channelURL" : '//' + location.hostname + pname + 'channel.html',
			  "status"     : true,
			  "cookie"     : true,
			  "oauth"      : true,
			  "xfbml"      : false
			});
			
			fbReady = true;
			
			FB.Event.subscribe('auth.login', function(response) {
				fbUserID = response["authResponse"]["userID"];
				log("User ID = " + fbUserID);
				onFBLogin();
			});
			
			FB.Event.subscribe('auth.logout', function(response) {
				if (fbLoggedIn)
				{
					fbLoggedIn = false;
					fbFullName = "";
					fbFirstName = "";
					fbLastName = "";
					fbEmail = "";
					fbRuntime.trigger(cr.plugins_.Facebook.prototype.cnds.OnLogOut, fbInst);
				}
			});
			
			FB.getLoginStatus(function(response) {
				if (response["authResponse"])
				{
					fbUserID = response["authResponse"]["userID"];
					log("User ID = " + fbUserID);
					onFBLogin();
				}
			});
			
			fbRuntime.trigger(cr.plugins_.Facebook.prototype.cnds.OnReady, fbInst);
		};
		
		// Load the SDK asynchronously.  Don't bother if no App ID provided.
		if (fbAppID.length)
		{
			(function(d){
				var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
				js = d.createElement('script'); js.id = id; js.async = true;
				js.src = "//connect.facebook.net/en_US/all.js";
				d.getElementsByTagName('head')[0].appendChild(js);
			}(document));
		}
		else
			log("Facebook object: no App ID provided.  Please enter an App ID before using the object.");
	};
	
	instanceProto.onLayoutChange = function ()
	{
		if (this.runtime.isDomFree)
			return;
		
		// re-trigger 'on login' and 'on name available' as appropriate for the new layout
		if (fbLoggedIn)
			fbRuntime.trigger(cr.plugins_.Facebook.prototype.cnds.OnLogIn, fbInst);
			
		if (fbFullName.length)
			fbRuntime.trigger(cr.plugins_.Facebook.prototype.cnds.OnNameAvailable, fbInst);
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.IsReady = function ()
	{
		return fbReady;
	};
	
	Cnds.prototype.OnReady = function ()
	{
		return true;
	};
	
	Cnds.prototype.IsLoggedIn = function ()
	{
		return fbLoggedIn;
	};
	
	Cnds.prototype.OnLogIn = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnLogOut = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnNameAvailable = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnUserTopScoreAvailable = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnHiscore = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnScoreSubmitted = function ()
	{
		return true;
	};
	
	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	Acts.prototype.LogIn = function (perm_stream, perm_action)
	{
		if (this.runtime.isDomFree || !fbReady)
			return;
			
		fbCanPublishStream = (perm_stream === 1);
		fbCanPublishAction = (perm_action === 1);
		
		var perms = [];
		
		if (fbCanPublishStream)
			perms.push("publish_stream");
		if (fbCanPublishAction)
			perms.push("publish_actions");
			
		var newperms = perms.join();
		
		//if (!fbLoggedIn || fbPerms !== newperms)
		//{
			fbPerms = newperms;
			
			FB.login(function(response) {
					if (response["authResponse"])
						onFBLogin();
				}, {scope: fbPerms});
		//}
	};
	
	Acts.prototype.LogOut = function ()
	{
		if (this.runtime.isDomFree)
			return;
			
		if (fbLoggedIn)
			FB.logout(function(response) {});
	};
	
	Acts.prototype.PromptWallPost = function ()
	{
		if (this.runtime.isDomFree || !fbLoggedIn)
			return;
			
		FB.ui({ "method": "feed" }, function(response) {
				if (!response || response.error)
					  console.error(response);
			});
	};
	
	Acts.prototype.PromptToShareApp = function (name_, caption_, description_, picture_)
	{
		if (this.runtime.isDomFree || !fbLoggedIn)
			return;
			
		FB.ui({
				"method": "feed",
				"link": "http://apps.facebook.com/" + fbAppID + "/",
				"picture": picture_,
				"name": name_,
				"caption": caption_,
				"description": description_
			  }, function(response) {
				  if (!response || response.error)
						  console.error(response);
			});
	};
	
	Acts.prototype.PromptToShareLink = function (url_, name_, caption_, description_, picture_)
	{
		if (this.runtime.isDomFree || !fbLoggedIn)
			return;
			
		FB.ui({
				"method": "feed",
				"link": url_,
				"picture": picture_,
				"name": name_,
				"caption": caption_,
				"description": description_
			  }, function(response) {
					if (!response || response.error)
						console.error(response);
			});
	};
	
	Acts.prototype.PublishToWall = function (message_)
	{
		if (this.runtime.isDomFree || !fbLoggedIn)
			return;
			
		var publish = {
			"method": 'stream.publish',
			"message": message_
		};

		FB.api('/me/feed', 'POST', publish, function(response) {
				if (!response || response.error)
					console.error(response);
			});
	};
	
	Acts.prototype.PublishLink = function (message_, url_, name_, caption_, description_, picture_)
	{
		if (this.runtime.isDomFree || !fbLoggedIn)
			return;
			
		var publish = {
				"method": 'stream.publish',
				"message": message_,
				"link": url_,
				"name": name_,
				"caption": caption_,
				"description": description_
			};
		
		if (picture_.length)
			publish["picture"] = picture_;

		FB.api('/me/feed', 'POST', publish, function(response) {
				if (!response || response.error)
					console.error(response);
			});
	};
	
	Acts.prototype.PublishScore = function (score_)
	{
		if (this.runtime.isDomFree || !fbLoggedIn)
			return;
			
		FB.api('/' + fbUserID + '/scores', 'POST', { "score": Math.floor(score_), "access_token": fbAppID + "|" + fbAppSecret }, function(response) {
			fbRuntime.trigger(cr.plugins_.Facebook.prototype.cnds.OnScoreSubmitted, fbInst);
			
			if (!response || response.error)
				console.error(response);
	   });
	};
	
	Acts.prototype.RequestUserHiscore = function ()
	{
		if (this.runtime.isDomFree || !fbLoggedIn)
			return;
			
		FB.api('/me/scores', 'GET', {}, function(response) {
			fbScore = 0;
			var arr = response["data"];
			
			if (!arr)
			{
				console.error("Request for user hi-score failed: " + response);
				return;
			}
			
			var i, len;
			for (i = 0, len = arr.length; i < len; i++)
			{
				if (arr[i]["score"] > fbScore)
					fbScore = arr[i]["score"];
			}
			
			fbRuntime.trigger(cr.plugins_.Facebook.prototype.cnds.OnUserTopScoreAvailable, fbInst);
			
			if (!response || response.error) {
			  console.error(response);
		    } else {
			  log(response);
		    }
		});
	};
	
	Acts.prototype.RequestHiscores = function (n)
	{
		if (this.runtime.isDomFree || !fbLoggedIn)
			return;
			
		FB.api('/' + fbAppID + '/scores', 'GET', {}, function(response) {
		
			var arr = response["data"];
			
			if (!arr)
			{
				console.error("Hi-scores request failed: " + response);
				return;
			}
			
			arr.sort(function(a, b) {
				// descending order
				return b["score"] - a["score"];
			});
			
			var i = 0, len = Math.min(arr.length, n);
			
			for ( ; i < len; i++)
			{
				fbScore = arr[i]["score"];
				fbHiscoreName = arr[i]["user"]["name"];
				fbHiscoreUserID = arr[i]["user"]["id"];
				fbRank = i + 1;
				fbRuntime.trigger(cr.plugins_.Facebook.prototype.cnds.OnHiscore, fbInst);
			}
			
			if (!response || response.error) {
			  console.error(response);
		    } else {
			  log(response);
		    }
		});
	};
	
	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.FullName = function (ret)
	{
		ret.set_string(fbFullName);
	};
	
	Exps.prototype.FirstName = function (ret)
	{
		ret.set_string(fbFirstName);
	};
	
	Exps.prototype.LastName = function (ret)
	{
		ret.set_string(fbLastName);
	};
	
	Exps.prototype.Score = function (ret)
	{
		ret.set_int(fbScore);
	};
	
	Exps.prototype.HiscoreName = function (ret)
	{
		ret.set_string(fbHiscoreName);
	};
	
	Exps.prototype.HiscoreUserID = function (ret)
	{
		ret.set_int(fbHiscoreUserID);
	};
	
	Exps.prototype.HiscoreRank = function (ret)
	{
		ret.set_int(fbRank);
	};
	
	Exps.prototype.UserID = function (ret)
	{
		// Float because these numbers are insanely huge now!
		ret.set_float(parseFloat(fbUserID));

	};


	Exps.prototype.Email = function (ret)
	{
		
		ret.set_string(fbEmail);
	};	
	pluginProto.exps = new Exps();

}());