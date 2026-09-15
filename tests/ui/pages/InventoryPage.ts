import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.items = page.locator('.inventory_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  addToCartByName(name: string): Locator {
    const item = this.items.filter({ hasText: name });
    return item.getByRole('button', { name: 'Add to cart' });
  }

  removeFromCartByName(name: string): Locator {
    const item = this.items.filter({ hasText: name });
    return item.getByRole('button', { name: 'Remove' });
  }

  async addAllToCart() {
    const buttons = this.page.getByRole('button', { name: 'Add to cart' });
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      await buttons.first().click();
    }
  }

  async removeAllFromCart() {
    const buttons = this.page.getByRole('button', { name: 'Remove' });
    let count = await buttons.count();
    while (count > 0) {
      await buttons.first().click();
      count = await buttons.count();
    }
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
