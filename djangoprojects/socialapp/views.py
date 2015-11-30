from django.shortcuts import render

# Create your views here.
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.utils import timezone
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User as AuthUser
import crossbarhttp
import json

from .models import User, Message, Post, Conversation, Comment, PostLike, CommentLike

# Create your views here.

def registeruser(request):
	authUser = AuthUser.objects.create_user(username=request.POST['username'], email=request.POST['email'] ,password=request.POST['password'], first_name=request.POST['firstname'], last_name=request.POST['lastname'])
	user = User(user=authUser)
	user.save()
	return HttpResponseRedirect(reverse('django.contrib.auth.views.login', ))

@login_required
def index(request):
	return HttpResponseRedirect(reverse('django.contrib.auth.views.login', ))

@login_required
def loginuser(request):
	user = User.objects.get(user_id = request.user.id) 
	return HttpResponseRedirect(reverse('socialapp:detail', args=(user.id,), ))

@login_required
def detail(request, user_id):
	user = get_object_or_404(User, pk=user_id)
	allPosts = Post.objects.all()
   	return render(request, 'socialapp/detail.html', {'user': user, 'allPosts' : allPosts})

@login_required
def createpost(request, user_id):
	client = crossbarhttp.Client("http://127.0.0.1:8080/publish")
	user = get_object_or_404(User, pk=user_id)
	u = User.objects.get(user_id = request.user.id) 
	post = Post(title=request.POST['title'], value=request.POST['value'], user=u, date=timezone.now())
	post.save()
	client.publish("post", post.title, post.value, post.id, user.id)
	return HttpResponseRedirect(reverse('socialapp:detail', args=(user.id,)))

@login_required
def commentpost(request, user_id, post_id):
	#client = crossbarhttp.Client("http://127.0.0.1:8080/publish")
	post = get_object_or_404(Post, pk=post_id)
	user = get_object_or_404(User, pk=user_id)
	comment = Comment(value=request.POST['comment'], user=user, post=post, date=timezone.now())
	comment.save()
	#client.publish("comment", comment.value, comment.id, comment.post.id, comment.user.id)
	return HttpResponseRedirect(reverse('socialapp:detail', args=(user.id, )))

@login_required
def likepost(request, user_id, post_id):
	post = get_object_or_404(Post, pk=post_id)
	user = get_object_or_404(User, pk=user_id)
	like = PostLike(user=user, post=post, date=timezone.now())
	like.save()
	return HttpResponseRedirect(reverse('socialapp:detail', args=(user.id, )))

@login_required
def likecomment(request, user_id, post_id):
	post = get_object_or_404(Post, pk=post_id)
	user = get_object_or_404(User, pk=user_id)
	comment = get_object_or_404(Comment, pk=request.POST['comment'])
	like = CommentLike(user=user, comment=comment, date=timezone.now())
	like.save()
	return HttpResponseRedirect(reverse('socialapp:detail', args=(user.id, )))

@login_required
def createconversation(request, user_id):
	client = crossbarhttp.Client("http://127.0.0.1:8080/publish")
	user = get_object_or_404(User, pk=user_id)
	otherUser = get_object_or_404(User, pk=request.POST['friend'])
	for conv in user.conversation_set.all():
		if conv.users.count() == 2:
			if otherUser in conv.users.all():
				client.publish("talk", conv.id, user.id)
				return HttpResponseRedirect(reverse('socialapp:detail', args=(user.id, )))
	conversation = Conversation(date=timezone.now())
	conversation.save()
	conversation.users.add(user)
	conversation.users.add(otherUser)
	conversation.save()
	client.publish("conversation", conversation.id, user.id, otherUser.user.username)
	return HttpResponseRedirect(reverse('socialapp:detail', args=(user.id, )))

@login_required
def createmessage(request, user_id, conversation_id):
	client = crossbarhttp.Client("http://127.0.0.1:8080/publish")
	user = get_object_or_404(User, pk=user_id)
	conversation = get_object_or_404(Conversation, pk=conversation_id)
	message = Message(value=request.POST['message'], user=user, conversation=conversation, date=timezone.now())
	message.save()
	client.publish("message", message.value, message.user.id, message.user.user.username, conversation.id)
	return HttpResponseRedirect(reverse('socialapp:detail', args=(user.id, )))