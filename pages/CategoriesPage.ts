import { expect, Page } from "@playwright/test";

export class CategoriesPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto("http://market.sedtest-tools.ru/");
  }

  async openCategoriesList() {
    await this.page.getByRole("button", { name: "Категории" }).click();
    await this.page.getByText("Все категории").first().click();

    // Проверяем, что заголовок панели появился
    await expect(
      this.page
        .locator("div.Categories_title__BIc7u", { hasText: "Все категории" })
        .first()
    ).toBeVisible();

    const categories = ["Одежда", "Техника", "Спорт", "Услуги"];
    for (const name of categories) {
      const category = this.page
        .locator(".Categories_item__RBV65 a", { hasText: name })
        .first();
      await expect(category).toBeVisible();
    }
  }

  async selectCategory(name: string) {
    await this.openCategoriesList();

    const category = this.page
      .locator(".Categories_item__RBV65 a", { hasText: name })
      .first();
    await expect(category).toBeVisible();
    await category.click();

    // Проверка: заголовок с названием категории
    await expect(this.page.locator(".ListCard_title__YqVEd")).toHaveText(name);
  }
}
