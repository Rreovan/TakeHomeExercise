import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';

test.describe('Inventory & Sorting', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    inventoryPage = new InventoryPage(page);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('UI-010 Inventory lists all 6 products', async () => {
    await expect(inventoryPage.items).toHaveCount(6);
    for (const item of await inventoryPage.items.all()) {
      await expect(item.locator('.inventory_item_name')).toBeVisible();
      await expect(item.locator('.inventory_item_price')).toBeVisible();
      await expect(item.locator('img')).toBeVisible();
      await expect(item.getByRole('button', { name: 'Add to cart' })).toBeVisible();
    }
  });

  test('UI-011 Sort Name (A to Z)', async () => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.itemNames.allTextContents();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('UI-012 Sort Name (Z to A)', async () => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.itemNames.allTextContents();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('UI-013 Sort Price (low to high)', async () => {
    await inventoryPage.sortBy('lohi');
    const prices = (await inventoryPage.itemPrices.allTextContents()).map((p) =>
      parseFloat(p.replace('$', ''))
    );
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('UI-014 Sort Price (high to low)', async () => {
    await inventoryPage.sortBy('hilo');
    const prices = (await inventoryPage.itemPrices.allTextContents()).map((p) =>
      parseFloat(p.replace('$', ''))
    );
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('UI-015 Add single product to cart', async () => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack').click();
    await expect(inventoryPage.removeFromCartByName('Sauce Labs Backpack')).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('UI-016 Add multiple products updates badge accurately', async () => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack').click();
    await inventoryPage.addToCartByName('Sauce Labs Bike Light').click();
    await inventoryPage.addToCartByName('Sauce Labs Bolt T-Shirt').click();
    await expect(inventoryPage.cartBadge).toHaveText('3');
    await expect(inventoryPage.removeFromCartByName('Sauce Labs Backpack')).toBeVisible();
    await expect(inventoryPage.removeFromCartByName('Sauce Labs Bike Light')).toBeVisible();
    await expect(inventoryPage.removeFromCartByName('Sauce Labs Bolt T-Shirt')).toBeVisible();
  });

  test('UI-017 Remove product from inventory page', async () => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack').click();
    await inventoryPage.addToCartByName('Sauce Labs Bike Light').click();
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await inventoryPage.removeFromCartByName('Sauce Labs Backpack').click();
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(inventoryPage.addToCartByName('Sauce Labs Backpack')).toBeVisible();
  });

  test('UI-018 Add all then remove all clears badge', async () => {
    await inventoryPage.addAllToCart();
    await expect(inventoryPage.cartBadge).toHaveText('6');
    await inventoryPage.removeAllFromCart();
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });
});
