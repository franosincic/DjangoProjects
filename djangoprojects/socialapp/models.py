from django.db import models
from django.conf import settings
# Create your models here.

class User(models.Model):
	user = models.OneToOneField(settings.AUTH_USER_MODEL)
	friends = models.ManyToManyField('self', null=True)
	dateOfBirth = models.DateTimeField(null=True)
	profilePic = models.CharField(max_length=100, null=True)
	def __unicode__(self):
		return self.user.username
	def Friends(self):
		return ", ".join([friend.user.username for friend in self.friends.all()])
	def Username(self):
		return self.user.username
	def Name(self):
		return "%s %s" % (self.user.first_name, self.user.last_name)
	def Date_joined(self):
		return self.user.date_joined
	def Email(self):
		return self.user.email
	def ordered_posts(self):
		return self.post_set.all().order_by('-date')

class Conversation(models.Model):
	date = models.DateTimeField(null=True)
	users = models.ManyToManyField(User) 
	def __unicode__(self):
		return "Conversation: %s" % (self.id)
	def Users(self):
		return ", ".join([user.user.username for user in self.users.all()])
	def last_messages(self):
		orderedMessages = self.message_set.all().order_by('-date')
		return orderedMessages[:5]
	def ordered_messages(self):
		return self.message_set.all().order_by('-date')

class Message(models.Model):
	value = models.CharField(max_length=200)
	date = models.DateTimeField(null=True)
	user = models.ForeignKey(User)
	conversation = models.ForeignKey(Conversation)
	def __unicode__(self):
		return "Message: %s User: %s Conversation: %s" % (self.value, self.user.user.username, self.conversation.id)

class Content(models.Model):
	value = models.CharField(max_length=200)
	date = models.DateTimeField(null=True)
	user = models.ForeignKey(User)
	class Meta:
		abstract = True

class Post(Content):
	title = models.CharField(max_length=200)
	def __unicode__(self):
		return "Post: %s User: %s" % (self.title, self.user.user.username)
	def last_comments(self):
		return self.comment_set.all().order_by('-date')[:5]

class Comment(Content):
	post = models.ForeignKey(Post)
	def __unicode__(self):
		return "Comment: %s Post: %s User: %s" % (self.value, self.post, self.user.user.username)

class PostLike(models.Model):
	user = models.ForeignKey(User)
	post = models.ForeignKey(Post)
	date = models.DateTimeField(null=True)
	def __unicode__(self):
		return "Post: %s User: %s" % (self.post, self.user.user.username)

class CommentLike(models.Model):
	user = models.ForeignKey(User)
	comment = models.ForeignKey(Comment)
	date = models.DateTimeField(null=True)
	def __unicode__(self):
		return "Comment: %s Post: %s User: %s" % (self.comment, self.comment.post, self.user.user.username)