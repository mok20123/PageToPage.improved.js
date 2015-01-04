/* PageToPage.js Beta [GTM+8]201405102124 build
 * 
 * to change the webpage w\o jumping page 
 * (requires browser support for history.pushState and XMLHttpRequest)
 * 
 * Copyright © 2014 mok20123, All rights reserved.
 * 
 * 
 * About Author:
 *  Hi I am mok20123, my real name is Alan. 
 *  I am a student in Hong Kong.
 *  
 *  I am now([GTM+8]201405102124) 
 *  helping school to redesign the website
 *  and designing the website for 
 *  "Hong Kong Secondary Students Web Design Challenge Award 2014" .
 *  
 *  This lib is a part of my new school website and 
 *  also the website for "Hong Kong Secondary Students Web Design Challenge Award 2014" 
 *
*/
// --> make HTML HTTP request
// --> jump page and the events

var PageToPage = PageToPage || {
	// """""prevent errors"""""
	firstLoad: true, // handle the end animation of loading new page for the 1st load
	transiting: false, // prevent jump page again while jumping page
	lastReactedURL: window.location.href,
	// """""DEBUG"""""
	debugMode: false,
	// """""General Settings"""""
	duration: 1000,
	internalLinkQuery: ":not(.externalLink)",
	// """""in app helper function"""""
	helpers: {},
	// """""reqested datas"""""
	htmlRequestData: undefined,
	htmlRequestElement: undefined,
	loadedResources: [],
	// """""Custom Events"""""
	onerror: function () {},
	onrequeststart: function () {},
	onreceive: function () {},
	onrequestend: function () {},
	XMLHttpRequest: {
	},
	doneLoad: {
	},

	temp: {}
};

// '''''support changing'''''
PageToPage.checkSupports = function (theSupports) { // ["history.pushState", "document.body.style.backgroundSize", "document.body.style.animation"]
	return /*0//*/history.pushState?1:0;
};
PageToPage.handleNotSupport = function (theSupports) {
	return /*0//*/history.pushState?1:0;
};

if (PageToPage.checkSupports) {

	(function (history) {
		var pushState = history.pushState;
		history.pushState = function (state) {
			pushState.apply(history, arguments);
			window.onpopstate({state: state});
		};
	}(window.history));

	// '''''load function'''''
	PageToPage.load = function (options) {
		defaultSettings = {
			doneLoad: function() {},
			debugMode: false, // Boolean
			animationDuration: 1000, // Number [Millisecond(s)|<ms>]
			internalLinkQuery: ":not(.externalLink)" // string [CSS Query]
		};
		options = options || defaultSettings;
		
		for (var prop in defaultSettings)
			PageToPage[prop] = options[prop] || defaultSettings[prop];
		
		PageToPage.detectEvents();
		
		PageToPage.doneLoad();
	};

	// '''''data stuff'''''
	//PageToPage.prepareData = function () {};
	//PageToPage.updateData = function () {};

	// '''''Event Stuff'''''
	PageToPage.detectEvents = function () {
		
		// detect link clicking
		function asLinkClicked(e) {
			e.preventDefault();
			e.stopPropagation();

			PageToPage.helpers.pushState($(this).attr("href"));
		}
		$("body").delegate("a"+PageToPage.internalLinkQuery, "click", asLinkClicked);
		
		// popstate(going forward or backward in history)
		window.onpopstate = window.onpushstate = function (state) {
			PageToPage.page.start(state);
		};

	};
	PageToPage.error = function (code, description) { /* Mirai: 不愉快です（Fuyukai desu） */};
	PageToPage.requestError = function (requestData) {
		console.log(requestData || {});

		PageToPage.error(requestData.status, requestData.statusText);
	};
	
	
	// '''''Data Content Change Handler'''''
	PageToPage.dataContentHandler = function () {
		return PageToPage.onreceive.apply(this, arguments);
	};
	
	// '''''page transition'''''
	// '''''page processors (changer, animator & remover)'''''
	PageToPage.page = {
		start: function () { // 空: そう、ゲーム始めよう！
			if (!PageToPage.transiting && PageToPage.lastReactedURL !== window.location.href) {
				PageToPage.transiting = true;
				PageToPage.lastReactedURL = window.location.href;

				PageToPage.page.finishLastPage();
			}
			else if (PageToPage.transiting)
				PageToPage.helpers.pushState(PageToPage.lastReactedURL);
		},
		finishLastPage: function () {
			PageToPage.onrequeststart(PageToPage.page.receiveNewPage);
		},
		receiveNewPage: function () {
			var data = PageToPage.helpers.XMLrequest(window.location.href);
			
			if (!data) {
				console.log("dataReciveError");
				return;
			}
			if (data.status == 200) {
				PageToPage.htmlRequestData = data;
				PageToPage.htmlRequestElement = $("<div></div>").html(PageToPage.htmlRequestData.responseText);

				setTimeout(PageToPage.page.changePage);
			}
			else {
				PageToPage.requestError(data);
			}
		},
		changePage: function () {
			PageToPage.onreceive(PageToPage.htmlRequestElement, PageToPage.page.beginNew);
		},
		beginNew: function () { // 境界の彼方: a new story begins at the end, waiting to be discovered...
			PageToPage.onrequestend();
			PageToPage.transiting = false;
		}
	};

	// '''''Page to page API helper'''''
	/* """"""""""Helper"""""""""" */
	PageToPage.helpers.matchHref = function (href) {
		return (window.location.href.match(href + "$"));
	};
	PageToPage.helpers.XMLrequest = function (href) {
		if (!href || typeof href !== "string")
			return;

		var xhr = new XMLHttpRequest();
		xhr.open("GET", href, false);

		xhr.setRequestHeader('Content-Type', 'text/html');
		xhr.send();

		return xhr;
	};
	PageToPage.helpers.XMLrequestWithProgress = function (href) {
		if (!href || typeof href !== "string")
			return;
		
		var xhr = new XMLHttpRequest();
		
		xhr.onprogress = function() {};
		xhr.open("GET", href, true);
		xhr.onreadystatechange = function() {};

		xhr.setRequestHeader('Content-Type', 'text/html');
		xhr.send(null);
		
		return xhr;
	};
	PageToPage.helpers.pushState = function (href) {
		if (!PageToPage.transiting && !PageToPage.helpers.matchHref(href))
			window.history.pushState({}, null, href);
	}
}



window.PageToPage = PageToPage;




