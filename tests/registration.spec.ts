import { test, expect } from "../fixtures/baseFixtures";
import { RegistrationPage } from "../pages/RegistrationPage";

test.describe("Регистрация", () => {
  test("Успешная регистрация", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.open();

    await reg.fill({
      email: `karina_${Date.now()}@test.ru`,
      firstName: "Карина",
      lastName: "Каяндер",
      phone: "+79998887766",
      password: "Qwerty123!",
    });

    await reg.submit();

    await expect(page).toHaveURL(/account/);
    await expect(page.locator("text=Мои объявления")).toBeVisible();
  });

  test('Пустое поле "Почта"', async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.open();

    await reg.fill({
      email: "",
      firstName: "Карина",
      lastName: "Каяндер",
      phone: "+79998887766",
      password: "Qwerty123!",
    });

    await reg.submit();
    await expect(page.locator("text=Заполните поле")).toBeVisible();
  });

  test("Неверный формат email", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.open();

    await reg.fill({
      email: "karina.test",
      firstName: "Карина",
      lastName: "Каяндер",
      phone: "+79998887766",
      password: "Qwerty123!",
    });

    await reg.submit();
    await expect(page.locator("text=Неверный формат почты")).toBeVisible();
  });

  test('Пустое поле "Имя"', async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.open();

    await reg.fill({
      email: `karina_${Date.now()}@test.ru`,
      firstName: "",
      lastName: "Каяндер",
      phone: "+79998887766",
      password: "Qwerty123!",
    });

    await reg.submit();
    await expect(page.locator("text=Заполните поле")).toBeVisible();
  });

  test('Пустое поле "Фамилия"', async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.open();

    await reg.fill({
      email: `karina_${Date.now()}@test.ru`,
      firstName: "Карина",
      lastName: "",
      phone: "+79998887766",
      password: "Qwerty123!",
    });

    await reg.submit();
    await expect(page.locator("text=Заполните поле")).toBeVisible();
  });

  test('Пустое поле "Телефон"', async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.open();

    await reg.fill({
      email: `karina_${Date.now()}@test.ru`,
      firstName: "Карина",
      lastName: "Каяндер",
      phone: "",
      password: "Qwerty123!",
    });

    await reg.submit();
    await expect(page.locator("text=Заполните поле")).toBeVisible();
  });

  test("Неполный номер телефона", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.open();

    await reg.fill({
      email: `karina_${Date.now()}@test.ru`,
      firstName: "Карина",
      lastName: "Каяндер",
      phone: "+7999",
      password: "Qwerty123!",
    });

    await reg.submit();
    await expect(page.locator("text=Неверный формат телефона")).toBeVisible();
  });

  test('Пустое поле "Пароль"', async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.open();

    await reg.fill({
      email: `karina_${Date.now()}@test.ru`,
      firstName: "Карина",
      lastName: "Каяндер",
      phone: "+79998887766",
      password: "",
    });

    await reg.submit();
    await expect(page.locator("text=Заполните поле")).toBeVisible();
  });

  test("Короткий пароль", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.open();

    await reg.fill({
      email: `shortpass_${Date.now()}@test.ru`,
      firstName: "Тест",
      lastName: "Короткий",
      phone: "+79990001122",
      password: "123", // < 7 символов
    });

    await reg.submit();

    // Проверяем, что остались на той же странице
    await expect(page).not.toHaveURL(/account/);

    // Проверяем текст ошибки под паролем
    await expect(page.locator("text=Мин.длинна - 7 символов")).toBeVisible();
  });

  test("Переход с регистрации обратно на форму входа", async ({ page }) => {
    await page.goto("http://market.sedtest-tools.ru/");
    await page.getByRole("button", { name: "Войти" }).click();

    await page.getByText("Еще не зарегистрированы ?").click();
    await page.getByText("Уже есть аккаунт ?").click();

    // Проверяем, что появилось поле для почты по name="email"
    await expect(page.locator('input[name="email"]')).toBeVisible({
      timeout: 7000,
    });

    // Проверяем заголовок "Вход"
    await expect(page.getByText("Вход")).toBeVisible();
  });
});
