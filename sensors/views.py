# from http.client import HTTPResponse
from django.http.response import HttpResponse
from django.shortcuts import render

# from sympy import print_fcode
from sensors.models import Mussel, MusselGroupsMan, Data
import sensors.utils as utilities
import json
import datetime


def get_mussel_groups_overview(request):
    user = request.user
    data = {}
    mussel_groups = MusselGroupsMan.objects.filter(user=user)
    for mussel_group in mussel_groups:
        data[mussel_group.id] = mussel_group.get_mussels_overview()
    return data


def get_mussel_data(request, id):  # , from_timestamp, to_timestamp
    mussel = Mussel.objects.get(id=id, user=request.user)
    data = mussel.get_data(1649159374, 1651142483)
    print("get muss daa")
    print(data)
    return json.dumps(data)


def get_mussel_group_data(
    request, id
):  # brings the last voltage values of all mussels in a particular box
    # print(request.headers)
    mussel_group = MusselGroupsMan.objects.get(id=id, user=request.user)
    data = mussel_group.get_mussels_voltage()
    return HttpResponse(json.dumps(data))


def get_mussel_group_names(request, id):
    mussel_group = MusselGroupsMan.objects.get(id=id, user=request.user)
    names = mussel_group.get_mussels_name()
    return HttpResponse(json.dumps(names))


# def get_mussel_group_last_data(request, id):
#         mussel_group = MusselGroupsMan.objects.get(id=id, user=request.user)
#         last_mussels_group_data = mussel_group.get_mussels_data()


def get_mussel_group_timestamps(
    request, id
):  # brings last timestamps and status for all mussels in a particular group
    # print(request.headers)
    mussel_group = MusselGroupsMan.objects.get(id=id, user=request.user)
    data = {
        "timestamps": mussel_group.get_mussels_timestamp(),
        "status": mussel_group.get_mussels_overview(),
    }
    print("get_mussel_group_timestamps is: ")
    print(data)
    return HttpResponse(json.dumps(data))


def get_groups_timestamps(
    request,
):  ################### returns all of the groups last updated
    mussel_groups = MusselGroupsMan.objects.filter(user=request.user)

    mussels_overview = {}
    for mussel_group in mussel_groups:
        mussels_overview[mussel_group.id] = mussel_group.get_mussels_overview()

    timestamps = {
        i: mussel_groups[i].get_group_timestamp() for i in range(len(mussel_groups))
    }
    data = {"timestamps": timestamps, "status": mussels_overview}
    return HttpResponse(json.dumps(data))


def export_mussel_data(request, id, from_timestamp, to_timestamp):
    mussel = Mussel.objects.get(id=id, user=request.user)
    data = mussel.get_data(from_timestamp, to_timestamp)
    print("export csv data:")
    print(data)
    csv = utilities.generate_csv(data, "%m/%d/%Y, %H:%M:%S")  # SET THE FORMAT
    return csv


# def export_group_data(request, id, from_timestamp, to_timestamp):
#     mussel = Mussel.objects.get(id=id, user=request.user)
#     data = mussel.get_data(from_timestamp, to_timestamp)
#     print("export csv data:")
#     print(data)
#     csv = utilities.generate_csv(data, format)  # SET THE FORMAT
#     return csv


def draw_mussel_graph(request, id, from_timestamp, to_timestamp):
    mussel = Mussel.objects.get(id=id, user=request.user)
    data = mussel.get_data(from_timestamp, to_timestamp)
    return json.dumps(data)


def draw_mussel_graph_all(request, id):
    mussel_group = MusselGroupsMan.objects.get(id=id, user=request.user)
    data = mussel_group.get_group_all_data()
    print("get_group_all_data: ")
    print(data)
    new_dict = {}
    for mussel in data:
        # print(mussel)
        new_dict[mussel] = {
            int(field.time.timestamp()): field.hall_voltage
            for field in data[mussel]  # str(datetime.datetime.fromtimestamp())
        }
    print("data")
    print(
        new_dict
    )  # {1: {1649159469: 1500}, 2: {1649159478: 1500}, 3: {1649159484: 1500}, 4: {1649159490: 1500, 1649166721: 1380}, 5: {1649159496: 1500}, 6: {1649159504: 1500}, 7: {1649159512: 1500}, 8: {1649159521: 1500, 1650542117: 1600, 1650628563: 1700, 1650714977: 1300}}

    return HttpResponse(json.dumps(new_dict))


def draw_mussel_particular_graph(request, boxId, mussId, interval):
    mussel_group = MusselGroupsMan.objects.get(id=boxId, user=request.user)

    data = mussel_group.get_particular_mussel_data(mussId, interval)
    print("draw_mussel_particular_graph: ")
    print(
        data
    )  # {5: <QuerySet [<Data: $2022-04-05 11:50:18+00:00 - $1500>, <Data: $2022-04-05 13:50:43+00:00 - $1600>]>}
    new_dict = {}

    new_dict[mussId] = {
        int(field.time.timestamp()): field.hall_voltage
        for field in data[mussId]  # str(datetime.datetime.fromtimestamp())
    }
    print("data")
    print(new_dict)  # {5: {1649159418: 1500, 1649166643: 1600}}

    return HttpResponse(json.dumps(new_dict))


def recieve_data(request):
    message = request.body.decode("utf-8")
    decoded_message = json.loads(message)

    box = MusselGroupsMan.objects.get(serial=decoded_message["serial"])
    for mussel_data in decoded_message["data"]:
        mussel = box.get_mussel(mussel_data["id"])
        time = datetime.datetime.fromtimestamp(mussel_data["time"])
        try:
            hall_voltage = float(mussel_data["hall"])
        except:
            continue
        new_data = Data(time=time, mussel=mussel, hall_voltage=hall_voltage)
        new_data.save()


def show_boxes(request):
    boxes = MusselGroupsMan.objects.filter(user=request.user)

    boxes_dict = {"boxes": boxes}
    print("boxes dict:")
    print(boxes_dict.values())
    return render(request, "dashboard/dashboard-boxes.html", context=boxes_dict)
