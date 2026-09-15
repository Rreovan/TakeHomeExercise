import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.continueShoppingButton = page.locator('#continue-shopping');
    this.checkoutButton = page.locator('#checkout');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  removeItemByName(name: string): Locator {
    const item = this.cartItems.filter({ hasText: name });
    return item.getByRole('button', { name: 'Remove' });
  }
}
