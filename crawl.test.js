import { test, expect } from "@jest/globals";
import { normalizeURL, getURLsFromHTML } from "./crawl";

test("normalizeURL standard", () => {
  expect(normalizeURL("http://blog.boot.dev/path")).toEqual(
    "blog.boot.dev/path"
  );
});

test("normalizeURL slash", () => {
  expect(normalizeURL("http://blog.boot.dev/path/")).toEqual(
    "blog.boot.dev/path"
  );
});

test("normalizeURL https", () => {
  expect(normalizeURL("https://blog.boot.dev/path")).toEqual(
    "blog.boot.dev/path"
  );
});

test("normalizeURL capitalize", () => {
  expect(normalizeURL("http://BLOG.boot.dev/path")).toEqual(
    "blog.boot.dev/path"
  );
});

test("getURLsFromHTML absolute path", () => {
  expect(
    getURLsFromHTML(
      `
      <html>
        <body>
          <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
        </body>
      </html>`,
      "https://blog.boot.dev"
    )
  ).toEqual(["https://blog.boot.dev/"]);
});

test("getURLsFromHTML relative path", () => {
  expect(
    getURLsFromHTML(
      `
      <html>
        <body>
          <a href="/path/"></a>
        </body>
      </html>`,
      "https://blog.boot.dev"
    )
  ).toEqual(["https://blog.boot.dev/path/"]);
});

test("getURLsFromHTML multiple paths", () => {
  expect(
    getURLsFromHTML(
      `
      <html>
        <body>
          <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
          <a href="/path/"></a>
        </body>
      </html>`,
      "https://blog.boot.dev"
    )
  ).toEqual(["https://blog.boot.dev/", "https://blog.boot.dev/path/"]);
});
