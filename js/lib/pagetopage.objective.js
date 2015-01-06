/**
 * PageToPage.js Beta [GTM+8]201405102124 build
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright © 2014, mok20123
*/
var _BGT = new Date();

//---------- addEventListener and removeEventListener for all browser
(function() {
  if (!Element.prototype.addEventListener) {
    Element.prototype.addEventListener = function(ev, func) {
      return this.attachEvent('on' + ev, func);
    }
    Element.prototype.removeEventListener = function(ev, func) {
      return this.detachEvent('on' + ev, func);
    }
  }
}());

var PageToPage = function() {

		var self = this;

		var transiting         = false, // prevent jump page again while jumping page
			lastReactedURL     = window.location.href,
			
			debugMode          = false,
			
			duration           = 1000,
			reactLinksQuery    = "",
			reactLinkElements  = null, // NodeList or Array of Elements
			
			htmlRequestData    = {},
			// htmlRequestElement = $("<div></div>"),

			events             = {
				error        : [], // [function (ev, data)]
				requeststart : [], // [function (ev, nxt)]
				receiving    : [], // [function (ev, data, nxt)]
				receive      : [], // [function (ev, data, nxt)]
				requestend   : [], // [function (ev, data)]
				requesterror : []  // [function (ev, data)]
			},
			afterInit          = function () {},
			pbf_pushState      = function () {},
			pbf_onpoppushstate = function (state) {};


		/*     history.pushState() redefinition
		****************************** */
		// (function (history) {
		// 	var pushState = history.pushState;
		// 	history.pushState = function (state) {
		// 		return pushState.apply(history, arguments);
		// 	};
		// }(window.history));

		/*     Events
		****************************** */
		var pbf_onpoppushstate = function (state) { // final preprocess
			console.log("arguments of history.pushState:", arguments, new Date() - _BGT);
			pageProcess.start(state);
		};

			
		/*     Helper Functions
		****************************** */
		var helpers            = {
				matchHref: function (href) { 
					// check if current location is the same as the passed one
					return (window.location.href.match(href + "$"));
				},
				// XMLrequest: function (href) {
				// 	if (!href || typeof href !== "string")
				// 		return;

				// 	var xhr = new XMLHttpRequest();
				// 	xhr.open("GET", href, false);

				// 	xhr.setRequestHeader('Content-Type', 'text/html');
				// 	try {
				// 		xhr.send();
				// 	}
				// 	catch (err) {
				// 		when("error", [{}, err]);
				// 	}

				// 	return xhr;
				// },
				XMLrequestWECM: function (href, _USELESS, callback) {
					if (!href || typeof href !== "string")
						return;

					var xhr = new XMLHttpRequest();
					xhr.open("GET", href, false);

					xhr.setRequestHeader('Content-Type', 'text/html');
					try {
						xhr.send();
					}
					catch (err) {
						when("error", [{}, err]);
					}
					finally {
						callback({}, xhr);
					}

					return xhr;
				},
				XMLrequestWE: function (href, xhrOnProgress, xhrOnLoadend) {
					if (!href || typeof href !== "string")
						return;

					var xhr = new XMLHttpRequest();

					xhr.addEventListener("progress", function (evt) {
						// var percentLoaded = (evt.loaded / evt.total) * 100;
						// $('#output').append(percentLoaded + "% loaded\n");
						// $('#avatar-upload-progress .ui-progress-bar-inner').animate({
						// 	'width': percentLoaded + '%'
						// }, 400);
						(xhrOnProgress||function() {})(evt, xhr);
					}, false);
					xhr.open("GET", href, true);
					// xhr.onreadystatechange = function(e) {
					// 	pageProcess.receive(xhr);
					// };
					xhr.onloadend = function(e) {
						(xhrOnLoadend||function() {})(e, xhr);
					};

					xhr.setRequestHeader('Content-Type', 'text/html');
					try {
						xhr.send();
					}
					catch (err) {
						when("error", [{}, err]);
					}

					// return xhr;
				},
				pushState: function (href, state) {
					var state = state || {/*lastRequestData: htmlRequestData*/};

					if (!transiting && !helpers.matchHref(href)) {
						history.pushState(state, null, href);
						pbf_onpoppushstate({state: state, type: "pushstate"});
					}
				},
				// '''''support changing'''''
				checkSupports: function (theSupports) { 
					// ["history.pushState"]
					
					if (!history.pushState) {
						console.log("Your browser doesn't support page to page transition.");
					}
					
					return /*0//*/history.pushState?1:0;
				},
				handleNotSupport: function (theSupports) {
					return /*0//*/history.pushState?1:0;
				}
			};

		/*     handle events
		****************************** */
		var asLinkClicked = function (e) { // action for link clicking
			e.preventDefault(); e.stopPropagation();
			helpers.pushState($(this).attr("href"));

			detectLinks();
		};
		var detectLinks = function (query) { // detect link clicking
			var detectedElements = document.querySelectorAll(reactLinksQuery)/*reactLinkElements*/;

			// $("body").on("click", detectedElements, asLinkClicked);
			[].forEach.call(detectedElements, function(element, index, array) {
				element.addEventListener("click", asLinkClicked);
			});
		};
		var neglectLinks = function (query) { // detect link clicking
			var detectedElements = document.querySelectorAll(reactLinksQuery)/*reactLinkElements*/;

			// $("body").off("click", detectedElements, asLinkClicked);
			[].forEach.call(detectedElements, function(element, index, array) {
				element.removeEventListener("click", asLinkClicked);
			});
		};
		var detectStateEvents = function () { // popstate: going forward or backward in history
			window.addEventListener( "popstate", pbf_onpoppushstate, false);
		};

		/*     handle events APIs
		****************************** */
		self.on = self.bind = function (event, bindFunc) {
			if (bindFunc instanceof Function)
				events[event].push(bindFunc);

			return this;
		};
		var when = function (evtN, argsArray) {
			var bindFuncs = events[evtN];
			
			for (var i = 0; i < bindFuncs.length; i++)
				bindFuncs[i].apply(this, argsArray); // use apply instead
		};

		/*     handle settings
		****************************** */
		self.settings = function (options) {
			if (typeof options == "object") {
				var defaultSettings = {
					debugMode: false, // Boolean
					afterInit: function() {},
					reactLinksQuery: "", // string [CSS Query], i.e.: "a:not(.externalLink)""
					reactLinkElements: null // NodeList or Array of Elements
				};
				// options = options || defaultSettings;

				for (var prop in defaultSettings)
					options[prop] = options[prop] || defaultSettings[prop];

				reactLinkElements = options.reactLinkElements;
				reactLinksQuery = options.reactLinksQuery;
				debugMode = options.debugMode;
				afterInit = options.afterInit;
			}
			return this;
		};

		/*     main
		****************************** */
		self.init = function (options) {
			options = options || undefined;
			self.settings(options);
			detectLinks();
			detectStateEvents();
			
			afterInit();
			
			return this;
		};
		// '''''page processors (changer, animator & remover)'''''
		var pageProcess = {
			start: function () { // 空: そう、ゲーム始めよう！
				if (transiting || lastReactedURL == window.location.href)
					return;

				lastReactedURL = window.location.href;

				neglectLinks(); transiting = true;
				when("requeststart", [{}, pageProcess.request]);
			},
			request: function () {
				// var data = helpers.XMLrequest(window.location.href);
				// htmlRequestData    = data;
				helpers.XMLrequestWE(window.location.href, function(e) {
					console.log(e.loaded / e.total);
					//receiving
				}, function(e, xhr) {
					pageProcess.receive(xhr);
				});

				// if (data && (data.status >= 200 && data.status < 300))
				// 	setTimeout(pageProcess.received);
				// else 
				// 	when("requesterror", [{}, (data || null)]);
			},
			receive: function (data) {
				htmlRequestData = data;

				if (data && (data.status >= 200 && data.status < 300))
					setTimeout(pageProcess.received);
				else 
					when("requesterror", [{}, (data || null)]);
			},
			received: function () {
				when("receive", [{}, htmlRequestData, pageProcess.new]);
			},
			new: function () {
				when("requestend", [{}, htmlRequestData]);
				detectLinks(); transiting = false;
			}
		};
		


		/*     API functions
		****************************** */
		self.jumpTo = function (href) {
			helpers.pushState(href);

			return this;
		};
}



//       PageToPageObjective   = PageToPage         ;
//window.PageToPage            = PageToPage         ;
//window.PageToPageObjective   = PageToPageObjective;

window.PageToPageObjective = PageToPageObjective = window.PageToPage = PageToPage;



















