<template>
  <q-layout view="lHh Lpr lFf">
    <!-- header -->
    <q-header class="bg-white q-pa-sm" elevated>
      <q-toolbar>
        <!-- back -->
        <q-btn
          icon="r_arrow_back"
          unelevated
          round
          :to="ROUTE_PATHS.DASHBOARD"
          text-color="grey-5"
          size="12px"
          class="q-btn--bordered"
        />

        <q-space />

        <!-- notifications -->
        <q-btn
          v-if="false"
          text-color="grey-5"
          unelevated
          no-caps
          no-wrap
          round
          size="12px"
          icon="r_notifications"
          class="q-mr-md q-btn--bordered"
        />

        <!-- go premium -->
        <q-btn
          v-if="false"
          color="black"
          unelevated
          no-caps
          no-wrap
          icon-right="r_diamond"
          :label="$t('mainLayout.header.goPro')"
          class="q-mr-md text-semibold q-px-lg"
        />

        <!-- user -->
        <UserMenu />
      </q-toolbar>
    </q-header>

    <!-- drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="q-px-sm"
      :width="260"
    >
      <q-list class="column no-wrap full-height">
        <!-- logo -->
        <div class="drawer__logo q-ma-lg">
          <router-link :to="ROUTE_PATHS.INDEX">
            <q-img src="/logo_with_title_black.png" />
          </router-link>
        </div>

        <div class="column no-wrap q-pa-sm" style="height: 100%">
          <!-- user links -->
          <q-item
            v-for="item in links"
            :key="item.name"
            :to="item.link"
            :disable="item.disable"
            class="items-center justify-start q-py-md"
          >
            <q-icon
              :name="item.icon"
              class="q-mr-sm text-semibold"
              :class="
                item.link !== router.currentRoute.value.path
                  ? 'text-primary'
                  : ''
              "
              size="24px"
            />
            <div
              :class="
                item.link === router.currentRoute.value.path
                  ? 'text-semibold'
                  : ''
              "
            >
              {{ item.label }}
            </div>
          </q-item>

          <q-space />

          <!-- logout -->
          <q-item
            :to="ROUTE_PATHS.AUTH.LOGOUT"
            class="items-center justify-start q-py-md q-mb-sm text-red"
          >
            <q-icon name="r_logout" class="q-mr-sm" size="24px" />
            <div>
              {{ $t("userLayout.drawer.links.logout") }}
            </div>
          </q-item>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "stores/auth";
import { useI18n } from "vue-i18n";
import { ROUTE_PATHS } from "src/constants/routes";
import { useRouter } from "vue-router";
import UserMenu from "components/user/UserMenu.vue";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const router = useRouter();

const { user } = storeToRefs(useAuthStore());

/*
 * left drawer
 */
const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

/*
 * links
 */
const links = ref([
  {
    name: "settings",
    label: t("userLayout.drawer.links.settings"),
    icon: "r_settings",
    link: ROUTE_PATHS.USER.PROFILE,
  },
  {
    name: "my_plan",
    label: t("userLayout.drawer.links.myPlan"),
    icon: "r_track_changes",
    link: "/",
    disable: true,
  },
  {
    name: "payments",
    label: t("userLayout.drawer.links.payments"),
    icon: "r_wallet",
    link: "/",
    disable: true,
  },
]);
</script>

<style scoped lang="scss">
.drawer__logo {
  width: 112px;
}
</style>
