<template>
  <q-page>
    <q-header class="bg-white q-pa-sm" bordered>
      <q-toolbar class="container row no-wrap items-center">
        <!-- logo -->
        <a
          :href="ROUTE_PATHS.PRESENTATIONS_BROWSER"
          class="link--no-decorations"
        >
          <div class="row no-wrap">
            <img
              :src="$q.screen.lt.md ? '/logo.svg' : '/prezio.svg'"
              style="height: 36px"
            />

            <div class="q-ml-sm column">
              <q-badge
                class="bg-grey-2 text-grey-7"
                style="font-size: 10px; margin-top: 3px"
                :label="VERSION"
              />
            </div>
          </div>
        </a>

        <q-space />

        <a href="#features" class="link text-grey-9">
          {{ $t("landing.hyperlinks.features") }}
        </a>
        <a href="#prices" class="link text-grey-9 q-mx-md">
          {{ $t("landing.hyperlinks.prices") }}
        </a>
        <a href="#faq" class="link text-grey-9">
          {{ $t("landing.hyperlinks.faq") }}
        </a>

        <q-space />

        <!-- login -->
        <q-btn
          outline
          :label="$t('landing.auth.login')"
          no-caps
          class="q-mr-md"
          :href="appUrl + ROUTE_PATHS.AUTH.LOGIN"
        />

        <!-- signup -->
        <q-btn
          unelevated
          color="primary"
          :label="$t('landing.auth.signup')"
          no-caps
          :href="appUrl + ROUTE_PATHS.AUTH.SIGNUP"
        />
      </q-toolbar>
    </q-header>

    <!-- heroes -->
    <div class="container">
      <div class="heroes q-py-xl q-my-xl">
        <div>
          <div class="text-h3 text-semibold" style="line-height: 1.2">
            {{ $t("landing.heroes.title.static") }} <br />

            <span
              class="typewrite text-primary"
              data-period="2000"
              :data-type="dynamicTitles"
            >
              <span class="wrap"></span>
            </span>
          </div>

          <div class="text-h7 q-my-lg q-py-sm">
            {{ $t("landing.heroes.description") }}
          </div>

          <q-btn
            :label="$t('landing.heroes.action')"
            unelevated
            color="primary"
            no-caps
            size="16px"
            :href="appUrl + ROUTE_PATHS.AUTH.SIGNUP"
          />
        </div>

        <div>
          <q-img
            src="/assets/illustrations/heroes.svg"
            alt="Prezio heroes illustration"
          />
        </div>
      </div>
    </div>

    <!-- benefits -->
    <div id="features" class="bg-grey-2 q-py-xl">
      <div class="container">
        <div class="q-py-xl">
          <div class="text-h4 text-semibold text-center">
            {{ $t("landing.benefits.title") }}
          </div>
          <div class="text-center q-mt-3xs q-mb-xl">
            {{ $t("landing.benefits.description") }}
          </div>

          <div class="betefit_cards_grid">
            <q-card class="shadow-sm-hard betefit_card">
              <q-card-section>
                <q-img src="assets/images/landing/benefit/sales.png" />

                <div class="text-h6 text-semibold q-mt-md q-mb-sm">
                  {{ $t("landing.benefits.sales.title") }}
                </div>

                <div class="text-grey-9">
                  {{ $t("landing.benefits.sales.description") }}
                </div>
              </q-card-section>
            </q-card>

            <q-card class="shadow-sm-hard betefit_card">
              <q-card-section>
                <q-img
                  src="assets/images/landing/benefit/experts_and_teams.png"
                />

                <div class="text-h6 text-semibold q-mt-md q-mb-sm">
                  {{ $t("landing.benefits.expertsAndTeams.title") }}
                </div>

                <div class="text-grey-9">
                  {{ $t("landing.benefits.expertsAndTeams.description") }}
                </div>
              </q-card-section>
            </q-card>

            <q-card class="shadow-sm-hard betefit_card">
              <q-card-section>
                <q-img src="assets/images/landing/benefit/teachers.png" />

                <div class="text-h6 text-semibold q-mt-md q-mb-sm">
                  {{ $t("landing.benefits.teachers.title") }}
                </div>

                <div class="text-grey-9">
                  {{ $t("landing.benefits.teachers.description") }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useMeta } from "quasar";
import { useI18n } from "vue-i18n";
import { ROUTE_PATHS, SUBDOMAINS } from "src/constants/routes";
import { computed, onMounted } from "vue";

/*
 * assembly version
 */
const VERSION = computed(() => {
  return process.env.VERSION;
});

/*
 * url
 */
const appUrl =
  // protocol
  window.location.protocol +
  "//" +
  // subdomain
  SUBDOMAINS.app +
  "." +
  // host
  window.location.host;

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * typing animation
 */
const dynamicTitles =
  "[" +
  '"' +
  t("landing.heroes.title.dynamic.one") +
  '",' +
  '"' +
  t("landing.heroes.title.dynamic.two") +
  '",' +
  '"' +
  t("landing.heroes.title.dynamic.three") +
  '"' +
  "]";

let TxtType = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = "";
  this.tick();
  this.isDeleting = false;
};

TxtType.prototype.tick = function () {
  let i = this.loopNum % this.toRotate.length;
  let fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

  let that = this;
  let delta = 200 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};

onMounted(() => {
  let elements = document.getElementsByClassName("typewrite");
  for (let i = 0; i < elements.length; i++) {
    let toRotate = elements[i].getAttribute("data-type");
    let period = elements[i].getAttribute("data-period");
    if (toRotate) {
      new TxtType(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  let css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML =
    ".typewrite > .wrap { border-right: 0.08em solid var(--q-primary)}";
  document.body.appendChild(css);
});

/*
 * meta
 */
useMeta({
  title: t("meta.app"),
  titleTemplate: (title) => `${title} - ${t("meta.homepage.title")}`,

  // meta tags
  meta: {
    description: {
      name: "description",
      content: t("meta.homepage.description"),
    },
    keywords: {
      name: "keywords",
      content: t("meta.homepage.keywords"),
    },
    equiv: {
      "http-equiv": "Content-Type",
      content: "text/html; charset=UTF-8",
    },
    // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
    ogTitle: {
      property: "og:title",
      // optional; similar to titleTemplate, but allows templating with other meta properties
      template(ogTitle) {
        return `${ogTitle} - ${t("meta.homepage.title")}`;
      },
    },
  },

  // CSS tags
  link: {
    material: {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/icon?family=Material+Icons",
    },
  },

  // JS tags
  script: {
    ldJson: {
      type: "application/ld+json",
      innerHTML: `{ "@context": "http://schema.org" }`,
    },
  },

  // <html> attributes
  htmlAttr: {
    "xmlns:cc": "http://creativecommons.org/ns#", // generates <html xmlns:cc="http://creativecommons.org/ns#">,
    empty: undefined, // generates <html empty>
  },

  // <body> attributes
  bodyAttr: {
    "action-scope": "xyz", // generates <body action-scope="xyz">
    empty: undefined, // generates <body empty>
  },

  // <noscript> tags
  noscript: {
    default: "This is content for browsers with no JS (or disabled JS)",
  },
});
</script>

<style scoped lang="scss">
.container {
  max-width: 1200px;
}

.heroes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.betefit_cards_grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  .betefit_card {
    border-radius: 1em;

    .q-img {
      border-radius: calc(1em - 1em / 2);
    }
  }
}
</style>
