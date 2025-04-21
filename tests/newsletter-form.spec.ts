import { test, expect } from '@playwright/test';
import {
  fillEmailAndSubmit,
  randomEmail,
  verifyErrorMessage,
  verifySuccessMessage,
} from './helpers/customCommands';

test.describe('Netlify Homepage - User Scenarios', () => {
  let page: any;
  let context: any;
  let emailInput: any;
  let submitButton: any;
  let newsletterForm: any;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
  });

  test.beforeEach(async () => {
    page = await context.newPage();
    emailInput = page.locator('input[type="email"]');
    submitButton = page.locator('.button-secondary');
    newsletterForm = await page.locator(
      '[data-form-id="52611e5e-cc55-4960-bf4a-a2adb36291f6"]'
    );

    await page.goto('/');
  });

  test.describe('Confirmed Scenarios for Newly Registered User', () => {
    test('should have correct title', async () => {
      await expect(page).toHaveTitle(/Netlify/);
    });

    test('should locate the newsletter form', async () => {
      await newsletterForm.waitFor({ state: 'visible' });
      await expect(newsletterForm).toBeVisible();
    });

    test('should submit the newsletter form successfully', async () => {
      await fillEmailAndSubmit(page, randomEmail, true);
      await expect(emailInput).not.toHaveClass(/invalid|error/);

      await page.waitForURL(/thanks-for-signing-up/, { timeout: 10000 });

      // Verify the success message
      await page
        .locator('text=Thank you for signing up!')
        .waitFor({ state: 'visible', timeout: 10000 });

      await verifySuccessMessage(page);
    });

    test('form submission should be fast', async () => {
      const startTime = Date.now();
      await fillEmailAndSubmit(page, randomEmail, true);
      const endTime = Date.now();
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(8000);
    });

    test('should submit form successfully with valid email using keyboard navigation', async () => {
      const validEmail = 'test@new.com';

      await emailInput.focus();
      await emailInput.fill(validEmail);
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');

      await page.waitForURL(/thanks-for-signing-up/, { timeout: 10000 });
      await verifySuccessMessage(page);
    });

    test('should reset email input after page refresh and remain on the form section', async () => {
      await page.evaluate(() => {
        localStorage.clear();
      });

      await emailInput.fill(randomEmail);
      await page.reload();

      await expect(emailInput).toHaveValue('');
      await expect(newsletterForm).toBeVisible();

      await newsletterForm.scrollIntoViewIfNeeded();
      await expect(newsletterForm).toBeInViewport();
    });
  });

  test.describe('Dangerous Scenarios for Newly Registered User', () => {
    test('should mark email as invalid for various incorrect email formats', async () => {
      const invalidEmails = [
        '',
        'invalidemail.com',
        'test@#$%.com',
        'test @example.com',
        '!#$%^&*()',
        'a'.repeat(65) + '@new.com',
      ];

      for (const invalidEmail of invalidEmails) {
        await fillEmailAndSubmit(page, invalidEmail, false);
      }
    });

    test('should not submit form with malicious input', async () => {
      const maliciousInputs = [
        '<script>alert("XSS Attack")</script>',
        '<img src="x" onerror="alert(\'XSS\')">',
        '<div onmouseover="alert(\'XSS\')">Hover me</div>',
      ];

      for (const maliciousInput of maliciousInputs) {
        await emailInput.fill(maliciousInput);
        await submitButton.click();
        await verifyErrorMessage(page);
      }
    });

    test('should not submit form with invalid email using keyboard navigation', async () => {
      await emailInput.focus();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await verifyErrorMessage(page);
    });
  });

  test.afterAll(async () => {
    if (context) {
      await context.close();
    }
  });
});
