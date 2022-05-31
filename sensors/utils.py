import tabulate
from functools import partial
from django.http import HttpResponse
import csv
import json
import pytz
from datetime import datetime

### TODO: NUKE THIS FILE AND CLEAN IT UP
def splitData(data):
    """
    Splits the values and headers of dictionary into rows and columns

    Inputs:
        - data: A list of dictionaries

    Returns:
        - rows: List of data without the headers
        - columns: List of headers
    """
    rows = [list(item.values()) for item in data]
    columns = list(data[0].keys())
    return rows, columns


def generate_csv(data, format):
    """
    Generate a CSV file using a list of dictionaries.

    Inputs:
        - data: A list of dictionaries

    Returns:
        - A CSV output file
    """
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="dataExport.csv"'
    writer = csv.writer(response)
    rows = data
    columns = ["timestamp", "Hallvoltage"]
    if format != 3:
        columns[0] = "Date/Time"
        rows = [changeRow(row, format) for row in rows]
    writer.writerow(columns)
    for row in rows:
        writer.writerow(row)
    return response


def changeRow(row, format):
    if format == 0:
        timezone = "Etc/GMT0"
    else:
        timezone = "Europe/Berlin"
    datetimeObject = datetime.utcfromtimestamp(row[0])
    timezoneCorrect = datetimeObject.astimezone(pytz.timezone(timezone))
    row[0] = timezoneCorrect.strftime("%m/%d/%Y, %H:%M:%S")
    return row


def htmlRow(celltag, cell_values, colwidths, colaligns):
    """
    Generate the formatting required for the HTML table
    for tabulate.
    """
    alignment = {
        "left": ' style="text-align: center;"',
        "right": ' style="text-align: center;"',
        "center": ' style="text-align: center;"',
        "decimal": '  style="text-align: center;"',
    }
    values_with_attrs = [
        '<{0}{1} class="my-cell">{2}</{0}>'.format(celltag, alignment.get(a, ""), c)
        for c, a in zip(cell_values, colaligns)
    ]
    return '<tr class="my-row">' + "".join(values_with_attrs).rstrip() + "</tr>"


def generateTable(data):
    """
    Generate a table using a list of dictionaries, where the keys are
    the headers.

    Inputs:
        - data: A list of dictionaries

    Returns:
        - An HTML-formatted table.
    """
    MyHTMLFormat = tabulate.TableFormat(
        lineabove=tabulate.Line('<table class="table">', "", "", ""),
        linebelowheader=None,
        linebetweenrows=None,
        linebelow=tabulate.Line("</table>", "", "", ""),
        headerrow=partial(htmlRow, "th"),
        datarow=partial(htmlRow, "td"),
        padding=0,
        with_header_hide=None,
    )

    rows, columns = splitData(data)

    return HttpResponse(tabulate.tabulate(rows, headers=columns, tablefmt=MyHTMLFormat))
