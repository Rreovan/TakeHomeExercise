import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CheckoutPage } from './pages/CheckoutPage';

test.describe('Checkout', () => {
  let inventoryPage: InventoryPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    inventoryPage = new InventoryPage(page);
    checkoutPage = new CheckoutPage(page);
    await inventoryPage.addToCartByName('Sauce Labs Backpack').click();
    await inventoryPage.addToCartByName('Sauce Labs Bike Light').click();
    await inventoryPage.cartLink.click();
    await page.locator('#checkout').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('UI-030 Complete checkout with valid info', async ({ page }) => {
    await checkoutPage.fillInfo('Jane', 'Doe', '12345');
    await checkoutPage.continueButton.click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  test('UI-031 Checkout blank First Name', async () => {
    await checkoutPage.fillInfo('', 'Doe', '12345');
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toContainText('Error: First Name is required');
  });

  test('UI-032 Checkout blank Last Name', async () => {
    await checkoutPage.fillInfo('Jane', '', '12345');
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toContainText('Error: Last Name is required');
  });

  test('UI-033 Checkout blank Postal Code', async () => {
    await checkoutPage.fillInfo('Jane', 'Doe', '');
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toContainText('Error: Postal Code is required');
  });

  test('UI-034 Cancel on step one returns to cart', async ({ page }) => {
    await checkoutPage.cancelButton.click();
    await expect(page).toHaveURL(/cart\.html/);
  });

  test('UI-035 Overview shows correct pricing', async () => {
    await checkoutPage.fillInfo('Jane', 'Doe', '12345');
    await checkoutPage.continueButton.click();

    const subtotalText = await checkoutPage.subtotalLabel.textContent();
    const taxText = await checkoutPage.taxLabel.textContent();
    const totalText = await checkoutPage.totalLabel.textContent();

    const subtotal = parseFloat(subtotalText!.replace('Item total: $', ''));
    const tax = parseFloat(taxText!.replace('Tax: $', ''));
    const total = parseFloat(totalText!.replace('Total: $', ''));

    expect(Math.round((subtotal + tax) * 100) / 100).toBeCloseTo(total, 2);
  });

  test('UI-036 Cancel on overview returns to inventory', async ({ page }) => {
    await checkoutPage.fillInfo('Jane', 'Doe', '12345');
    await checkoutPage.continueButton.click();
    await checkoutPage.cancelOverviewButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('UI-037 Finish completes order', async ({ page }) => {
    await checkoutPage.fillInfo('Jane', 'Doe', '12345');
    await checkoutPage.continueButton.click();
    await checkoutPage.finishButton.click();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toContainText('Thank you for your order!');
  });

  test('UI-038 Back Home clears cart', async ({ page }) => {
    await checkoutPage.fillInfo('Jane', 'Doe', '12345');
    await checkoutPage.continueButton.click();
    await checkoutPage.finishButton.click();
    await checkoutPage.backHomeButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('UI-039 First Name upper-bound length', async ({ page }) => {
    const longName = 'N'.repeat(300);
    await checkoutPage.fillInfo(longName, 'Doe', '12345');
    await checkoutPage.continueButton.click();
    // No crash/hang: app has no max-length constraint, so it proceeds to step two.
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('UI-040 Postal Code accepts non-numeric input', async ({ page }) => {
    await checkoutPage.fillInfo('Jane', 'Doe', 'ABC-!@#');
    await checkoutPage.continueButton.click();
    // App has no format validation on postal code - proceeds to step two.
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });
});
