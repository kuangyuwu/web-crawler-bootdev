import { JSDOM } from "jsdom";

const normalizeURL = (url) => {
  const urlObj = new URL(url);
  let result = urlObj.hostname + urlObj.pathname;
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
      let href = anchor.getAttribute("href");
      try {
        let url = new URL(href, baseURL).href;
        urls.push(url);
      } catch (err) {
        console.log(`${err.message}: ${href}`);
      }
    }
  }
  return urls;
};

const crawlPage = async (baseURL, currURL = baseURL, pages = {}) => {
  if (Object.keys(pages).length > 99) {
    return pages;
  }

  const baseURLObj = new URL(baseURL);
  const currURLObj = new URL(currURL);

  if (currURLObj.hostname !== baseURLObj.hostname) {
    return pages;
  }

  const normalizedURL = normalizeURL(currURL);
  if (pages[normalizedURL] !== undefined) {
    pages[normalizedURL]++;
    return pages;
  }

  pages[normalizedURL] = 1;
  console.log(`Crawling page ${Object.keys(pages).length} ...`);
  var htmlBody;
  try {
    htmlBody = await fetchHTML(currURL);
  } catch (err) {
    console.log(`Error fetching HTML from ${currURL}: ${err.message}`);
    return pages;
  }
  const urls = getURLsFromHTML(htmlBody, baseURL);
  for (const newURL of urls) {
    pages = await crawlPage(baseURL, newURL, pages);
  }
  return pages;
};

const fetchHTML = async (url) => {
  const settings = {
    method: "GET",
  };
  let resp;
  try {
    resp = await fetch(url, settings);
  } catch (err) {
    throw new Error(`Network error (${url}): ${err.message}`);
  }
  if (resp.status >= 400) {
    throw new Error(`HTTP error: ${resp.status} ${resp.statusText}`);
  }
  const contentType = resp.headers.get("content-type");
  if (!contentType || !contentType.includes("text/html")) {
    throw new Error(`Incorrect content type: ${contentType}`);
  }
  return resp.text();
};

const printReport = (pages) => {
  console.log(`Printing result report ...`);
  const urls = Object.keys(pages);
  urls.sort((a, b) => pages[b] - pages[a]);
  for (const url of urls) {
    console.log(`Found ${pages[url]} internal links to ${url}`);
  }
};

export { normalizeURL, getURLsFromHTML, crawlPage, printReport };
