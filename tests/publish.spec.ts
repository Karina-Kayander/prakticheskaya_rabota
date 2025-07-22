import { test, expect } from "../fixtures/baseFixtures";
import { PublishPage } from "../pages/PublishPage";

test.describe("Подача объявления", () => {
  test("Попытка подать объявление без авторизации", async ({ page }) => {
    const publish = new PublishPage(page);
    await publish.openMainPage();
    await publish.clickPublishButton();

    await expect(page.getByText("Вход")).toBeVisible();
  });

  test("Успешная подача объявления после авторизации (без фото)", async ({
    page,
  }, testInfo) => {
    const publish = new PublishPage(page);
    const title = `Продам велосипед [${testInfo.project.name}]`;

    await publish.openMainPage();
    await publish.clickLoginButton();
    await publish.login("karina@test.ru", "Qwerty123!");
    await publish.clickPublishButton();

    await publish.fillForm({
      title,
      category: "Спорт",
      description: "Почти новый, использовался 2 раза",
      price: "8500",
    });

    await publish.submitForm();

    await expect(page.locator("text=Объявление создано")).toBeVisible();
    await expect(page.locator("text=Мои объявления")).toBeVisible();

    // Снятие объявления с продажи
    await page.getByText("Мои объявления").click();
    await publish.removeAd(title);
  });

  test("Пустое поле 'Название товара/услуги'", async ({ page }) => {
    const publish = new PublishPage(page);

    await publish.openMainPage();
    await publish.clickLoginButton();
    await publish.login("karina@test.ru", "Qwerty123!");
    await publish.clickPublishButton();

    await publish.fillForm({
      title: "",
      category: "Спорт",
      description: "Почти новый, использовался 2 раза",
      price: "8500",
    });

    await publish.submitForm();

    const titleField = page.locator('input[name="title"]');
    const helperText = titleField.locator(
      'xpath=following::p[contains(@class, "MuiFormHelperText-root")][1]'
    );
    await expect(helperText).toHaveText("Заполните поле");
  });

  test("Подача объявления с ценой 0 (Договорная)", async ({
    page,
  }, testInfo) => {
    const publish = new PublishPage(page);
    const title = `Отдам даром книгу [${testInfo.project.name}]`;

    await publish.openMainPage();
    await publish.clickLoginButton();
    await publish.login("karina@test.ru", "Qwerty123!");
    await publish.clickPublishButton();

    await publish.fillForm({
      title,
      category: "Услуги",
      description: "Книга в хорошем состоянии, самовывоз.",
      price: "0",
    });

    await publish.submitForm();

    await expect(page.locator("text=Объявление создано")).toBeVisible();
    await page.getByText("Мои объявления").click();

    await expect(
      page.locator(".Card_price__ziptK", { hasText: "Договорная" }).first()
    ).toBeVisible();

    await publish.removeAd(title);
  });

  test("Появление объявления в разделе 'Мои объявления'", async ({
    page,
  }, testInfo) => {
    const publish = new PublishPage(page);
    const title = `Старый ноутбук ASUS [${testInfo.project.name}]`;

    await publish.openMainPage();
    await publish.clickLoginButton();
    await publish.login("karina@test.ru", "Qwerty123!");
    await publish.clickPublishButton();

    await publish.fillForm({
      title,
      category: "Техника",
      description: "Работает, но медленно. Батарея слабая.",
      price: "1500",
    });

    await publish.submitForm();
    await expect(page.locator("text=Объявление создано")).toBeVisible();

    await page.getByText("Мои объявления").click();
    await expect(
      page.locator(`.Card_name__kuUUr:has-text("${title}")`)
    ).toBeVisible();

    await publish.removeAd(title);
  });
});
