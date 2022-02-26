# Script that scrapes all comments from the r/buenzli subreddit using the Pushshift API and spits them out as a CSV.

import pandas as pd
from pmaw import PushshiftAPI
api = PushshiftAPI()

comments = api.search_comments(subreddit="buenzli")

comments_df = pd.DataFrame(comments)

comments_df.to_csv('./buenzli_comments.csv', header=True, index=False, columns=list(comments_df.axes[1]))
