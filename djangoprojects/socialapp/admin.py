from django.contrib import admin

# Register your models here.

from .models import User, Message, Conversation, Post, Comment, PostLike, CommentLike

class MessageInLine(admin.TabularInline):
	model = Message
	extra = 0

class ConversationAdmin(admin.ModelAdmin):
	inlines = [MessageInLine]
	list_display = ('date' , 'Users')
	list_filter = ['date']

class CommentLikeInLine(admin.TabularInline):
	model = CommentLike
	extra = 0

class CommentInLine(admin.TabularInline):
	model = Comment
	extra = 0

class PostLikeInLine(admin.TabularInline):
	model = PostLike
	extra = 0

class PostAdmin(admin.ModelAdmin):
	inlines = [CommentInLine, PostLikeInLine]
	list_filter = ['date']
	list_display = ('title', 'value', 'user', 'date')

class CommentAdmin(admin.ModelAdmin):
	inlines = [CommentLikeInLine]
	list_filter = ['date']
	list_display = ('value', 'user', 'post', 'date')

class PostInLine(admin.TabularInline):
	model = Post
	extra = 0

class UserAdmin(admin.ModelAdmin):
	list_display = ('Username', 'Name', 'Email', 'Date_joined', 'Friends')
	inlines = [PostInLine, CommentInLine, CommentLikeInLine, PostLikeInLine]

admin.site.register(User, UserAdmin)
admin.site.register(Conversation, ConversationAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)