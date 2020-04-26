import re
import csv
import json

mapping_dict = {}
with open("lci.json") as jsonfile:
    lci_dict = json.load(jsonfile)

with open("amazon_categories.csv") as csvfile:
    csv_reader = csv.reader(csvfile, quotechar='\'', delimiter=',', quoting=csv.QUOTE_ALL, skipinitialspace=True)
    for row in csv_reader:
        category = row[0]
        lci_mapping = row[1]
        if lci_mapping in lci_dict:
            mapping_dict[category] = lci_dict[lci_mapping]
        else:
            mapping_dict[category] = {'text': "", 'co2_kg': 0}

with open("mapping.json", "w") as writefile:
    writefile.write(json.dumps(mapping_dict))
