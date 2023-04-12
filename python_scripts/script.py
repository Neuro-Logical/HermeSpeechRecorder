import csv
import pandas as pd
from collections import defaultdict
import json

train_data_csv_url = "https://raw.githubusercontent.com/forrestpark/AtypicalSpeech/master/data/train_data.csv"
test_data_csv_url = "https://raw.githubusercontent.com/forrestpark/AtypicalSpeech/master/data/test_data.csv"
valid_data_csv_url = "https://raw.githubusercontent.com/forrestpark/AtypicalSpeech/master/data/valid_data.csv"

train_data = pd.read_csv(train_data_csv_url)
test_data = pd.read_csv(test_data_csv_url)
valid_data = pd.read_csv(valid_data_csv_url)

scriptID2utterances = defaultdict(list)
utterance2details = defaultdict(dict)

for data in [train_data, test_data, valid_data]:
  for index, row in data.iterrows():
    scriptID = row['speakerId']
    # print("script id: ", scriptID)

    utterance = row['transcription']
    # print("utterance: ", utterance)

    details = {"action": row['action'], "object": row['object'], "location": row['location']}
    # print("details: ", details)

    scriptID2utterances[scriptID].append(utterance)

    utterance2details[utterance] = details
