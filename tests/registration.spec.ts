import { test, expect } from "../fixtures/baseFixtures";
import { RegistrationPage } from "../pages/RegistrationPage";

test.describe("Регистрация", () => {
  test("Успешная регистрация", async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.open();

    // Уникальный email + все остальные обязательные поля
    await reg.fill({
      email: `karina_${Date.now()}@test.ru`,
      firstName: "Карина",
      lastName: "Кайандер",
      phone: "+79998887766",
      password: "Qwerty123!",
    });

    await reg.submit();

    // Проверка успешной регистрации — переход на страницу аккаунта
    await expect(page).toHaveURL(/account/);
    await expect(page.locator("text=Мои объявления")).toBeVisible();
  });
});
