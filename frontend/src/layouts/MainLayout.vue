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
            <img src="/logo_with_title_black.png" style="height: 32px" />

            <div class="q-ml-sm column">
              <q-badge
                class="bg-grey-2 text-grey-5 text-xs"
                :label="VERSION"
                @click="copyToClipboard(VERSION)"
              />
            </div>
          </div>
        </a>

        <q-space />

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
import { copyToClipboard } from "quasar";
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
</script>
