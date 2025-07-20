export class RegistrationPage {
  constructor(private page) {}

  async open() {
    await this.page.goto("http://market.sedtest-tools.ru/", {
      waitUntil: "load",
      timeout: 60000,
    });

    await this.page.getByRole("button", { name: "Войти" }).click();
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
    if (data.email !== undefined) {
      const email = this.page.getByRole("textbox", { name: "Почта" });
      await email.waitFor({ timeout: 10000 });
      await email.fill(data.email);
    }

    if (data.firstName !== undefined) {
      const firstName = this.page.getByRole("textbox", { name: "Имя" });
      await firstName.waitFor({ timeout: 10000 });
      await firstName.fill(data.firstName);
    }

    if (data.lastName !== undefined) {
      const lastName = this.page.getByRole("textbox", { name: "Фамилия" });
      await lastName.waitFor({ timeout: 10000 });
      await lastName.fill(data.lastName);
    }

    if (data.phone !== undefined) {
      const phone = this.page.getByRole("textbox", { name: "Телефон" });
      await phone.waitFor({ timeout: 10000 });
      await phone.fill(data.phone);
    }

    if (data.password !== undefined) {
      const password = this.page.getByRole("textbox", { name: "Пароль" });
      await password.waitFor({ timeout: 10000 });
      await password.fill(data.password);
    }
  }

  async submit() {
    await this.page.getByRole("button", { name: "Зарегестрироватся" }).click();
  }

  getEmailError() {
    return this.page.getByRole("textbox", { name: "Почта" });
  }

  getPhoneError() {
    return this.page.getByRole("textbox", { name: "Телефон" });
  }
}
