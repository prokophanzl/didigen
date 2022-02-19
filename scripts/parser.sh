#!/bin/bash
# Script that helps transform a bunch of text into single words.

INDATA=$1

cat $INDATA | sed 's/XXXXX//g' | while read line ; do echo "${line,}" ; done | tr '.,!?()*1234567890@+/„“":-\n' ' ' | tr -s ' ' | tr ' ' '\n'
