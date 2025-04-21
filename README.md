# Playwright Test Suite for Netlify

This repository contains automated tests for the Netlify website (https://www.netlify.com/) using Playwright. The tests cover three primary use cases:

1. **Lead Capture Form Validation**
2. **Sitemap and Crawlability Verification**
3. **404 Link Verification**

## Test Cases

### 1. Lead Capture Form Validation

- Navigate to the homepage of Netlify.
- Verify that the newsletter form is present and properly functioning.
- Test form submission with valid data.
- Test form validation with invalid data.
- Verify that proper feedback is displayed to users after submission.

### 2. Sitemap and Crawlability Verification

- **Test Case Overview**:
  - **Verify that `sitemap.xml` exists**: Ensure the sitemap is accessible.
  - **Check that URLs listed in the sitemap are accessible**: Fetch each URL listed in `sitemap.xml` and check for accessibility.
  - **Ensure that pages don't have `robots noindex` meta tags unless specifically intended**: Pages are checked to ensure they don't contain the `noindex` meta tag.
  - **Verify that important pages are crawlable**: Ensure pages like `/pricing/`, `/platform/`, and `/login/` are crawlable and not blocked by `robots.txt`.

### 3. 404 Link Verification

- **Test Case Overview**:
  - **Check that all pages on the site have links that do not lead to 404 errors**: This test checks all links on the site to ensure they are valid and not leading to a 404 error.

## Setup Instructions

1. Clone the repository to your local machine:

   ```bash
   git clone <repository_url>
   cd <project_directory>
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. (Optional) If you do not have Playwright installed globally, you can run this command to install Playwright browsers:

   ```bash
   npx playwright install
   ```

4. To run the tests, use the following command:

   ```bash
   npx playwright test
   ```

   You can specify a specific test file or test case by using:

   ```bash
   npx playwright test <test_file_name>
   ```

## Dependencies

The following dependencies are required to run the tests:

1. **Playwright**: For browser automation and testing.
2. **fast-xml-parser**: For parsing XML files like `sitemap.xml`.

To install them, run:

```bash
npm install playwright fast-xml-parser
```

## Approach

The automated tests for the Netlify website were created using Playwright, a browser automation library. The following approach was used:

- **Lead Capture Form Validation**:

  - Test the presence and functionality of the newsletter form by testing both valid and invalid submissions.
  - Verify that proper feedback is displayed to users after each submission.

- **Sitemap and Crawlability Verification**:

  - Ensure `sitemap.xml` exists and is accessible.
  - Fetch each URL listed in `sitemap.xml` and check for accessibility.
  - Check each URL to ensure no `robots noindex` meta tag is present unless it is intentionally set.
  - Verify that important pages (e.g., `/pricing/`, `/platform/`, `/login/`) are crawlable and not blocked by `robots.txt`.

- **404 Link Verification**:
  - Check all links on the site to ensure they do not lead to 404 errors.

## Assumptions or Limitations

- The tests assume that `sitemap.xml` exists and is publicly accessible on the Netlify website.
- The website content may change, which could impact test results. We recommend rerunning the tests if the site layout changes significantly.
- Playwright’s capabilities were used to perform all actions and verifications. Some tests (like 404 checks) may take longer to execute.
- The test suite does not cover all possible edge cases but focuses on the most critical functionalities.
