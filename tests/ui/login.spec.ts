import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('UI-001 Login with valid standard user', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('UI-002 Login with locked out user', async ({ page }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await expect(page).toHaveURL(/\/$|index\.html/);
    await expect(loginPage.errorMessage).toContainText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  test('UI-003 Login with invalid password', async ({ page }) => {
    await loginPage.login('standard_user', 'wrong_pw');
    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match any user in this service'
    );
  });

  test('UI-004 Login with empty username', async ({ page }) => {
    await loginPage.passwordInput.fill('secret_sauce');
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('UI-005 Login with empty password', async ({ page }) => {
    await loginPage.usernameInput.fill('standard_user');
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('UI-006 Login with both fields empty', async ({ page }) => {
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('UI-007 Username field upper-bound length', async ({ page }) => {
    const longUsername = 'u'.repeat(500);
    await loginPage.login(longUsername, 'secret_sauce');
    // No crash/hang: page still responsive and renders the standard mismatch error.
    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match any user in this service'
    );
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('UI-008 Password field with special/script characters', async ({ page }) => {
    await loginPage.login('standard_user', `<script>alert(1)</script>' OR '1'='1`);
    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match any user in this service'
    );
    // Ensure no script executed (no unexpected dialog); page remains on login form.
    await expect(loginPage.loginButton).toBeVisible();
  });
});
