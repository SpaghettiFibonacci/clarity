import { chat } from "./openai/chatgpt.js";
import { getContentFromHeadlessBrowser, getUrlsFromDuckDuckGo } from "./puppeteer/browser.js";

let history = []; // very important

async function ask(input) {
    // step 1 Create search query from the input of the user
    let searchTerm = await chat([{content: `The history of the conversation for context: {${history.map(e => e.content + ';')} \r\n You are a search query maker. Give back a search query for this: ${input} }`, role: 'user'}, {content: `Only give back a short search query for all my questions`, role: 'user'}]);
    searchTerm = searchTerm.replaceAll('"', '');

    // step 2 Extract urls from the search query
    let urls = await getUrlsFromDuckDuckGo(`https://html.duckduckgo.com/html/?q=${searchTerm}`);

    urls.forEach(url => {
        url.trim();
    });

    // step 3 Extract the content from x amount of urls
    let content = '';

    for (let i = 0; i < 3; i++) {
        const url = urls[i];
        let webContent = await getContentFromHeadlessBrowser(`https://${url}`);
        // step 4 Make a summary of the content
        content += await chat([{content: `The question is: ${input}\r\nMake a very detailed summary and include important items that cannot be summarized LEAVE OUT ANY UNRELATED THINGS IF NOTHING JUST EMPTY SPACE:\r\n${webContent.substring(0, 2048)}`, role: 'user'}]) + ";\r\n";
    }

    // step 5 Make a summary of all the summaries
    let summarize = await chat([{content: `The history of the conversation for context: {${history.map(e => e.content + ';')} \r\nThe The original question: ${input}\r\Use the following information for the original question: ${content}`, role: 'user'}, {content: `Only give back the summary for all my questions`, role: 'user'}]);

    // step 6 Use the summary of summaries to answer the question possibly a bit redundant
    let response = await chat([{content:`Tell me something about this: ${input}\r\n Use this summary to tell me something about it: ${summarize}`, role: 'user'}].concat(history));
    return response;
}

let input = 'Latest news on coronavirus';
let response = await ask(input);
console.log(`Your answer on input:\r\n${response}`);
history.push({content: input, role: 'user'});
history.push({content: response, role: 'assistant'});

let input2 = 'How many deaths?'; // it knows context from history
let response2 = await ask(input2);
console.log(`Your answer on input2:\r\n${response2}`);
history.push({content: input2, role: 'user'});
history.push({content: response2, role: 'assistant'});