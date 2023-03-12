import { chat } from "./openai/chatgpt.js";
import { getContentFromHeadlessBrowser, getUrlsFromDuckDuckGo } from "./puppeteer/browser.js";

let history = []; // very important

async function ask(input) {
    // step 1 Create search query from the input of the user
    let searchTerm = await chat([{ content: `You are a search query maker. Give back a search query for this: ${input} }`, role: 'user' }, { content: `Only give back a short search query for all my questions`, role: 'user' }].concat(history));
    searchTerm = searchTerm.replaceAll('"', '');

    // step 2 Extract urls from the search query
    let urls = await getUrlsFromDuckDuckGo(`https://html.duckduckgo.com/html/?q=${searchTerm}`);

    urls.forEach(url => {
        url.trim();
    });

    // step 3 Extract the content from x amount of urls
    let answers = [];

    for (let i = 0; i < 3; i++) {
        const url = urls[i];
        let webContent = await getContentFromHeadlessBrowser(`https://${url}`);
        // step 4 Make a summary of the content
        answers.push(await chat([{ content: `Answer this question: ${input}\r\nWith a very detailed summary:\r\n${webContent.substring(0, 2048)}`, role: 'user' }].concat(history)) + ` source: *[${urls[i]}]*`);
    }

    // optional: step 5 Make a summary of all the summaries for the response
    // let response = await chat([{ content: `Answer this question: ${input}\r\nUse the following information for the original question: ${answers}`, role: 'user' }].concat(history));

    return answers.join(' ');
}

let input = 'What is the latest news on coronavirus?';
let response = await ask(input);
console.log(`Your answer on input:\r\n${response}`);
history.push({ content: input, role: 'user' });
history.push({ content: response, role: 'assistant' });

let input2 = 'How many deaths?'; // it knows context from history
let response2 = await ask(input2);
console.log(`Your answer on input2:\r\n${response2}`);
history.push({ content: input2, role: 'user' });
history.push({ content: response2, role: 'assistant' });