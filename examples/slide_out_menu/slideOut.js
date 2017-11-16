

///////////////////////////////////////////////////
/////////////// Begin Config Settings /////////////
///////////////////////////////////////////////////
var anchorDiv = "#player-wrapper";
var projectId = "1Jg8RTSL";
var slideOutWidth = "30%";

// one of these must be set to true all others must be false
//----------------------------------
var isForm = false;
var isMenu = true;
var isCustom = false;
//----------------------------------

// if isMenu is true insert menu options here. Keys are titles, values are node names
var menuItems = {
	"Start":"0 Start",
	"The 1950s" : "1 The 1950s",
	"The 1960s" : "2 The 1960s",
	"The 1970s" : "3 The 1970s",
	"The 1980s / 1990s" : "4 The 1980s / 1990s", 
	"The 2000s" : "5 The 2000s",
	"Now" : "6 Now"
}; 
 
// if isForm is true you can add multiple forms here. keys are the strings in the hotspot api event field
// and values are the form iframe object
var formIframes = {
	"form": '<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSeAWSU3eDxa9BA0fVMdy3tGgJ9Oz6o7__xSa0NPFdYT_AMM5g/viewform?embedded=true" width="300" height="500" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>',
	"form1": ""
}

// if isCustom is true you can add the html in the object below. keys are the strings in the hotspot api event field and values contain the html to be inserted into the slideout panel.
var customPanels = {
	"custom": "<div></div>",
	"custom1": "<p></p>"
}

////////////////////////////////////////////////////
/////////////// End Config Settings ////////////////
////////////////////////////////////////////////////

/// Slideout function declarations

var isShowing = false;
var hotspotEventArray;





/// Menu function declarations

var toggleMenu = function(width){
	var width = width;

	if(isShowing === false){
		$('#rapt-overlay').animate({right:'0'},350);
		raptor.api.pause();
		isShowing = true;
	} else {
	
		$('#rapt-overlay').animate({right:'-' + slideOutWidth },350);
		raptor.api.play();
		isShowing = false;
	}
}

var buildMenu = function(menuObject){
	var menuObject = menuObject;
	var menuDiv = $("<h1>Menu List</h1><div id='nodes'></div>");
	$("#rapt-overlay").append(menuDiv);

	var list = document.createElement('div');
  list.id = "rapt-node-list";

  for(var key in menuObject) {
      // Create menu a items:
      var item = document.createElement('a');
      item.href = "javascript:void(0)";
      item.setAttribute('data-node', menuObject[key]);
      item.className += 'chapter';

      // Set their contents:
      var text = key;
      item.appendChild(document.createTextNode(text));

      // Add it to the list:
      list.appendChild(item);

  }

  
  $("#nodes").append(list);

  $('.chapter').on('click', function(){
    var clip = $(this).data("node");
  	$('#rapt-node-list a').not(this).removeClass('active');
    $(this).addClass('active')
    raptor.api.setNodeByName(clip);
    raptor.api.play();

  })
}


// form function declarations

var toggleForm = function(event){
	var event = event;

	if(isShowing === false){
		$('#rapt-overlay').append(formIframes[event])
		$('#rapt-overlay').animate({right:'0'},350);
		raptor.api.pause();
		isShowing = true;
	} else {
		$('#rapt-overlay').animate({right:'-' + slideOutWidth },350).empty();
		isShowing = false;
		raptor.api.play();
	}

}

// Custom function declarations

var toggleCustom = function(event){
	var event = event;

	if(isShowing === false){
		$('#rapt-overlay').append(customPanels[event])
		$('#rapt-overlay').animate({right:'0'},350);
		raptor.api.pause();
		isShowing = true;
	} else {
		$('#rapt-overlay').animate({right:'-' + slideOutWidth },350).empty();
		raptor.api.play();
		isShowing = false;
	}

}

$(function(){

	$(anchorDiv).append("<div id='rapt-wrapper'><div id='rapt-container'><div id='rapt-overlay'></div></div></div>");
	$("#rapt-overlay").css({"position": "absolute", "top": "0", "right": "-" + slideOutWidth, "z-index": "9999", "height":"100%", "width": slideOutWidth});


	raptor.api.initByProject("#rapt-container" , projectId, {
        name: 'projectName',
        width: "720",
        height: "405",
        secure: true,
        onload: function(){ raptor.api.launch("projectName")}
    });

	raptor.api.on("inboundReady", function(e,d){
		if(isMenu){
			buildMenu(menuItems);
		}
		if(isForm){
			hotspotEventArray = Object.keys(formIframes);
		}
		if(isCustom){
			hotspotEventArray = Object.keys(customPanels);
		}
	})

	raptor.api.on("button", function(e,d){
		var event = d.action;
		if(isMenu){
			if(event === "showMenu"){
				toggleMenu();
			}
		}
		if(isForm && (hotspotEventArray.indexOf(event) > -1)){
			toggleForm(event);
		}
		if(isCustom && (hotspotEventArray.indexOf(event) > -1)){
			toggleCustom(event);
		}
	})

	raptor.api.on("clipSwitch", function(event, data){
		if(isMenu){
			var activeElm = $("a[data-node='" + data.clipname +"']");
			$('#rapt-node-list a').removeClass('active');
			activeElm.addClass('active');
		}
	})
})