from django.forms import ModelForm
from .models import User
from django.contrib.auth.models import User as AuthUser

class RegistrationForm(ModelForm):
	class Meta:
		model = AuthUser
		fields = ['first_name', 'last_name', 'email','username', 'password', ]
