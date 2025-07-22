import { Page, expect } from "@playwright/test";

export class PublishPage {
  constructor(private page: Page) {}

  async openMainPage() {
    await this.page.goto("http://market.sedtest-tools.ru/");
  }

  async clickPublishButton() {
    await this.page.getByRole("button", { name: "Подать объявление" }).click();
  }

  async clickLoginButton() {
    await this.page.getByRole("button", { name: "Войти" }).click();
  }

  async login(email: string, password: string) {
    const container = this.page.locator(
      "#root > div > div:nth-child(2) > div.MuiBox-root.css-wclg7c"
    );
    await container.locator('input[name="email"]').fill(email);
    await container.locator('input[name="password"]').fill(password);
    await container
      .locator(
        'button.MuiButtonBase-root.MuiButton-root[type="button"]:has-text("Войти")'
      )
      .click();
    await expect(this.page.locator("text=Мои объявления")).toBeVisible();
  }

  async fillForm(data: {
    title: string;
    category: string;
    description: string;
    price: string;
  }) {
    await this.page.locator('input[name="title"]').fill(data.title);
    await this.page.locator('textarea[name="desc"]').fill(data.description);
    await this.page.locator('input[name="price"]').fill(data.price);
    const categoryContainer = this.page.locator(
      "#root > div > div:nth-child(2) > div > div > div.MuiBox-root.css-1274r9c .swiper-slide-category.swiper-slide-active"
    );
    const categoryLink = categoryContainer
      .locator(".Categories_item__RBV65 a", { hasText: data.category })
      .first();
    await expect(categoryLink).toBeVisible();
    await categoryLink.click();
  }

  async submitForm() {
    await this.page
      .locator(
        'button.MuiButtonBase-root.MuiButton-root.MuiButton-contained[type="button"]:has-text("Подать объявление")'
      )
      .nth(1)
      .click();
  }

  async removeAd(title: string) {
    const card = this.page.locator(".Card_wrap__ZiHIA", {
      has: this.page.locator(".Card_name__kuUUr", { hasText: title }),
    });

    // Открыть меню действий
    await card.locator('[data-testid="MoreVertIcon"]').click();

    // Нажать "Снять с продажи"
    await this.page
      .locator("div.Card_settingItem__THhNu", { hasText: "Снять с продажи" })
      .click();

    // Дождаться исчезновения объявления (опционально, по надёжности)
    await expect(card).toHaveCount(0);
  }
}
