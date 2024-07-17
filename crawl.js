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
  const anchors = document.querySelectorAll("a");
  const urls = [];
  for (const anchor of anchors) {
    if (anchor.hasAttribute("href")) {
      try {
        let url = new URL(node.getAttribute("href"), baseURL);
        urls.push(url.href);
      } catch (err) {
        console.log(`${err.message}: ${href}`);
      }
    }
  }
  return urls;
};

export { normalizeURL, getURLsFromHTML };
