import { test, expect } from "../fixtures/baseFixtures";
import { RegistrationPage } from "../pages/RegistrationPage";

// ✅ Генерация уникального email
const generateEmail = (prefix = "karina") => `${prefix}_${Date.now()}@test.ru`;

// ✅ Общие валидные данные
const validUser = {
  firstName: "Карина",
  lastName: "Каяндер",
  phone: "+79998887766",
  password: "Qwerty123!",
};

test.describe("Регистрация", () => {
  let reg: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    reg = new RegistrationPage(page);
    await reg.open();
  });

  test("Успешная регистрация", async ({ page }) => {
    await reg.fill({ ...validUser, email: generateEmail() });
    await reg.submit();

    await expect(page).toHaveURL(/account/);
    await expect(page.locator("text=Мои объявления")).toBeVisible();
  });

  test("Пустое поле 'Почта'", async ({ page }) => {
    await reg.fill({ ...validUser, email: "" });
    await reg.submit();
    await expect(page.locator("text=Заполните поле")).toBeVisible();
  });

  test("Неверный формат email", async ({ page }) => {
    await reg.fill({ ...validUser, email: "karina.test" });
    await reg.submit();
    await expect(page.locator("text=Неверный формат почты")).toBeVisible();
  });

  test("Пустое поле 'Имя'", async ({ page }) => {
    await reg.fill({ ...validUser, email: generateEmail(), firstName: "" });
    await reg.submit();
    await expect(page.locator("text=Заполните поле")).toBeVisible();
  });

  test("Пустое поле 'Фамилия'", async ({ page }) => {
    await reg.fill({ ...validUser, email: generateEmail(), lastName: "" });
    await reg.submit();
    await expect(page.locator("text=Заполните поле")).toBeVisible();
  });

  test("Пустое поле 'Телефон'", async ({ page }) => {
    await reg.fill({ ...validUser, email: generateEmail(), phone: "" });
    await reg.submit();
    await expect(page.locator("text=Заполните поле")).toBeVisible();
  });

  test("Неполный номер телефона", async ({ page }) => {
    await reg.fill({ ...validUser, email: generateEmail(), phone: "+7999" });
    await reg.submit();
    await expect(page.locator("text=Неверный формат телефона")).toBeVisible();
  });

  test("Пустое поле 'Пароль'", async ({ page }) => {
    await reg.fill({ ...validUser, email: generateEmail(), password: "" });
    await reg.submit();
    await expect(page.locator("text=Заполните поле")).toBeVisible();
  });

  test("Короткий пароль", async ({ page }) => {
    await reg.fill({
      email: generateEmail("shortpass"),
      firstName: "Тест",
      lastName: "Короткий",
      phone: "+79990001122",
      password: "123", // < 7 символов
    });
    await reg.submit();

    await expect(page).not.toHaveURL(/account/);
    await expect(page.locator("text=Мин.длинна - 7 символов")).toBeVisible();
  });

  test("Переход с регистрации обратно на форму входа", async ({ page }) => {
    await page.goto("http://market.sedtest-tools.ru/");
    await page.getByRole("button", { name: "Войти" }).click();

    await page.getByText("Еще не зарегистрированы ?").click();
    await page.getByText("Уже есть аккаунт ?").click();

    await expect(page.locator('input[name="email"]')).toBeVisible({
      timeout: 7000,
    });
    await expect(page.getByText("Вход")).toBeVisible();
  });
});
