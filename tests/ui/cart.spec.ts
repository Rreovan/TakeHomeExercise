import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';

test.describe('Cart', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
  });

  test('UI-020 Cart lists correct items', async ({ page }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack').click();
    await inventoryPage.addToCartByName('Sauce Labs Bike Light').click();
    await inventoryPage.cartLink.click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.cartItems).toHaveCount(2);
    await expect(cartPage.cartItems.filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
    await expect(cartPage.cartItems.filter({ hasText: 'Sauce Labs Bike Light' })).toBeVisible();
  });

  test('UI-021 Remove item from cart page', async ({ page }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack').click();
    await inventoryPage.addToCartByName('Sauce Labs Bike Light').click();
    await inventoryPage.cartLink.click();
    await cartPage.removeItemByName('Sauce Labs Backpack').click();
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('UI-022 Continue Shopping returns to inventory', async ({ page }) => {
    await inventoryPage.cartLink.click();
    await cartPage.continueShoppingButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('UI-023 Checkout navigates to step one', async ({ page }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack').click();
    await inventoryPage.cartLink.click();
    await cartPage.checkoutButton.click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('UI-024 Checkout button with empty cart', async ({ page }) => {
    await inventoryPage.cartLink.click();
    await expect(cartPage.cartItems).toHaveCount(0);
    await cartPage.checkoutButton.click();
    // Documents actual behavior: app does not block empty-cart checkout.
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
});
