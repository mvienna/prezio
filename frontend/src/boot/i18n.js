import { boot } from "quasar/wrappers";
import { createI18n } from "vue-i18n";
import messages from "src/i18n";

export default boot(({ app }) => {
  const i18n = createI18n({
    locale: process.env.LANG,
    globalInjection: true,
    warnHtmlMessage: false,
    messages,
  });

  app.use(i18n);
});
