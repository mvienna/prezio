<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white q-pa-sm" bordered>
      <q-toolbar>
        <!-- logo -->
        <a
          :href="ROUTE_PATHS.PRESENTATIONS_BROWSER"
          class="link--no-decorations"
        >
          <div class="row no-wrap">
            <img
              :src="$q.screen.lt.md ? '/logo.svg' : '/prezio.svg'"
              style="height: 32px"
            />

            <div class="q-ml-sm column">
              <q-badge class="bg-grey-2 text-grey-7 text-8" :label="VERSION" />
            </div>
          </div>
        </a>

        <q-space />

        <q-btn
          v-if="feedbackFromUrl"
          :href="feedbackFromUrl"
          target="_blank"
          flat
          no-caps
          text-color="black"
          :class="$q.screen.lt.sm ? 'q-mr-sm round-borders' : ''"
          :size="$q.screen.lt.sm ? '0.75rem' : ''"
          :round="$q.screen.lt.sm"
        >
          <q-icon size="1.25rem" name="o_reviews" />
          <div v-if="!$q.screen.lt.sm" class="q-ml-sm">
            {{ $t("mainLayout.header.feedbackForm.title") }}
          </div>
        </q-btn>

        <q-separator v-if="!$q.screen.lt.sm" vertical class="q-my-sm q-mx-md" />

        <!-- notifications -->
        <q-btn
          color="black"
          flat
          disable
          no-caps
          no-wrap
          round
          size="0.75rem"
          icon="o_notifications"
          class="q-mr-md round-borders"
        />

        <!-- user menu -->
        <UserMenu :is-avatar-only="$q.screen.lt.md" />
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
