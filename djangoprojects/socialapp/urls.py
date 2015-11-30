from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
	url(r'^registeruser/$', views.registeruser, name='registeruser'),
    url(r'^loginuser/$', views.loginuser, name='loginuser'),
    url(r'^(?P<user_id>[0-9]+)/$', views.detail, name='detail'),
    url(r'^(?P<user_id>[0-9]+)/createpost/$', views.createpost, name='createpost'),
    url(r'^(?P<user_id>[0-9]+)/post/(?P<post_id>[0-9]+)/commentpost/$', views.commentpost, name='commentpost'),
    url(r'^(?P<user_id>[0-9]+)/post/(?P<post_id>[0-9]+)/likepost/$', views.likepost, name='likepost'),
    url(r'^(?P<user_id>[0-9]+)/post/(?P<post_id>[0-9]+)/likecomment/$', views.likecomment, name='likecomment'),
    url(r'^(?P<user_id>[0-9]+)/createconversation/$', views.createconversation, name='createconversation'),
    url(r'^(?P<user_id>[0-9]+)/conversation/(?P<conversation_id>[0-9]+)/createmessage/$', views.createmessage, name='createmessage'),
]