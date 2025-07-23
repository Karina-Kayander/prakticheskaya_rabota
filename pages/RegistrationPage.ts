import { Page, expect } from "@playwright/test";

export class RegistrationPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto("http://market.sedtest-tools.ru/", {
      waitUntil: "load",
      timeout: 60000,
    });

    await this.page.getByRole("button", { name: "Войти" }).click();
    await this.page.getByText("Еще не зарегистрированы ?").click();
    await expect(this.emailField).toBeVisible();
  }

  async fill(data: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    password?: string;
  }) {
    if (data.email !== undefined) await this.emailField.fill(data.email);
    if (data.firstName !== undefined)
      await this.firstNameField.fill(data.firstName);
    if (data.lastName !== undefined)
      await this.lastNameField.fill(data.lastName);
    if (data.phone !== undefined) await this.phoneField.fill(data.phone);
    if (data.password !== undefined)
      await this.passwordField.fill(data.password);
  }

  async submit() {
    await this.page.getByRole("button", { name: "Зарегестрироватся" }).click();
  }

  async assertRequiredFieldError() {
    await expect(this.page.locator("text=Заполните поле")).toBeVisible();
  }

  // Геттеры для полей
  private get emailField() {
    return this.page.getByRole("textbox", { name: "Почта" });
  }

  private get firstNameField() {
    return this.page.getByRole("textbox", { name: "Имя" });
  }

  private get lastNameField() {
    return this.page.getByRole("textbox", { name: "Фамилия" });
  }

  private get phoneField() {
    return this.page.getByRole("textbox", { name: "Телефон" });
  }

  private get passwordField() {
    return this.page.getByRole("textbox", { name: "Пароль" });
  }
}
