import { test, expect } from '@playwright/test';
import fs from 'fs';
import { parseStringPromise } from 'xml2js';

test.describe('404 Link Verification', () => {
  // Extend timeout for the whole suite (2 minutes)
  test.setTimeout(2 * 60 * 1000);

  const pagesToCheck = [
    'https://www.netlify.com/',
    'https://www.netlify.com/pricing/',
  ];
  for (const url of pagesToCheck) {
    test(`should not have broken links on ${url}`, async ({
      page,
      request,
    }) => {
      await page.goto(url, { waitUntil: 'load' });

      const links = await page.$$eval('a[href]', (anchors) =>
        anchors
          .map((a) => a.getAttribute('href'))
          .filter(
            (href): href is string =>
              !!href &&
              !href.startsWith('#') &&
              !href.startsWith('mailto:') &&
              !href.startsWith('javascript:')
          )
      );

      const base = new URL(url);
      const linksToCheck = links.slice(0, 30);

      for (const href of linksToCheck) {
        let fullUrl: string;
        try {
          fullUrl = new URL(href, base).href;
        } catch {
          console.warn(`Skipping malformed URL: ${href}`);
          continue;
        }

        await test.step(`Checking: ${fullUrl}`, async () => {
          try {
            const response = await request.get(fullUrl);
            const status = response.status();
            if (status === 404) {
              fs.appendFileSync('broken-links.txt', `${fullUrl}\n`);
              console.error(`Broken link: ${fullUrl}`);
            }
            expect(status, `Broken link: ${fullUrl}`).not.toBe(404);
          } catch (error) {
            console.error(`⚠️ Error checking ${fullUrl}:`, error);
            throw error;
          }
        });
      }
    });
  }
});
