import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';

test.describe('Session', () => {
  test('UI-050 Logout clears session', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    const inventoryPage = new InventoryPage(page);
    await expect(page).toHaveURL(/inventory\.html/);

    await inventoryPage.logout();
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
    await expect(loginPage.loginButton).toBeVisible();

    // Attempting to navigate directly back to inventory should not be authorized.
    await page.goto('/inventory.html');
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
    await expect(loginPage.errorMessage).toContainText('You can only access');
  });
});
