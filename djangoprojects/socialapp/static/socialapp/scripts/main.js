window.addEventListener("load", function(){

	var connection = new autobahn.Connection({
		url: 'ws://127.0.0.1:8080/ws',
		realm: 'realm1'
	});

	connection.onopen = function(session) {

		console.log("connected");

		//got message
		session.subscribe("message", function(args, kwargs) {
			console.log("Got message:", args, kwargs);
			//remove value in message form textarea
			$(".messageForm").children().children("textarea").val('');
			message = args[0];
			userId = args[1];
			username = args[2];
			conversation = args[3];

			//create new message 
			var container = document.getElementById("mesagesContainerDiv" + conversation + "");
			var node = document.createElement("div");
			var inside = document.createElement("a");
			inside.setAttribute("href", "/socialapp/" + userId + "/");
			var insideText = document.createTextNode(username);
			inside.appendChild(insideText);
			node.appendChild(inside);
			var nodeText = document.createTextNode(": " + message);
			node.appendChild(nodeText);

			//remove oldest message
			var containerChildren = container.children;
			if (containerChildren.length == 5) {
				container.removeChild(container.children[0]);
			}

			//add new message
			container.appendChild(node);	
			parentContainer = container.parentNode.parentNode;
			parentContainer.className = "panel-collapse collapse in";
			parentContainer.setAttribute("aria_expanded","true");
			parentContainer.setAttribute("style", "");
		});

		//got conversation
		session.subscribe("conversation", function(args, kwargs) {
			console.log("Got conversation:", args, kwargs);
			conversation = args[0];
			userId = args[1];
			otherUserUsername = args[2];

			var container = document.getElementById("conversationsContainer" + userId + "");
			var node = document.createElement("div");
			node.className = "panel panel-default";
			var nodeHeading = document.createElement("div");
			nodeHeading.className = "panel-heading";
			var nodeTitle = document.createElement("div");
			nodeTitle.className = "panel-title";
			var inside = document.createElement("a");
			inside.setAttribute("data-toggle", "collapse");
			inside.setAttribute("data-parent", "#conversationsContainer" + userId + "");
			inside.setAttribute("href", "#conversation" + conversation + "");
			var insideTag = document.createElement("b");
			var insideText = document.createTextNode(otherUserUsername);
			insideTag.appendChild(insideText);
			inside.appendChild(insideTag);
			nodeTitle.appendChild(inside);
			nodeHeading.appendChild(nodeTitle);
			node.appendChild(nodeHeading);

			var nodeDiv = document.createElement("div");
			nodeDiv.id = "conversation" + conversation + "";
			nodeDiv.className = "panel-collapse collapse in";
			var nodeBody = document.createElement("div");
			nodeBody.className = "panel-body";
			var messageNode = document.createElement("div");
			messageNode.id = "mesagesContainerDiv" + conversation + "";

			var messageFormNode = document.createElement("form");
			messageFormNode.setAttribute("method", "post");
			messageFormNode.setAttribute("action", "/socialapp/" + userId + "/conversation/" + conversation +  "/createmessage/");
			messageFormNode.className = "messageForm";

			var csrfToken = document.createElement("input");
			var csrfTokenValue = getCookie("csrftoken");
			csrfToken.setAttribute("type", "hidden");
			csrfToken.setAttribute("value", csrfTokenValue);
			csrfToken.setAttribute("name", "csrfmiddlewaretoken");

			var formInside = document.createElement("div");
			formInside.className = "form-group";
			var formInsideText = document.createElement("textarea");
			formInsideText.className = "form-control";
			formInsideText.id = "message";
			formInsideText.setAttribute("rows", "1");
			formInsideText.setAttribute("name", "message");
			formInsideText.setAttribute("value", "");
			formInsideText.setAttribute("placeholder", "Message");

			var formButton = document.createElement("button");
			formButton.setAttribute("value", "Message");
			formButton.setAttribute("type", "submit");
			var formButtonText = document.createTextNode("Message");
			formButton.appendChild(formButtonText);

			messageFormNode.appendChild(csrfToken);
			formInside.appendChild(formInsideText);
			messageFormNode.appendChild(formInside);
			messageFormNode.appendChild(formButton);

			nodeBody.appendChild(messageNode);
			nodeBody.appendChild(messageFormNode);
			nodeDiv.appendChild(nodeBody);
			node.appendChild(nodeDiv);
			container.appendChild(node);

		});
	
		//got talk
		session.subscribe("talk", function(args, kwargs) {
			console.log("Got talk:", args, kwargs);
			conversation = args[0];
			userId = args[1];

			var parentId = "conversationsContainer" + userId + "";
			var container = document.getElementById("conversation" + conversation + "");
			if (container.parentNode.parentNode.id == parentId) {
				container.className = "panel-collapse collapse in";
				container.setAttribute("aria_expanded","true");
				container.setAttribute("style", "");
			}

		});

		// session.subscribe("comment", function(args, kwargs) {
		// 	console.log("Got comment:", args, kwargs);
		// 	comment = args[0];
		// 	commentId = args[1];
		// 	postId = args[2];
		// 	userId = args[3];

		// 	$(".commentPostForm").children().children("textarea").val('');

		// 	var container = document.getElementById("commentContainer" + postId + "");
		// 	var node = document.createElement("div");
		// 	node.className = "panel panel-default";
		// 	var inside = document.createElement("div");
		// 	inside.className = "panel-body";
		// 	var insideText = document.createTextNode(comment);

		// 	inside.appendChild(insideText);
		// 	node.appendChild(inside);
		// 	container.insertBefore(node, container.firstChild);

		// 	var parentContainer = document.getElementById("comment" + postId + "");
		// 	parentContainer.className = "collapse in";
		// 	parentContainer.setAttribute("aria_expanded","true");
		// 	parentContainer.setAttribute("style", "");
		// });

		// session.subscribe('post', function(args, kwargs) {
		// 	console.log("Got post:", args);
		// 	title = args[0];
		// 	post = args[1];
		// 	postId = args[2];
		// 	userId = args[3];

		// 	var container = document.getElementById("postsContainerDiv");
		// 	var node = document.createElement("diV");
		// 	node.className = "panel panel-default";

		// 	var panelHeading = document.createElement("div");
		// 	panelHeading.className = "panel-heading";
		// 	var panelHeadingNode = document.createElement("b");
		// 	var panelHeadingNodeText = document.createTextNode(title);
		// 	panelHeadingNode.appendChild(panelHeadingNodeText);
		// 	panelHeading.appendChild(panelHeadingNode);
		// 	node.appendChild(panelHeading);

		// 	var panelBody = document.createElement("div");
		// 	panelBody.className = "panel-body";
		// 	var panelBodyText = document.createTextNode(post);
		// 	panelBody.appendChild(panelBodyText);
		// 	node.appendChild(panelBody);

		// 	var panelFooter = document.createElement("div");
		// 	panelFooter.className = "panel-footer";
		// 	var likeButton = document.createElement("button");
		// 	likeButton.className = "btn btn-default";
		// 	likeButton.setAttribute("data-toggle", "collapse");
		// 	likeButton.setAttribute("data-target", "#like" + postId + "");
		// 	var likeButtonText = document.createTextNode("Likes");
		// 	likeButton.appendChild(likeButtonText);
		// 	var commentButton = document.createElement("button");
		// 	commentButton.className = "btn btn-default";
		// 	commentButton.setAttribute("data-toggle", "collapse");
		// 	commentButton.setAttribute("data-target", "#comment" + postId + "");
		// 	var commentButtonText = document.createTextNode("Comment");
		// 	commentButton.appendChild(commentButtonText);
		// 	panelFooter.appendChild(likeButton);
		// 	panelFooter.appendChild(commentButton);

		// 	node.appendChild(panelFooter);

		// 	container.insertBefore(node, container.firstChild);
		// });
	};

	connection.onclose = function() {
		console.log("connection lost");
	};

	connection.open();

	//handling message form
	var messageForm = $(".messageForm");
	messageForm.on("submit", function(event) {
		event.preventDefault();
		console.log("uslo");
		$.ajax({
			type: $(this).attr("method"),
			url: $(this).attr("action"),
			data: $(this).serialize(),
			success: function(data) {
				console.log("Form ok!");
			},
			error: function(data) {
				console.log("Form error!");
			}
		});
		return false;
	});

	//handling conversation form
	var conversationForm = $(".conversationForm");
	conversationForm.on("submit", function(event) {
		event.preventDefault();
		$.ajax({
			type: $(this).attr("method"),
			url: $(this).attr("action"),
			data: $(this).serialize(),
			success: function(data) {
				console.log("Form ok!");
			},
			error: function(data) {
				console.log("Form error!");
			}
		});
		return false;
	});


	//handling comment form
	// var commentPostForm = $(".commentPostForm");
	// commentPostForm.on("submit", function(event) {
	// 	event.preventDefault();
	// 	$.ajax({
	// 		type: $(this).attr("method"),
	// 		url: $(this).attr("action"),
	// 		data: $(this).serialize(),
	// 		success: function(data) {
	// 			console.log("Form ok!");
	// 		},
	// 		error: function(data) {
	// 			console.log("Form error!");
	// 		}
	// 	});
	// 	return false;
	// });

	function getCookie(name) {
		var cookieValue = null;
		if(document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				if (cookie.substring(0, name.length + 1 ) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.lenght + 1));
					break;
				}
			}
		}
		return cookieValue.substring(10);
	}

});



