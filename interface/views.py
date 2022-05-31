from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required(login_url="/login/")
def home_page(request, warning=""):
    user = request.user
    username = user.get_username()
    context = {
        "warning_message": warning,
        "currentUser": username,
    }
    return render(request, "base.html", context=context)
