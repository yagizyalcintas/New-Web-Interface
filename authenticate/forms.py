from django import forms
from django.forms import ModelForm
from authenticate.models import Post


class loginForm(ModelForm):
    Username = forms.CharField(
        required=False,
        label="Username",
        widget=forms.TextInput(
            attrs={"class": "form-control", "placeholder": "Enter username"}
        ),
    )
    Password = forms.CharField(
        required=False,
        label="Password",
        widget=forms.TextInput(
            attrs={
                "class": "form-control",
                "type": "password",
                "placeholder": "Enter password",
            }
        ),
    )
    Remember = forms.BooleanField(
        required=False,
        widget=forms.CheckboxInput(
            attrs={"class": "form-check-input", "type": "checkbox", "name": "remember"}
        ),
    )

    class Meta:
        model = Post
        fields = "__all__"
