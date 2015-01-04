var general = {
	frameRate: 60,
	speed: 1,
	pageTransitionDuration: 1000
};
window.general = general;

/*requirejs*/(/*['jquery', "ptpim"], */function ($, PageToPage) {
	"use strict";

	var general = general || window.general;

	/*  create jump page loader
	-------------------------------------------------- */
	window.ptpTransit       = new PageToPage();
	
	//  a function for rebinding-s
	var defineptpim = function() {
		//  bind events of ptpTransit

		// how to use delta: 
		// ProgressingVal = delta * (NewVal - OldVal) + OldVal

		// ev: 
		//   {} <-- a blank object (yet)
		// data: 
		//   request response data
		// nxt:
		//   animations are expected, call nxt after they are ended
		window.ptpTransit.on("requeststart", function (ev, nxt) { // request events for contents // animation and request at the same time
				$("#page").addClass("pvsp").css({"left": ((  0   * (-100 - 0))+ 0)+"%"});
				$("#title > .container, #description > .container").addClass("pvsT").css({"top": 0+"%"});

				animate({
					delay: 1000/general.frameRate,
					duration: general.pageTransitionDuration/general.speed,
					delta: (delta.po5),
					step: function(delta) {
						$(".pvsp").css({ left: ((delta * (-100 - 0))+    0)+"%", opacity: delta * (0 - 1) + 1 });
// 						$(".pvsT").css({  top: ((delta * ( 100 - 0))+    0)+"%"});

						if (delta >= 1) {
							$(".pvsp").remove();
							nxt();
						}
					}
				});
				animate({
					delay: 1000/general.frameRate,
					duration: (general.pageTransitionDuration/2) /general.speed,
					delta: (delta.po5),
					step: function(delta) {
						$(".pvsT").css({  top: ((delta * ( 100 - 0))+    0)+"%"});

						if (delta >= 1) {
							$(".pvsT").remove();
						}
					}
				});

			})
			.on("receive", function (ev, data, nxt) {
				var $newPageDOM = $("<html></html>").html(data.responseText);
				$("title").html(data.responseText.match(/<title>([^;]*)<\/title>/)[1]);
				$("#body > .container").append(
					$("#page", $newPageDOM).addClass("nxtp").css({ left: 100+"%", opacity: 0 })
				);
				$("#title > .container, #description > .container", $newPageDOM).addClass("nxtT").css({ top: -100+"%" });
				$("#description").append($("#description > .container", $newPageDOM));
				$("#title").append($("#title > .container", $newPageDOM));

				animate({
					delay: 1000/general.frameRate,
					duration: general.pageTransitionDuration/general.speed,
					delta: makeEaseOut(delta.po5),
					step: function(delta) {
						$(".nxtp").css({ left: ((delta * (0 - +100))+ +100)+"%", opacity: delta * (1 - 0) + 0 });
// 						$(".nxtT").css({  top: ((delta * (0 - -100))+ -100)+"%" })

						if (delta >= 1) {
							$(".nxtp").removeClass("nxtp");
							nxt();
						}
					}
				});
				animate({
					delay: 1000/general.frameRate,
					duration: (general.pageTransitionDuration/2) /general.speed,
					delta: makeEaseOut(delta.po5),
					step: function(delta) {
						$(".nxtT").css({  top: ((delta * (0 - -100))+ -100)+"%" })

						if (delta >= 1) {
							$(".nxtT").removeClass("nxtT");
						}
					}
				});
			})
			.on("requestend", function (ev, data) {})
			.on("requesterror", function (ev, data) { // requesterror: would be fired when XMLHttpRequest()-s returns a "non-2XX" staus
				$("#errorAlertBox").html(data.status + " " + (data.status == 0 ? "unknown error" : data.statusText) );
				$("#errorAlertBox, #errorBackHome").fadeIn(750); console.log(ev, data);
			})
			.init({ // initalize ptpTransit
				afterInit: function() {},
				reactLinksQuery: "a:not(.externalLink)", // string [CSS Query]
				// reactLinkElements: $("a:not(.externalLink)").get() // NodeList or Array of Elements
			});



/*
		window.ptpTransit.on("requeststart", function (ev, nxt) { // request events for contents
				// $("#body").animate({
				// 	opacity: 0
				// }, 400);

				// setTimeout(function() {
				// 	$("#page").addClass("pvsp").remove();
				// 	nxt();
				// }, 500);
				
				nxt();
			})
			.on("receive", function (ev, data, nxt) {
				var oldPage = $("#page").addClass("pvsp").css("left", "0%");
				// var newPage = $("#page", data.responseText).addClass("nxtp").css("left", "100%");
				var newPage = $("#page", $("<div></div>").html(data.responseText)).addClass("nxtp").css("left", "100%");

				$("#body > .container").prepend(newPage);
				$("title").html(data.responseText.match(/<title>([^;]*)<\/title>/)[1]);

				nxt();
			})
			.on("requestend", function (ev, data) {
				$(".pvsp, .nxtp").animate({
					left: "-=100%"
				}, 400, function() {
					$("#page.pvsp").remove();
					$("#page.nxtp").removeClass("nxtp");
				});
			})
			// requesterror: would be fired when XMLHttpRequest()-s returns a "non-2XX" staus
			.on("requesterror", function (ev, data) {
				$("#errorAlertBox").html(data.status + " " + (data.status == 0 ? "unknown error" : data.statusText) );
				$("#errorAlertBox, #errorBackHome").fadeIn(750);
				console.log(ev, data);
			})
			//  initalize ptpTransit
			.init({
				afterInit: function() {},
				reactLinksQuery: "a:not(.externalLink)", // string [CSS Query]
				// reactLinkElements: $("a:not(.externalLink)").get() // NodeList or Array of Elements
			});
*/




	}

	defineptpim();

	$("#errorBackHome").click(function() {
		$("#loader > svg").css({fill: "#CCAA33"});
		$("#errorAlertBox, #errorBackHome").fadeOut(750);
		
		setTimeout(function() {
			// create new PageToPage Object and avoid the error
			window.ptpTransit = new PageToPage();
			//  bind events of ptpTransit again
			defineptpim();
			//  jumo back home using API
			window.ptpTransit.jumpTo("/ptpim/");
		}, 400);
	});
	


}(jQuery, PageToPage));






// requestAnimationFrame for all browsers. 
// The name is changed to prevent conflict.
if (!window.requestAnimeFrame)
	(function() {
		var requestAnimeFrame = window.requestAnimationFrame || 
								window.mozRequestAnimationFrame ||
								window.webkitRequestAnimationFrame || 
								window.msRequestAnimationFrame || function(raf) {raf()};

		window.requestAnimeFrame = requestAnimeFrame;
	})();

// code from http://javascript.info/tutorial/animation
function animate(opts) {
  var start = new Date;
  var id = setInterval(function() {
    var timePassed = new Date - start;
    var progress = timePassed / opts.duration;
    if (progress > 1) progress = 1;

    var delta = opts.delta(progress)
    window.requestAnimeFrame(function() {
      opts.step(delta);
    });

    if (progress == 1) clearInterval(id)

  }, opts.delay || 10);
}
var delta = {
  linear: function (pgs) { return pgs },
  quad: function (pgs) { return Math.pow(pgs, 2) },
  po5: function (pgs) { return Math.pow(pgs, 5) },
  circ: function(pgs) { return 1 - Math.sin(Math.acos(pgs)) },
  back: function(pgs) { return Math.pow(pgs, 2) * ((x + 1) * pgs - x) },
  elastic: function (pgs, n) { return Math.pow(2, 10*(pgs-1)) * Math.cos(20*Math.PI*n/3*pgs) }
}
var makeEaseOut = function (dlt) {
  return function(pgs) {
    return 1 - dlt(1 - pgs)
  }
};
var makeEaseInOut = function (dlt) {
  return function(pgs) {
    return ((pgs < .5 ? 
    	( (2*0) - dlt(2 * (0 + pgs)) ) : 
    	( (2*1) - dlt(2 * (1 - pgs)) ) )/2)
  }
};

/*
$(#header #logo .bg > div:nth-of-type(1)
#header #logo .bg > div:nth-of-type(2)
#header #logo .bg > div:nth-of-type(3)
#header #logo .bg > div:nth-of-type(4)
#header #logo .bg > div:nth-of-type(5))
*/
(function() {
	var general = general || window.general;


	$("#page").css({ left: ((1-0)*100)+"%", opacity: 0 });
	$("#title > .container, #description > .container").css({top: (-100)+"%" });

	var ele = $("#header");
	$(ele).css({top: (0-1) * $(ele).height()*1.2 });

	var ele = $("#header #logo");
	var eleWidth = $(ele).width()+parseInt($(ele).css("padding-right"));
	$(ele).css({left: (0-1) * eleWidth*1.2 });

	var ele = $("#header #logo > .container > em");
	var eleWidth = $(ele).width()+parseInt($(ele).css("padding-right"))*2;
	$(ele).css({left: (0-1) * eleWidth*1.2 });

	$("#header #logo .bg > div").css({top: 100+"%"});

	$("#loaderLayer").css({display: "block"});

	// change the timeline to change animation
	var logobgDelay = 2000;
	var timeline = [{
		start: 0  +1000,
		end: general.pageTransitionDuration  +1000,
		delta: makeEaseOut(delta.po5), // quad
		func: function (delta) {
			$("#page").css({ left: ((1-delta)*100)+"%", opacity: delta });
			$("#title > .container, #description > .container").css({top: ((delta * (0 - -100))+ -100)+"%" });
		}
	}, {
		start: 0  +1000,
		end: 2000  +1000,
		delta: makeEaseOut(delta.po5), // quad
		func: function (delta) {
			var ele = $("#header");
			$(ele).css({top: (delta-1) * $(ele).height()*1.2 });
		}
	}, {
		start: 0  +1500,
		end: 2000  +1500,
		delta: makeEaseOut(delta.po5), // quad
		func: function (delta) {
			var ele = $("#header #logo");
			var eleWidth = $(ele).width()+parseInt($(ele).css("padding-right"));
			$(ele).css({left: (delta-1) * eleWidth*1.2 });
		}
	}, {
		start: 0  +2500,
		end: 1500  +2500,
		delta: makeEaseOut(delta.po5), // quad
		func: function (delta) {
			var ele = $("#header #logo > .container > em");
			var eleWidth = $(ele).width()+parseInt($(ele).css("padding-right"))*2;
			$(ele).css({left: (delta-1) * eleWidth*1.2 });
		}
	}, {
		start: 0  +logobgDelay,
		end: 1000  +logobgDelay,
		delta: makeEaseOut(delta.po5), // quad
		func: function (delta) {
			$("#header #logo .bg > div:nth-of-type(1)").css({top: (100 - (delta*(100-20*0)) )+"%"})
		}
	}, {
		start: 200  +logobgDelay,
		end: 1200  +logobgDelay,
		delta: makeEaseOut(delta.po5),
		func: function (delta) {
			$("#header #logo .bg > div:nth-of-type(2)").css({top: (100 - (delta*(100-20*1)) )+"%"})
		}
	}, {
		start: 400  +logobgDelay,
		end: 1400  +logobgDelay,
		delta: makeEaseOut(delta.po5),
		func: function (delta) {
			$("#header #logo .bg > div:nth-of-type(3)").css({top: (100 - (delta*(100-20*2)) )+"%"})
		}
	}, {
		start: 600  +logobgDelay,
		end: 1600  +logobgDelay,
		delta: makeEaseOut(delta.po5),
		func: function (delta) {
			$("#header #logo .bg > div:nth-of-type(4)").css({top: (100 - (delta*(100-20*3)) )+"%"})
		}
	}, {
		start: 800  +logobgDelay,
		end: 1800  +logobgDelay,
		delta: makeEaseOut(delta.po5),
		func: function (delta) {
			$("#header #logo .bg > div:nth-of-type(5)").css({top: (100 - (delta*(100-20*4)) )+"%"})
		}
	}, {
		start: 1950  +logobgDelay,
		end: 2000  +logobgDelay,
		delta: (delta.linear),
		func: function (delta) {
			$("#loaderLayer").css({display: "none"});
		}
	}];


	var frameRate    = general.frameRate, // fps
		speed        = general.speed,
		duration     = logobgDelay+2000, // ms
		frameCounter = 0;

	animate({
		delay: 1000/frameRate,
		duration: duration/speed,
		delta: delta.linear,
		step: function(delta) {
			var t = delta*duration;
			// var cf = delta*duration*frameRate/1000; // var rf = ++frameCounter;

			for (var i = 0; i < timeline.length; i++) {
				var thisTL    = timeline[i];
				var thisDur   = thisTL.end - thisTL.start;
				var thisT     = ((t - thisTL.start) <= thisDur ? t : thisTL.end) - thisTL.start;
					thisT     = thisT >= 0 ? thisT : 0;
				var thisPgs   = thisT / thisDur;
				var thisDelta = thisTL.delta(thisPgs);

				if (thisDelta > 0)
					thisTL.func(thisDelta);
			}
		}
	});

}())