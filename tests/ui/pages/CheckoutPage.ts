import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  // Step one
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // Step two (overview)
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelOverviewButton: Locator;

  // Complete
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
    this.cancelButton = page.locator('#cancel');
    this.errorMessage = page.locator('[data-test="error"]');

    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('#finish');
    this.cancelOverviewButton = page.locator('#cancel');

    this.completeHeader = page.locator('.complete-header');
    this.backHomeButton = page.locator('#back-to-products');
  }

  async gotoStepOne() {
    await this.page.goto('/checkout-step-one.html');
  }

  async fillInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }
}
