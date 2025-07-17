export class RegistrationPage {
  constructor(private page) {}

  async open() {
    await this.page.goto("http://market.sedtest-tools.ru/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await this.page.getByRole("button", { name: "Войти" }).click();

    // Ждём и кликаем по тексту "Еще не зарегистрированы ?"
    await this.page.getByText("Еще не зарегистрированы ?").click();

    // Ждём появления поля email, как индикатора что форма открыта
    await this.page
      .getByRole("textbox", { name: "Почта" })
      .waitFor({ timeout: 10000 });
  }

  async fill(data: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    password?: string;
  }) {
    if (data.email !== undefined)
      await this.page.fill('input[name="email"]', data.email);
    if (data.firstName !== undefined)
      await this.page.fill('input[name="first_name"]', data.firstName);
    if (data.lastName !== undefined)
      await this.page.fill('input[name="last_name"]', data.lastName);
    if (data.phone !== undefined)
      await this.page.fill('input[name="phone"]', data.phone);
    if (data.password !== undefined)
      await this.page.fill('input[name="password"]', data.password);
  }

  async submit() {
    await this.page.click('button:has-text("Зарегистрироваться")');
  }

  getEmailError() {
    return this.page.locator('input[name="email"]');
  }

  getPhoneError() {
    return this.page.locator('input[name="phone"]');
  }
}
