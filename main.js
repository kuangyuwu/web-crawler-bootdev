import { argv } from "node:process";

import { crawlPage, printReport } from "./crawl.js";

async function main() {
  if (argv.length < 3) {
    console.log(`no url provided`);
    console.log(`run the program by "npm run start BASE_URL"`);
    return;
  }
  if (argv.length < 3) {
    console.log(`too many arguments`);
    console.log(`run the program by "npm run start BASE_URL"`);
    return;
  }
  const url = argv[2];
  console.log(`Start crawling ${url} ...`);
  const pages = await crawlPage(url);
  printReport(pages);
}

main();
