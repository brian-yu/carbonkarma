# import re

# reader = open("lci.txt", "r")
# writer = open("lci.csv", "w")
# for x in reader:
#     x = re.sub(r'\([0-9]+, ', "", x)
#     x = re.sub(r'\),\n', "\n", x)
#     writer.write(x)

# reader.close()
# writer.close()

###############################################

import re
import csv
import json

category_dict = {}
reader = open("lci.csv", "r")
csv_reader = csv.reader(reader, quotechar='\'', delimiter=',', quoting=csv.QUOTE_ALL, skipinitialspace=True)
count = 0
for row in csv_reader:
    cleaned_text = re.sub(r',', "", row[0]).lower()
    category = {'text': cleaned_text, 'co2_kg': float(row[1])}
    category_dict[count] = category
    count += 1
reader.close()

writer = open("lci.json", "w")
writer.write(json.dumps(category_dict))
writer.close()
