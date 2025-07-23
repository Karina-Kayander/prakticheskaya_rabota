import { test as base, expect as baseExpect } from "@playwright/test";
import { PublishPage } from "../pages/PublishPage";
import { RegistrationPage } from "../pages/RegistrationPage";

type Fixtures = {
  loginAs: () => Promise<void>;
  publish: PublishPage;
  registration: RegistrationPage;
};

export const test = base.extend<Fixtures>({
  publish: async ({ page }, use) => {
    const publish = new PublishPage(page);
    await use(publish);
  },

  registration: async ({ page }, use) => {
    const reg = new RegistrationPage(page);
    await use(reg);
  },

  loginAs: async ({ page }, use) => {
    const doLogin = async () => {
      await page.goto("http://market.sedtest-tools.ru/");
      await page.getByRole("button", { name: "Войти" }).click();
      await page.getByPlaceholder("Email").fill("karina@test.ru");
      await page.getByPlaceholder("Пароль").fill("Qwerty123!");
      await page.getByRole("button", { name: "Войти" }).click();
    };

    await use(doLogin);
  },
});

export const expect = baseExpect;
