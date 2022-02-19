#!/bin/bash
# Script that helps transform a bunch of text into single words.

# Removes censored names (XXXXX), makes the first letter of each line lowercase
# (so that words at the start of sentences aren't capitalized but nouns later
# don't lose their capitalization), replaces all unwanted characters with
# spaces (including line breaks), squeezes clusters of spaces into one space
# and replaces spaces back with line breaks.

INDATA=$1

cat $INDATA | sed 's/XXXXX//g' | while read line ; do echo "${line,}" ; done | tr '.,!?()*1234567890@+/„“":-\n' ' ' | tr -s ' ' | tr ' ' '\n'
