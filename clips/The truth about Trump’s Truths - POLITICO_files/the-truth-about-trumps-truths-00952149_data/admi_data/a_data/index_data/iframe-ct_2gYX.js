
(function() {

    var touchStartTime = 0;
    var touchStartX = 0;
    var touchStartY = 0;
    var touchEndTime = 0;
    var touchEndX = 0;
    var touchEndY = 0;
    var doDebug = false;
    var pointerDistance = 20;
    var pointerDurationMax = 450;
    var pointerDurationMin = 100;
    var pointerOverride = false;

    var is_fbiab = false;
    var bypass_ignore = false;

    function handlePointerDown(event) {
      try {
        touchStartTime = new Date().getTime();
        touchStartX = event.clientX || event.touches[0].clientX;
        touchStartY = event.clientY || event.touches[0].clientY;
      } catch(err) {
          console.log(err);
      }  
    }
    
    function handlePointerUp(event) {
      try {
        touchEndTime = new Date().getTime();
        touchEndX = event.clientX || event.changedTouches[0].clientX;
        touchEndY = event.clientY || event.changedTouches[0].clientY;
        var touchDuration = touchEndTime - touchStartTime;
        var touchDistanceX = Math.abs(touchEndX - touchStartX);
        var touchDistanceY = Math.abs(touchEndY - touchStartY);

        if (touchDistanceX > pointerDistance || touchDistanceY > pointerDistance) {
        	if (doDebug) {
        		console.log("iframe-ct dropped distance");
        	}
          return false;
        }
        if (touchDuration > pointerDurationMax || touchDuration < pointerDurationMin) {
        	if (doDebug) {
        		console.log("iframe-ct dropped duration");
        	}
          return false;
        }
        return true;
      } catch(err) {
        console.log(err);
        return false;
      }  
    }

    try {
			function getUrlVars() {
				var vars = {};
				var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
			  		vars[key] = value;
				});
				return vars;
			}

			var get_params = getUrlVars();
			var click_url = get_params["satrack"];
			var click_made = false;
			var checking_pointer = false;

			if (!click_url) {
				click_url = get_params["click"];
				if (!click_url) {
					//console.log("no click argument found")
					return;
				}
			}

			try {
		    var doDebugStr = get_params["sadebug"];
		    if (doDebugStr && doDebugStr == "true") {
		      console.log("iframe-ct debugging")
		      doDebug = true;
		    }

		    var pointerDistanceStr = get_params["pdis"];
		    if (pointerDistanceStr) {
		      var pointerDistanceInt = parseInt(pointerDistanceStr);
		      if (!isNaN(pointerDistanceInt)) {
		        pointerDistance = pointerDistanceInt;
		        console.log('iframe-ct pdis ' + pointerDistance);
		        pointerOverride = true;
		      }
		    }

		    var pointerDurationStr = get_params["pdur"];
		    if (pointerDurationStr) {
		      var pointerDurationInt = parseInt(pointerDurationStr);
		      if (!isNaN(pointerDurationInt)) {
		        pointerDurationMax = pointerDurationInt;
		        console.log('iframe-ct pdurmax ' + pointerDurationMax);
		        pointerOverride = true;
		      }
		    }

		    pointerDurationStr = get_params["pdurmin"];
		    if (pointerDurationStr) {
		      var pointerDurationInt = parseInt(pointerDurationStr);
		      if (!isNaN(pointerDurationInt)) {
		        pointerDurationMin = pointerDurationInt;
		        console.log('iframe-ct pdurmin ' + pointerDurationMin);
		        pointerOverride = true;
		      }
		    }
	    } catch(err) {
	      console.log(err);
	    }


			click_url = decodeURIComponent(click_url);

			if (click_url.indexOf("srv.stackadapt.com") > 0 || click_url.indexOf("satest") > 0) {
				click_url = click_url + "&is=1";
			} else {
				click_url = "";
			}

      try {
        if (click_url && click_url.indexOf("cid=") > 0) {
          var cid = parseInt(click_url.split("cid=").pop().split("&")[0]);
          if (!pointerOverride && !isNaN(cid) && cid > 1357000) {
            pointerDistance = 10;
            pointerDurationMax = 350;
            pointerDurationMin = 100;
          }
        }
        if (click_url && click_url.indexOf("crid=") > 0) {
          var crid = parseInt(click_url.split("crid=").pop().split("&")[0]);
          if (!isNaN(crid) && crid > 7215000) {
            pointerDistance = 10;
            pointerDurationMax = 350;
            pointerDurationMin = 100;
          }
        }
      } catch(err) {
        //console.log(err);
      }

			//console.log(click_url);

			function ignoreClick() {
				if (is_fbiab && !bypass_ignore) {
					try {
						if (window && window.sa_paramjs) {
							//console.log("ignoring due to param");
							window.setTimeout(function(){
								if (window.sa_paramjs_fire) {
									//console.log("ignoring yes");
									return;
								} else {
									bypass_ignore = true;
									//console.log("ignoring no");
									sendClick();
								}

							},500);
							return true;
						}
					}catch(err){
						console.log(err);
						return false;
					}
				} else {
					return false;
				}
			}

			function sendClick() {

				if (ignoreClick()) {
					console.log("ignoring due to param");
					return;
				}

				console.log("iframe-ct sending " + click_url);
				var xhr = new XMLHttpRequest();
				if ('withCredentials' in xhr) {
					xhr.open('GET', click_url, true);
					xhr.withCredentials = true
				}
				else if (typeof XDomainRequest != 'undefined') {
					xhr = new XDomainRequest(); 
					xhr.open('GET', click_url);
				}
				else if (typeof ActiveXObject != 'undefined') {
					xhr = new ActiveXObject('Microsoft.XMLHTTP');
					xhr.open('GET', click_url);
				}
				else {
					xhr = null;
				}
				if (xhr) {
					xhr.send();
				}
			}

	  		window.setTimeout(function(){

				document.body.addEventListener('click',  function () {
					if (click_made) return;
					click_made = true;
					sendClick();

					if (doDebug) {
						console.log("iframe-ct body click");
					}
				});

				var allElements = document.querySelectorAll('*');

				for (var i = 0, len = allElements.length; i < len; i++) {
					var element = allElements[i];
					element.addEventListener('click',  function () {
						if (click_made) return;
						click_made = true;
						sendClick();

						if (doDebug) {
							console.log("iframe-ct click");
						}
					});
					element.addEventListener('pointerdown',  function (event) {
						 handlePointerDown(event);
					});
					element.addEventListener('pointerup',  function (event) {
						if (click_made || checking_pointer) return;
						checking_pointer = true;
						if (handlePointerUp(event)) {
							click_made = true;
							sendClick();

							if (doDebug) {
								console.log("iframe-ct pointer");
							}
						}
						checking_pointer = false;
					});

				}

			}, 1000);


    } catch (e) {
      console.log(e)
    }

    try {
    	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    	if (userAgent.includes("FB_IAB")) {
    		is_fbiab = true;
    	}
    }catch(err){
    	console.log(err);
    }

}());