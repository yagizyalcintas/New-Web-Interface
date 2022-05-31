"""mussels URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from interface import views as interface
from authenticate import views as authenticate
from sensors import views as sensors

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", interface.home_page, name="home_page"),
    path("login/", authenticate.login_request, name="login"),
    path("logout/", authenticate.logout_request, name="logout"),
    path("showBox/", sensors.show_boxes, name="showBoxes"),
    path(
        "groupsData/<int:id>",  # brings last timestamps and status for all mussels in a particular group
        sensors.get_mussel_group_timestamps,
        name="groupsOverview",
    ),
    path("getLastUpdated/", sensors.get_groups_timestamps, name="groupsTimestamps"),
    path(
        "box_mussels_names/<int:id>", sensors.get_mussel_group_names, name="groupNames"
    ),
    path(
        "box_mussels_data/<int:id>",  # brings the last voltage values of all mussels in a particular box
        sensors.get_mussel_group_data,
        name="groupData",
    ),
    path(
        "draw_all_mussel_data/<int:id>",
        sensors.draw_mussel_graph_all,
        name="musselAllDatas",
    ),
    path(
        "draw_particular_mussel_data/<int:boxId>/<int:mussId>/<int:interval>",
        sensors.draw_mussel_particular_graph,
        name="musselParticularDatas",
    ),
    path(
        "export_mussel_csv/<int:id>/<int:from_timestamp>/<int:to_timestamp>",
        sensors.export_mussel_data,
        name="export",
    ),
    path(
        "get_mussel_data/<int:id>",
        sensors.get_mussel_data,
        name="musselData",
    ),
]
