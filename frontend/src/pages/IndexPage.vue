<template>
  <q-page>
    <q-header class="bg-white" bordered>
      <q-toolbar class="container q-pa-3xs row no-wrap items-center">
        <!-- logo -->
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

      <q-toolbar
        v-if="showJoinRoomToolbar"
        class="row no-wrap justify-center items-center q-pa-sm join_room"
      >
        <div class="text-black q-mr-sm">
          {{ $t("landing.joinRoom.title") }}
        </div>

        <form @submit.prevent="handleRoomSearch()">
          <q-input
            v-model="roomId"
            outlined
            dense
            class="join_room__token_input"
            :placeholder="$t('landing.joinRoom.enterCode')"
            :prefix="$t('landing.joinRoom.url')"
            :error="!!roomSearchError"
            hide-bottom-space
            no-error-icon
          >
            <template #append>
              <q-btn
                unelevated
                :label="$t('landing.joinRoom.join')"
                color="grey-2"
                text-color="black"
                size="12px"
                no-caps
                class="q-px-sm"
                @click="handleRoomSearch()"
              />
            </template>
          </q-input>
        </form>

        <q-btn
          flat
          round
          size="10px"
          color="black"
          icon="r_close"
          class="absolute round-borders"
          style="top: 50%; transform: translateY(-50%); right: 24px"
          @click="showJoinRoomToolbar = false"
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
    <div id="features" class="bg-white q-py-xl">
      <div class="container">
        <div class="q-py-xl">
          <div class="text-h4 text-semibold text-center">
            {{ $t("landing.benefits.title") }}
          </div>
          <div class="text-center q-mt-3xs q-mb-xl">
            {{ $t("landing.benefits.description") }}
          </div>

          <div class="betefit_cards_grid">
            <q-card flat class="betefit_card">
              <q-img src="assets/images/landing/benefit/sales.png" />

              <q-card-section class="q-pa-lg">
                <div class="text-h6 text-semibold q-mb-sm">
                  {{ $t("landing.benefits.sales.title") }}
                </div>

                <div class="text-grey-9">
                  {{ $t("landing.benefits.sales.description") }}
                </div>
              </q-card-section>
            </q-card>

            <q-card flat class="betefit_card">
              <q-img
                src="assets/images/landing/benefit/experts_and_teams.png"
              />

              <q-card-section class="q-pa-lg">
                <div class="text-h6 text-semibold q-mb-sm">
                  {{ $t("landing.benefits.expertsAndTeams.title") }}
                </div>

                <div class="text-grey-9">
                  {{ $t("landing.benefits.expertsAndTeams.description") }}
                </div>
              </q-card-section>
            </q-card>

            <q-card flat class="betefit_card">
              <q-img src="assets/images/landing/benefit/teachers.png" />

              <q-card-section class="q-pa-lg">
                <div class="text-h6 text-semibold q-mb-sm">
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
import { computed, onMounted, ref } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";

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

const router = useRouter();

/*
 * join room
 */
const showJoinRoomToolbar = ref(true);

const roomId = ref();
const roomSearchError = ref();

const handleRoomSearch = () => {
  api
    .get(`/room/${roomId.value}`)
    .then((response) => {
      router.push(response.data.room.token);
    })
    .catch((error) => {
      console.log(error);
      roomSearchError.value = error.response.data.message;

      $q.notify({
        message: error.response.data.message,
        color: "red",
        icon: "r_crisis_alert",
      });
    });
};

/*
 * typing animation
 */
const dynamicTitles = [
  t("landing.heroes.title.dynamic.one"),
  t("landing.heroes.title.dynamic.two"),
  t("landing.heroes.title.dynamic.three"),
];

const TxtType = function (el, toRotate, period) {
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

  const colors = ["var(--q-primary)", "#F53535", "#8136DC"];
  const color = colors[i % colors.length];

  this.el.innerHTML = `<span class="wrap" style="color: ${color}; border-right: 0.08em solid ${color}; animation: pulse 1s infinite steps(1);">
    ${this.txt}
    </span>`;

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

  setTimeout(() => {
    that.tick();
  }, delta);
};

onMounted(() => {
  let elements = document.getElementsByClassName("typewrite");
  for (let i = 0; i < elements.length; i++) {
    let toRotate = elements[i].getAttribute("data-type");
    let period = elements[i].getAttribute("data-period");
    if (toRotate) {
      new TxtType(elements[i], toRotate.split(","), period);
    }
  }
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
.q-page {
  background: $grey-1;
}

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
    background: $grey-1;
    border-radius: 1.25em;
  }
}

.join_room {
  background: linear-gradient(90deg, #e9eefd 0%, #f9e9f3 100%);
  border-top: 1px solid #e8e8eb;
}

::v-deep(.join_room__token_input) {
  .q-field__control {
    background: $white;
    padding: 0 8px !important;
    width: 321px;
  }
  .q-field__prepend {
    padding-right: 4px !important;
  }
}
</style>

<style lang="scss">
@keyframes pulse {
  0%,
  100% {
    border-color: currentColor;
  }
  50% {
    border-color: $grey-3;
  }
}
</style>
