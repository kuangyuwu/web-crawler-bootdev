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

const crawlPage = async (currURL) => {
  //
  const settings = {
    method: "GET",
  };
  let resp;
  try {
    resp = await fetch(currURL, settings);
  } catch (err) {
    console.log(`error fetching webpage ${currURL}: ${err.message}`);
    return;
  }
  if (resp.status >= 400) {
    console.log(`error response: status code ${resp.status}`);
    return;
  }
  const contentType = resp.headers.get("content-type");
  if (!contentType || !contentType.includes("text/html")) {
    console.log(`unexpected content type: ${contentType}`);
    return;
  }
  try {
    console.log(await resp.text());
  } catch (error) {
    console.log(`error getting text`);
    return;
  }
  return;
};

export { normalizeURL, getURLsFromHTML, crawlPage };
