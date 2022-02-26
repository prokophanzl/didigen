#!/bin/bash
# Script that parses a CSV with Reddit comments into usable data. Not foolproof or very effective, but still very useful.

INDATA=$1

cat $INDATA | \
/opt/homebrew/bin/perl -CS -pe 's/\p{Emoji}/ /g' | \
sed 's/""//g' | \
sed 's/~//g' | \
sed 's/>:(//g' | \
sed 's/>:)//g' | \
sed 's/:(//g' | \
sed 's/:'(//g' | \
sed 's/:)//g' | \
sed 's/;)//g' | \
sed 's/^ .*"/"/g' | \
sed 's/&gt;/>/g' | \
sed 's/&lt;/</g' | \
sed 's/&amp;#x200B;//g' | \
sed 's/\&amp;/\&/g' | \
sed 's/](.*)/]/g' | \
sed 's/,CH/,/g' | \
sed 's/\\/ /g' | \
sed 's/>.*[^"]//g' | \
sed 's/^[ \t]*//' | \
tr -s '\n' | \
tr -s ' ' \
> parsed.csv


cat parsed.csv | wc -l
