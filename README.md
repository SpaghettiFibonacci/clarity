# Clarity

Welcome to Clarity, the recipe for a perplexity.ai clone!

If you're looking for a way to improve your understanding and gain clarity on any topic, this repo has got you covered.

## Usage

`index.js` has the basic skeleton you need to intergrate this recipe in your own project.

## What is Perplexity?

With perplexity.ai, users can input search queries and receive summaries of top search results including sources. However, with this recipe, you are shown how to achieve similar results in just five simple steps!

## Perplexity.ai

This repo shows how you can get similar results to perplexity.ai using the following steps:

1. Create search query from the input of the user
   - The user creates a query then submits it to ChatGPT for ChatGPT to make a query out of it.
2. Extract urls from the search query
   - The query is submitted to a search engine, in this case DuckDuckGo, which returns urls.
3. Extract the content from x amount of urls
   - Take some urls and read the innerText content of it cutoff at around 2-3k tokens so there is room for a ChatGPT response which maxes out at about 4k tokens.
4. Make a summary of the content
   - The response of the previous step is the summary of the query. And because it loops x amount of urls you get multiple summaries, knowing the sources.
5. _OPTIONAL_ Make a summary of all the summaries for the response
   - It can be helpful to have a summary of the summaries, but it is not recommended to get sources from this, as they might be scrambled or contaminated.
