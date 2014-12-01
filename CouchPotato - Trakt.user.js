// ==UserScript==
// @name        CouchPotato - Trakt
// @namespace   https://github.com/dexhain/greasemonkey-scripts
// @include	entercouchaddress
// @downloadURL https://github.com/dexhain/greasemonkey-scripts/raw/master/CouchPotato%20-%20Trakt.user.js
// @version     1.1
// @grant       GM_xmlhttpRequest
// @grant		GM_addStyle
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_deleteValue
// ==/UserScript==

if(window.top == window.self)
{
	if(GM_getValue("apikey", "") === "" || GM_getValue("apikey", "") == null || GM_getValue("apikey", "").length == 0)
		GM_setValue("apikey", prompt("Enter your apikey"));
	if(GM_getValue("username", "") === "" || GM_getValue("username", "") == null || GM_getValue("username", "").length == 0)
		GM_setValue("username", prompt("Enter your username"));
	GM_addStyle("\
		.watchlist {\
			background: url(\"https://slurm.trakt.us/images/episode-bookmark.png\") no-repeat scroll 0 0 rgba(0, 0, 0, 0) !important;\
			z-index: 2 !important;\
			height: 40px !important;\
			left: 12px !important;\
			position: absolute !important;\
			top: 0 !important;\
			width: 25px !important;\
		}\
		.collection {\
			background: url(\"https://slurm.trakt.us/images/episode-collection.png\") no-repeat scroll 0 0 rgba(0, 0, 0, 0) !important;\
			z-index: 2 !important;\
			height: 40px !important;\
			left: 18px !important;\
			position: absolute !important;\
			top: 0 !important;\
			width: 25px !important;\
		}\
	");
	window.addEventListener('load', function() {
		var watchlist = [];
		var collection = [];
		GM_xmlhttpRequest({
			method: "GET",
			url: "http://api.trakt.tv/user/library/movies/collection.json/" + GM_getValue("apikey") + "/" + GM_getValue("username") + "/min",
			onload: function(response){
				var json = JSON.parse(response.responseText);
				for(var i = 0; i < json.length; i++)
					collection.push(json[i].imdb_id);
				var mr = document.getElementsByClassName("media_result");
				for(var i = 0; i < mr.length; i++)
				{
					if(collection.indexOf(mr[i].id) > -1)
					{
						var overlay = document.createElement("div");
						overlay.classList.add("collection");
						mr[i].appendChild(overlay);
					}
				}
			}
		});
		GM_xmlhttpRequest({
			method: "GET",
			url: "http://api.trakt.tv/user/watchlist/movies.json/" + GM_getValue("apikey") + "/" + GM_getValue("username"),
			onload: function(response){
				var json = JSON.parse(response.responseText);
				for(var i = 0; i < json.length; i++)
					watchlist.push(json[i].imdb_id);
				var mr = document.getElementsByClassName("media_result");
				for(var i = 0; i < mr.length; i++)
				{
					if(watchlist.indexOf(mr[i].id) > -1)
					{
						var overlay = document.createElement("div");
						overlay.classList.add("watchlist");
						mr[i].appendChild(overlay);
					}
				}
			}
		});
		var mres = document.getElementsByClassName("media_result");
		for(var i = 0; i < mres.length; i++)
		{
			var imdb = mres[i].getElementsByClassName("imdb")[0];
			var traktlink = document.createElement("a");
			traktlink.href = "http://trakt.tv/search/movies?q=" + mres[i].id;
			traktlink.target = "_blank";
			traktlink.innerHTML = "Trakt";
			traktlink.className = "action icon2";
			imdb.parentNode.appendChild(traktlink);
			imdb.parentNode.style.width = "auto";
		}
	}, false);
}
