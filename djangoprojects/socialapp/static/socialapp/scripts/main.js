window.addEventListener("load", function(){

	var connection = new autobahn.Connection({
		url: 'ws://127.0.0.1:8080/ws',
		realm: 'realm1'
	});

	connection.onopen = function(session) {

		console.log("connected");

		session.subscribe('message', function(args, kwargs) {
			console.log("Got message:", args, kwargs);
			message = args[0];
			user_id = args[1];
			username = args[2];
			conversation = args[3];
			var container = document.getElementById("mesagesContainerDiv" + conversation + "");
			var node = document.createElement("div");
			node.className = "well well-sm";
			var inside = document.createElement("a");
			inside.setAttribute('href', "/socialapp/" + user_id + "/");
			var insideText = document.createTextNode(username);
			inside.appendChild(insideText);
			node.appendChild(inside);
			var nodeText = document.createTextNode(": " + message);
			node.appendChild(nodeText);
			var containerChildren = container.children;
			if (containerChildren.length == 3) {
				var child = container.children[2];
				container.removeChild(child);
			}
			container.insertBefore(node, container.firstChild);	
				
		});

		session.subscribe('post', function(args, kwargs) {
			console.log("Got post:", args[0]);
			console.log("Post:", args[1]);
		});
	};

	connection.onclose = function() {
		console.log("connection lost");
	};

	connection.open();
});