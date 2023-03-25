import csv
import re
import sys
# import emoji

# Define regular expressions
web_address_regex = re.compile(r'https?://\S+')
username_or_subreddit_regex = re.compile(
    r'^(\/?[ur]\/[A-Za-z0-9_-]+)([\W\s]+(\/?[ur]\/[A-Za-z0-9_-]+))*$')
# emoji_regex = emoji.get_emoji_regexp()
repeating_chars_regex = re.compile(r'([\W_])\1+')

# List of bot authors to exclude
excluded_authors = ['sneakpeekbot',
                    'converter-bot',
                    'Reddit-Book-Bot',
                    'sub_doesnt_exist_bot',
                    'autotldr',
                    'Pi-info-Cool-bot',
                    'NoGoogleAMPBot',
                    'anti-gif-bot',
                    'B0tRank',
                    'same_post_bot',
                    'WhyNotCollegeBoard',
                    'LimbRetrieval-Bot',
                    'Title2Image',
                    'AutoModerator',
                    'I_Love_You-BOT',
                    'nice-scores',
                    'GANDHI-BOT',
                    'SaveVideo',
                    'Anti-The-Worst-Bot',
                    'realquesogrande',
                    'tweettranscriberbot',
                    'TweetPoster',
                    'LinkifyBot',
                    'ShortDeal1763',
                    'The-Worst-Bot',
                    'BooCMB',
                    'BooBCMB',
                    'FatFingerHelperBot',
                    'savevideobot',
                    'Agreeable-Tune3598',
                    'SmallSubBot',
                    'smile-bot-2019',
                    'SmileBot-2020'
                    ]

excluded_body = ['good bot',
                 'bad bot',
                 '[deleted]',
                 'good bot!',
                 'bad bot!',
                 'good bot.',
                 'bad bot.',
                 ]

# Open input and output CSV files
with open(sys.argv[1], 'r', encoding='utf-8') as input_file, open('output.csv', 'w', encoding='utf-8', newline='') as output_file:
    reader = csv.DictReader(input_file)
    writer = csv.DictWriter(output_file, fieldnames=reader.fieldnames)
    writer.writeheader()

    # Create a set to store unique rows based on the combination of the "author" and "body" columns
    unique_rows = set()

    # Loop through rows in input CSV file
    for row in reader:

        # Skip rows where all columns are identical
        if all(value == row[next(iter(row))] for value in row.values()):
            continue

        # Remove lines starting with "&gt;" from "body" column
        body_text = re.sub(r'^&gt;.*$\n?', '', row['body'], flags=re.MULTILINE)

        # Remove web addresses from "body" column
        body_text = web_address_regex.sub('', body_text)

        # Remove emojis from "body" column
        # body_text = emoji_regex.sub('', body_text)

        # Turn repeating non-alphanumeric characters into a single character
        body_text = repeating_chars_regex.sub(r'\1', body_text)

        # Skip rows where "body" column does not include any alphanumeric characters
        if not re.search(r'\w', body_text):
            continue

        # Check if "am a bot" is present in the "body" column
        if 'm a bot' in row['body'].lower():
            continue

        # Skip rows with specific "author" values
        if row['author'] in excluded_authors:
            continue

        # Skip rows where body is "good bot", "bad bot" or "[deleted]"
        if body_text.lower() in excluded_body:
            continue

        # Skip rows where body only contains one reddit username or subreddit name (format u/something or /u/something or /r/something or r/something)
        # if re.search(r'^(?:/u/|u/|/r/|r/)\w+$', body_text):
            # continue

        if username_or_subreddit_regex.match(body_text):
            continue

        # Update "body" column with cleaned text
        row['body'] = body_text

        # Remove duplicates based on the combination of the "author" and "body" columns
        if (row['author'], body_text) in unique_rows:
            continue
        else:
            unique_rows.add((row['author'], body_text))

        # Remove empty lines from "body" column
        row['body'] = re.sub(r'^\s*$', '', row['body'], flags=re.MULTILINE)

        # Write row to output CSV file
        writer.writerow(row)
