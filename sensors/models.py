from tkinter import CASCADE
from django.db import models
from django.conf import settings
from django.db.models.deletion import CASCADE
import time
from datetime import timezone
import datetime


class Mussel(models.Model):
    name = models.CharField(max_length=50)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE)
    average = models.IntegerField()

    def get_state(self):
        """
        Get current state of the mussel
        TODO: FIX DOCs.
        """
        current = self.get_current()
        if (datetime.datetime.now(timezone.utc) - current.time).seconds > 60:
            return -1
        elif current.hall_voltage < self.average:
            return 0
        else:
            return 1

    def get_current_timestamp(self):
        # print(self.get_current().time.timestamp())
        return self.get_current().time.timestamp()

    def get_current_voltage(self):
        # print((self.get_current().hall_voltage))
        return self.get_current().hall_voltage

    def get_current(self):
        """
        Returns the current values for the mussel.

        Returns:
            - Data object
        """
        return self.data_fields.last()

    def get_data(self, from_timestamp, to_timestamp=None):
        """
        Gets data of the mussel between two timestamps, returns None if no data is found

        Inputs:
            - from_timestamp: The timestamp to begin looking at.
            - to_timestamp: The timestamp to look towards, defaults to the current time

        Returns:
            - A dictionary of timestamps and values
        """
        if to_timestamp is None:
            to_timestamp = int(time.time())

        data = self.data_fields.filter(
            time__range=(from_timestamp, to_timestamp)
        ).order_by("time")

        ### TODO: Check if there is a faster way, or if there is even a need for a faster way?
        output = {field.time.timestamp(): field.hall_voltage for field in data}
        print("outpuuuuuuuuuuuut")
        print(output)
        return output

    def get_all_data(
        self,
    ):  #######################################EN SON BUNU YAPIYODUN TEK MUSSEL GRAPH ICIN
        allData = self.data_fields.all()
        print(allData)
        output = {field.time.timestamp(): field.hall_voltage for field in allData}  #
        print(output)
        return output

    def get_change(self):
        """
        Gets the change percentage between the last two values recieved

        Returns:
            - Output percentage as float
        """
        entries = [field.hall_voltage for field in self.entriesList.all()[:2]]
        change = (entries[0] - entries[1]) / entries[1] * 100
        return change

    def __str__(self):
        return self.name


class Data(models.Model):
    mussel = models.ForeignKey(Mussel, on_delete=CASCADE, related_name="data_fields")
    time = models.DateTimeField(
        default=datetime.datetime(2016, 11, 1, 7, 15, 12, 655838)
    )
    hall_voltage = models.IntegerField()

    def __str__(self):
        return f"${self.time} - ${self.hall_voltage}"


class MusselGroupsMan(models.Model):
    serial = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=25)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE)

    updated_at = models.DateTimeField(blank=True, null=True)
    mussel1 = models.ForeignKey(Mussel, on_delete=CASCADE, related_name="mussel1")
    mussel2 = models.ForeignKey(
        Mussel, on_delete=CASCADE, blank=True, null=True, related_name="mussel2"
    )
    mussel3 = models.ForeignKey(
        Mussel, on_delete=CASCADE, blank=True, null=True, related_name="mussel3"
    )
    mussel4 = models.ForeignKey(
        Mussel, on_delete=CASCADE, blank=True, null=True, related_name="mussel4"
    )
    mussel5 = models.ForeignKey(
        Mussel, on_delete=CASCADE, blank=True, null=True, related_name="mussel5"
    )
    mussel6 = models.ForeignKey(
        Mussel, on_delete=CASCADE, blank=True, null=True, related_name="mussel6"
    )
    mussel7 = models.ForeignKey(
        Mussel, on_delete=CASCADE, blank=True, null=True, related_name="mussel7"
    )
    mussel8 = models.ForeignKey(
        Mussel, on_delete=CASCADE, blank=True, null=True, related_name="mussel8"
    )
    on_time = models.CharField(max_length=30, null=True, blank=True)

    def get_mussel(self, number):
        """
        Get the mussel object of a certain number

        Inputs:
            - number: The number (1 to 8) of the mussel to be retrieved.

        Returns:
            - A mussel object
        """
        mussel = getattr(self, "mussel" + str(number))
        return mussel

    ###################################################################
    def get_mussels_name(self):
        data = {i: self.get_mussel(i).name for i in range(1, 9)}
        return data

    ########################################################################
    def get_mussels_voltage(self):
        """
        Gets the data for all mussels for the group
        """
        # TODO: Check if change% should be here?
        data = {i: self.get_mussel(i).get_current_voltage() for i in range(1, 9)}
        return data

    def get_group_all_data(
        self,
    ):  #######################################EN SON BUNU YAPIYODUN TEK MUSSEL GRAPH ICIN
        allData = {i: self.get_mussel(i).data_fields.all() for i in range(1, 9)}
        print(allData)
        return allData

    def get_particular_mussel_data(
        self, id, interval
    ):  #######################################EN SON BUNU YAPIYODUN TEK MUSSEL GRAPH ICIN
        data = {id: self.get_mussel(id).data_fields.filter()}
        print(data)
        return data

    def get_mussels_timestamp(self):
        data = {i: self.get_mussel(i).get_current_timestamp() for i in range(1, 9)}
        return data

    def get_group_timestamp(self):  ########################### returns updated_at
        return self.updated_at.timestamp()

    def get_mussels_overview(self):
        data = {i: self.get_mussel(i).get_state() for i in range(1, 9)}
        return data

    def __str__(self):
        return self.name
