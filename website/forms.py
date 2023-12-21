from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
from django import forms
from django.forms.widgets import PasswordInput, TextInput, Textarea

"""
    Registration Form
"""
class CreateUserForm(UserCreationForm):

    class Meta:

        model = User
        fields = [
            'username',
            'email',
            'password1',
            'password2'
        ]

"""
    Login Form - Authentication
"""
class LoginForm(forms.Form):

    username = forms.CharField(widget=TextInput())
    password = forms.CharField(widget=PasswordInput())


"""
    Upload Form = For handling files
"""
class UploadForm(forms.Form):
    title = forms.CharField(widget=TextInput())
    description = forms.CharField(widget=Textarea(), required=False)
    file = forms.FileField(required=False)
