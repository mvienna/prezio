<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white q-pa-sm">
      <q-toolbar>
        <!-- logo -->
        <a
          :href="ROUTE_PATHS.PRESENTATIONS_BROWSER"
          class="link--no-decorations"
        >
          <div class="row no-wrap">
            <img src="/prezio.svg" style="height: 32px" />

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

        <q-btn
          v-if="feedbackFromUrl"
          :href="feedbackFromUrl"
          target="_blank"
          class="q-mr-md"
          unelevated
          no-caps
          color="primary"
        >
          <div class="shiny_text q-mr-sm">
            {{ $t("mainLayout.header.feedbackForm.title") }}
          </div>
          <q-icon name="r_open_in_new" size="20px" />
        </q-btn>

        <!-- notifications -->
        <q-btn
          color="black"
          flat
          disable
          no-caps
          no-wrap
          round
          size="12px"
          icon="o_notifications"
          class="q-mr-md round-borders"
        />

        <!-- user menu -->
        <UserMenu />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ROUTE_PATHS } from "src/constants/routes";
import UserMenu from "components/user/UserMenu.vue";
import { computed } from "vue";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const router = useRouter();

/*
 * assembly version
 */
const VERSION = computed(() => {
  return process.env.VERSION;
});

/*
 * feedback form url
 */
const feedbackFromUrl = computed(() => {
  return process.env.FEEDBACK_FORM_URL;
});
</script>

<style scoped lang="scss">
.shiny_text {
  color: #fff;
  background: linear-gradient(to right, $grey-4 0, $white 10%, $grey-4 20%);
  background-position: 0;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 3s infinite linear;
  animation-fill-mode: forwards;
  -webkit-text-size-adjust: none;
}
@keyframes shine {
  0% {
    background-position: 0;
  }
  60% {
    background-position: 105px;
  }
  100% {
    background-position: 105px;
  }
}
@-moz-keyframes shine {
  0% {
    background-position: 0;
  }
  60% {
    background-position: 105px;
  }
  100% {
    background-position: 105px;
  }
}
@-webkit-keyframes shine {
  0% {
    background-position: 0;
  }
  60% {
    background-position: 105px;
  }
  100% {
    background-position: 105px;
  }
}
@-o-keyframes shine {
  0% {
    background-position: 0;
  }
  60% {
    background-position: 105px;
  }
  100% {
    background-position: 105px;
  }
}
</style>
