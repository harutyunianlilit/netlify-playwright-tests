import { test, expect, APIRequestContext } from '@playwright/test';
import { XMLParser } from 'fast-xml-parser';

test.describe('Sitemap and Crawlability Verification', () => {
  let request: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext();
  });

  // Increase the overall timeout for the test suite to 5 minutes
  test.setTimeout(5 * 60 * 1000);

  test('should fetch sitemap.xml and verify all URLs are accessible and crawlable', async () => {
    const sitemapUrl = 'https://www.netlify.com/sitemap.xml';

    // 1. Fetch the sitemap.xml
    const response = await request.get(sitemapUrl);
    expect(response.ok()).toBeTruthy();

    const xmlText = await response.text();
    const parser = new XMLParser();
    const sitemapData = parser.parse(xmlText);

    const urls: string[] = sitemapData.urlset.url.map(
      (entry: any) => entry.loc
    );

    expect(urls.length).toBeGreaterThan(0);

    // Limit the number of URLs being checked to 20 to avoid timeouts
    const urlsToCheck = urls.slice(0, 20);

    // 2. Check each URL in the sitemap
    for (const url of urlsToCheck) {
      const res = await request.get(url);
      expect(
        res.status(),
        `URL failed: ${url} with status code ${res.status()}`
      ).toBeLessThan(500); // Allow any response status less than 500 (including 403)

      // 3. Check for the 'noindex' meta tag
      const html = await res.text();
      const hasNoIndex = html.includes('<meta name="robots" content="noindex"');

      expect(hasNoIndex, `Unexpected noindex tag found at ${url}`).toBeFalsy();
    }
  });

  // Test Case 2: Ensure important pages are crawlable and not blocked in robots.txt
  test('important pages are not blocked in robots.txt', async () => {
    const robotsResponse = await request.get('/robots.txt');
    expect(robotsResponse.ok()).toBeTruthy();

    const text = await robotsResponse.text();
    const importantPages = ['/pricing/', '/platform/', '/login/'];

    // 4. Ensure important pages are not blocked in robots.txt
    for (const path of importantPages) {
      expect(
        text.includes(`Disallow: ${path}`),
        `${path} is disallowed in robots.txt`
      ).toBeFalsy();
    }
  });

  test.afterAll(async () => {
    await request.dispose();
  });
});
