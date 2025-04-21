import { expect } from '@playwright/test';

// Helper function to generate and fill the email input
export const randomEmail =
  Math.random().toString(36).substring(2, 15) + '@new.com';

export async function fillEmailAndSubmit(
  page: any,
  email: string,
  isValid: boolean
) {
  const emailInput = page.locator('input[type="email"]');
  const submitButton = page.locator('.button-secondary');

  await emailInput.fill(email);

  await submitButton.click();

  if (isValid) {
    await page.waitForURL(/thanks-for-signing-up/, { timeout: 10000 });
    await expect(page.locator('text=Thank you for signing up!')).toBeVisible();
  } else {
    await expect(emailInput).toHaveClass(/invalid|error/);
    await expect(page).not.toHaveURL(/thanks-for-signing-up/);
    await expect(page).toHaveURL('/');
  }
}

export async function verifySuccessMessage(page: any) {
  const successMessage = page.locator('text=Thank you for signing up!');
  const successContent = page.locator(
    'text=We are looking forward to keep you posted with updates and interesting articles.'
  );
  await expect(successMessage).toBeVisible();
  await expect(successContent).toBeVisible();
}

export async function verifyErrorMessage(page: any) {
  const emailInput = page.locator('input[type="email"]');
  await page.waitForSelector(
    'input[type="email"].invalid, input[type="email"].error',
    { timeout: 10000 }
  );

  await expect(emailInput).toHaveClass(/invalid|error/);
  await expect(page).not.toHaveURL(/thanks-for-signing-up/);
}
