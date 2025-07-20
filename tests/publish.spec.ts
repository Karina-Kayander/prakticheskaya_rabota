import { test, expect } from "../fixtures/baseFixtures";
import { PublishPage } from "../pages/PublishPage";

test.describe("Подача объявления", () => {
  test("Попытка подать объявление без авторизации", async ({ page }) => {
    const publish = new PublishPage(page);
    await publish.openMainPage();
    await publish.clickPublishButton();

    // Проверка — открылось окно входа
    await expect(page.getByText("Вход")).toBeVisible();
  });

  test("Успешная подача объявления после авторизации (без фото)", async ({
    page,
  }) => {
    const publish = new PublishPage(page);

    // Авторизация
    await publish.openMainPage();
    await publish.clickLoginButton();
    await publish.login("karina@test.ru", "Qwerty123!");

    // Подача объявления
    await publish.clickPublishButton();

    await publish.fillForm({
      title: "Продам велосипед",
      category: "Спорт",
      description: "Почти новый, использовался 2 раза",
      price: "8500",
    });

    await publish.submitForm();

    // Проверка успешной отправки
    await expect(page.locator("text=Объявление создано")).toBeVisible();
    await expect(page.locator("text=Мои объявления")).toBeVisible();
  });

  test("Пустое поле 'Название товара/услуги'", async ({ page }) => {
    const publish = new PublishPage(page);

    // Авторизация
    await publish.openMainPage();
    await publish.clickLoginButton();
    await publish.login("karina@test.ru", "Qwerty123!");

    // Открыть форму подачи объявления
    await publish.clickPublishButton();

    // Заполняем только часть формы (без title)
    await publish.fillForm({
      title: "", // <-- Пустой заголовок
      category: "Спорт",
      description: "Почти новый, использовался 2 раза",
      price: "8500",
    });

    // Отправка формы
    await publish.submitForm();

    // Проверка: должна появиться ошибка или подсветка поля
    const titleField = page.locator('input[name="title"]');
    const helperText = titleField.locator(
      'xpath=following::p[contains(@class, "MuiFormHelperText-root")][1]'
    );

    await expect(helperText).toHaveText("Заполните поле");
  });

  test("Подача объявления с ценой 0 (Договорная)", async ({ page }) => {
    const publish = new PublishPage(page);

    // Авторизация
    await publish.openMainPage();
    await publish.clickLoginButton();
    await publish.login("karina@test.ru", "Qwerty123!");

    // Подача объявления
    await publish.clickPublishButton();

    await publish.fillForm({
      title: "Отдам даром книгу",
      category: "Услуги",
      description: "Книга в хорошем состоянии, самовывоз.",
      price: "0", // Цена 0 — должна отображаться как "Договорная"
    });

    await publish.submitForm();

    // Проверка: объявление создано
    await expect(page.locator("text=Объявление создано")).toBeVisible();
    await expect(
      page.locator("div.MuiBox-root.css-1blxejy", { hasText: "Мои объявления" })
    ).toBeVisible();

    // Открываем "Мои объявления"
    await page.getByText("Мои объявления").click();

    // Проверка: цена отображается как "Договорная"
    await expect(
      page.locator(".Card_price__ziptK", { hasText: "Договорная" })
    ).toBeVisible();
  });

  test("Появление объявления в разделе 'Мои объявления'", async ({ page }) => {
    const publish = new PublishPage(page);

    // 1. Авторизация
    await publish.openMainPage();
    await publish.clickLoginButton();
    await publish.login("karina@test.ru", "Qwerty123!");

    // 2. Подача объявления
    const title = "Старый ноутбук ASUS";
    await publish.clickPublishButton();
    await publish.fillForm({
      title,
      category: "Техника",
      description: "Работает, но медленно. Батарея слабая.",
      price: "1500",
    });
    await publish.submitForm();

    // 3. Проверка успешной подачи
    await expect(page.locator("text=Объявление создано")).toBeVisible();

    // 4. Переход в раздел "Мои объявления"
    await page
      .locator("div.MuiBox-root.css-1blxejy", { hasText: "Мои объявления" })
      .click();

    // 5. Проверка, что объявление отображается
    await expect(page.locator(`text=${title}`)).toBeVisible();
  });
});
