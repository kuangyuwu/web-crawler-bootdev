import { JSDOM } from "jsdom";

const normalizeURL = (urlStr) => {
  const url = new URL(urlStr);
  //   console.log(url, url.pathname, url.hostname);
  let result = url.hostname + url.pathname;
  if (result.slice(-1) === "/") {
    result = result.slice(0, -1);
  }
  return result;
};

const getURLsFromHTML = (htmlBody, baseURL) => {
  const { document } = new JSDOM(htmlBody, { url: baseURL }).window;
  const nodes = document.querySelectorAll("a");
  const urls = [];
  for (let node of nodes) {
    let url = new URL(node.getAttribute("href"), baseURL);
    urls.push(url.toString());
  }
  return urls;
};

export { normalizeURL, getURLsFromHTML };
