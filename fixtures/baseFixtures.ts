import { test as base } from "@playwright/test";

type Fixtures = {
  loginAs: () => Promise<void>;
};

export const test = base.extend<Fixtures>({
  loginAs: async ({ page }, use) => {
    await use(async () => {
      await page.goto("http://market.sedtest-tools.ru/");
      await page.click('text=Войти');
      await page.fill('input[name="email"]', "test@test.ru");
      await page.fill('input[name="password"]', "12345678");
      await page.click('button:has-text("Войти")');
    });
  },
});

export { expect } from "@playwright/test";