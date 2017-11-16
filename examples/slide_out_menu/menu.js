



var target = document.getElementById('player-wrapper')
// make the API that akamai has already initalized do the things
$(window).bind("load", function() {
    raptor.api.on("inboundReady", function(event, data){
			// take nodes, create an array with their names, sort them by number
			var nodeList = Object.keys(raptor.api.nodes());
			var sortedNodeList= nodeList.sort();
			console.log(sortedNodeList)
			
			var div = document.createElement('div');
			div.id = 'form-field';
			div.innerHTML = "<h1>Menu List</h1><div id='nodes'></div>"
			target.appendChild(div);
			document.getElementById('nodes').appendChild(buildMenu(sortedNodeList));
	
		}); 

    raptor.api.on("clipSwitch", function(event, data){
			var activeElm = $("a[data-node='" + data.clipname +"']");
			console.log(activeElm);
			$('#rapt-node-list a').removeClass('active');
			activeElm.addClass('active');
			$(".final-score").css("display", "none");

			
			
		})

		// raptor.api.on("play", function(event, data){
		// 	$('#form-field').toggle("slide",{direction: 'left'})
		// })


		raptor.api.on('button', function(event,data){
			if(data.action === 'showMenu'){
				console.log('showing');
				raptor.api.pause();
				$('#form-field').toggle("slide",{direction: 'right'})
			}
		})

		  raptor.api.on("clipStart", function(event, data){
		  	
		  })
});
		

function sortNodes (a, b) {
	return a - b;
}

function buildMenu(array) {
  // Create menu div:
  var list = document.createElement('div');
  list.id = "rapt-node-list";

  for(var i = 0; i < array.length; i++) {
      // Create menu a items:
      var item = document.createElement('a');
      item.href = "javascript:void(0)";
      item.setAttribute('data-node', array[i]);
      item.className += 'chapter';

      // Set their contents:
      var text = array[i].substr(array[i].indexOf(' ')+1)
      item.appendChild(document.createTextNode(text));

      // Add it to the list:
      list.appendChild(item);

  }
  return list;
}


var clip;

$(function(){
	$("body").on("click", "#rapt-node-list a", function(e){		
		e.preventDefault();
		$('#rapt-node-list a').not(this).removeClass('active');
    $(this).addClass('active').removeClass('inactive');
    clip = $(this).data("node");
    console.log('playing' + " " [clip]);
    raptor.api.setNodeByName([clip]);
    raptor.api.play();
	})
})

