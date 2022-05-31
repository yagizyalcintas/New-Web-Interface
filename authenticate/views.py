from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from django.urls import reverse
from authenticate.forms import loginForm
from django.contrib.auth import authenticate, login, logout


def CSRF_redirect(request, reason=""):
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse("homePage"))
    my_dict = {
        "warning_message": "An error has occured, please login again.",
        "form": loginForm(),
    }
    return render(request, "login.html", context=my_dict)


# Handles login request
def login_request(request, redirectLink=None):

    warning = ""

    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse("home_page"))

    if request.method == "POST":
        form = loginForm(request.POST)
        # Check if login is valid
        if form.is_valid():
            # Try to authenticate user
            username = form.cleaned_data["Username"]
            password = form.cleaned_data["Password"]
            remember = form.cleaned_data["Remember"]
            user = authenticate(username=username, password=password)
            # Check if user exists
            if user:
                # Check if user account is active
                if user.is_active:
                    # Log in user
                    login(request, user)
                    if not remember:
                        request.session.set_expiry(0)
                    if redirectLink is not None:
                        return HttpResponseRedirect(reverse(redirectLink))
                    return HttpResponseRedirect(reverse("home_page"))
                else:
                    warning = "User is deactivate, please contact the administrators."
            # If user doesnt exist -> incorrect username and/or password
            else:
                warning = "Incorrect username/password."
    context = {"warning_message": warning, "form": loginForm()}
    return render(request, "login.html", context=context)


def logout_request(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))
