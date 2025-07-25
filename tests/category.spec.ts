import { test, expect } from "../fixtures/baseFixtures";
import { CategoriesPage } from "../pages/CategoriesPage";

test.describe("Категории", () => {
  test("Открытие категорий и переход по ним", async ({ page }) => {
    const categories = new CategoriesPage(page);
    await categories.open();

    const categoryList = ["Одежда", "Техника", "Спорт", "Услуги"];
    for (const name of categoryList) {
      await categories.selectCategory(name);
    }
  });
});
