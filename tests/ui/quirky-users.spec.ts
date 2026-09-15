import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CheckoutPage } from './pages/CheckoutPage';

/**
 * Stretch coverage: SauceDemo's intentionally "quirky" users (problem_user, visual_user,
 * error_user). Assertions below reflect ACTUAL observed app behavior (confirmed via a
 * one-off exploration pass against the live site before writing these tests), not assumed
 * documentation, since these quirks are undocumented and can change between app versions.
 */

async function loginAs(page: import('@playwright/test').Page, username: string) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(username, 'secret_sauce');
  await expect(page).toHaveURL(/inventory\.html/);
}

test.describe('problem_user quirks', () => {
  test('UI-060 problem_user has broken/mismatched product images', async ({ page }) => {
    await loginAs(page, 'problem_user');
    const inventoryPage = new InventoryPage(page);
    const srcs = await inventoryPage.itemImages.evaluateAll((imgs) =>
      imgs.map((i) => i.getAttribute('src'))
    );
    // Known bug: every product image resolves to the same broken placeholder asset.
    expect(new Set(srcs).size).toBe(1);
    expect(srcs[0]).toContain('sl-404');
  });

  test('UI-061 problem_user sort dropdown does not reorder products', async ({ page }) => {
    await loginAs(page, 'problem_user');
    const inventoryPage = new InventoryPage(page);
    const before = await inventoryPage.itemNames.allTextContents();
    await inventoryPage.sortBy('za');
    const after = await inventoryPage.itemNames.allTextContents();
    // Known bug: selecting "Name (Z to A)" has no effect on problem_user.
    expect(after).toEqual(before);
  });

  test('UI-062 problem_user cannot complete checkout (Last Name not retained)', async ({ page }) => {
    await loginAs(page, 'problem_user');
    const inventoryPage = new InventoryPage(page);
    const checkoutPage = new CheckoutPage(page);
    await inventoryPage.addToCartByName('Sauce Labs Backpack').click();
    await inventoryPage.cartLink.click();
    await page.locator('#checkout').click();
    await checkoutPage.fillInfo('Jane', 'Doe', '12345');
    // Known bug: input typed into Last Name is not committed to the field.
    await expect(checkoutPage.lastNameInput).toHaveValue('');
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toContainText('Error: Last Name is required');
  });
});

test.describe('visual_user quirks', () => {
  test('UI-070 visual_user has one broken product image (others render correctly)', async ({ page }) => {
    await loginAs(page, 'visual_user');
    const inventoryPage = new InventoryPage(page);
    const srcs = await inventoryPage.itemImages.evaluateAll((imgs) =>
      imgs.map((i) => i.getAttribute('src'))
    );
    const brokenCount = srcs.filter((s) => s?.includes('sl-404')).length;
    // Known bug: exactly one product (Sauce Labs Backpack) shows the broken placeholder image.
    expect(brokenCount).toBe(1);
    expect(srcs.filter((s) => !s?.includes('sl-404'))).toHaveLength(5);
  });

  test('UI-071 visual_user sort dropdown functions correctly', async ({ page }) => {
    await loginAs(page, 'visual_user');
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.itemNames.allTextContents();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    // Unlike problem_user/error_user, sorting is NOT broken for visual_user.
    expect(names).toEqual(sorted);
  });

  test('UI-072 visual_user can complete full checkout successfully', async ({ page }) => {
    await loginAs(page, 'visual_user');
    const inventoryPage = new InventoryPage(page);
    const checkoutPage = new CheckoutPage(page);
    await inventoryPage.addToCartByName('Sauce Labs Backpack').click();
    await inventoryPage.cartLink.click();
    await page.locator('#checkout').click();
    await checkoutPage.fillInfo('Jane', 'Doe', '12345');
    await checkoutPage.continueButton.click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await checkoutPage.finishButton.click();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toContainText('Thank you for your order!');
  });
});

test.describe('error_user quirks', () => {
  test('UI-080 error_user product images render correctly', async ({ page }) => {
    await loginAs(page, 'error_user');
    const inventoryPage = new InventoryPage(page);
    const srcs = await inventoryPage.itemImages.evaluateAll((imgs) =>
      imgs.map((i) => i.getAttribute('src'))
    );
    // Unlike problem_user/visual_user, error_user does not exhibit the broken-image bug.
    expect(srcs.every((s) => !s?.includes('sl-404'))).toBe(true);
  });

  test('UI-081 error_user sort dropdown does not reorder products', async ({ page }) => {
    await loginAs(page, 'error_user');
    const inventoryPage = new InventoryPage(page);
    const before = await inventoryPage.itemNames.allTextContents();
    await inventoryPage.sortBy('za');
    const after = await inventoryPage.itemNames.allTextContents();
    // Known bug: selecting "Name (Z to A)" has no effect on error_user (same as problem_user).
    expect(after).toEqual(before);
  });

  test('UI-082 error_user checkout bypasses Last Name validation despite empty field', async ({ page }) => {
    await loginAs(page, 'error_user');
    const inventoryPage = new InventoryPage(page);
    const checkoutPage = new CheckoutPage(page);
    await inventoryPage.addToCartByName('Sauce Labs Backpack').click();
    await inventoryPage.cartLink.click();
    await page.locator('#checkout').click();
    await checkoutPage.fillInfo('Jane', 'Doe', '12345');
    // Known bug: Last Name is not retained (empty)...
    await expect(checkoutPage.lastNameInput).toHaveValue('');
    await checkoutPage.continueButton.click();
    // ...yet, unlike problem_user, validation does not block the user - it proceeds anyway.
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });
});
