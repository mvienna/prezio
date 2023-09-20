<template>
  <q-layout view="hHh Lpr lff">
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
          color="yellow-9"
          text-color="black"
          unelevated
          no-caps
          no-wrap
          icon="r_workspace_premium"
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
      class="bg-white q-px-sm q-pt-md"
      :width="250"
    >
      <q-list class="full-height column q-gutter-sm">
        <!-- user links -->
        <q-item
          v-for="item in links"
          :key="item.name"
          :to="item.link"
          class="items-center justify-start q-px-lg q-py-sm"
        >
          <q-icon
            :name="item.icon"
            class="q-mr-sm"
            :class="
              item.link !== router.currentRoute.value.path ? 'text-grey-5' : ''
            "
            size="20px"
            style="transition: 0.2s"
          />
          <div
            :class="
              item.link === router.currentRoute.value.path
                ? 'text-black text-semibold'
                : 'text-dark'
            "
            style="transition: 0.2s"
          >
            {{ item.label }}
          </div>
        </q-item>

        <q-space />

        <!-- logout -->
        <q-item
          :to="ROUTE_PATHS.AUTH.LOGOUT"
          class="items-center justify-start q-px-lg q-py-sm text-red"
        >
          <q-icon name="r_logout" class="q-mr-sm" size="20px" />
          <div>
            {{ $t("userLayout.drawer.links.logout") }}
          </div>
        </q-item>
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
    link: ROUTE_PATHS.USER.MY_PLAN,
  },
  {
    name: "payments",
    label: t("userLayout.drawer.links.payments"),
    icon: "r_wallet",
    link: ROUTE_PATHS.USER.PAYMENTS,
  },
]);
</script>
