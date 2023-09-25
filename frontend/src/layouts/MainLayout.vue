<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white q-pa-sm">
      <q-toolbar>
        <!-- search -->
        <q-input
          v-model="search"
          :placeholder="$t('mainLayout.header.search')"
          dense
          borderless
          class="full-width q-pr-md"
        >
          <template #prepend>
            <q-icon name="r_search" />
          </template>
        </q-input>

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

        <!-- user menu -->
        <UserMenu />
      </q-toolbar>
    </q-header>

    <!-- drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="bg-black"
      :width="250"
    >
      <!-- logo -->
      <div class="drawer__logo q-ma-lg">
        <router-link :to="ROUTE_PATHS.INDEX">
          <q-img src="/logo_white.png" />
        </router-link>
      </div>

      <!-- links -->
      <div class="column q-pa-sm">
        <q-item
          v-for="item in drawerLinks"
          :key="item.name"
          :to="item.link"
          dense
          class="items-center justify-start text-grey-2 q-py-md"
        >
          <q-icon
            :name="item.icon"
            class="q-mr-sm text-semibold"
            :class="
              item.link === router.currentRoute.value.path ? 'text-primary' : ''
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
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { ROUTE_PATHS } from "src/constants/routes";
import { useRouter } from "vue-router";
import UserMenu from "components/user/UserMenu.vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const router = useRouter();

/*
 * presentation store
 */
const presentationsStore = usePresentationsStore();
const { search } = storeToRefs(presentationsStore);

/*
 * left drawer
 */
const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

/*
 * drawer links
 */
const drawerLinks = [
  {
    name: "my_presentations",
    label: t("mainLayout.drawer.links.myPresentations"),
    icon: "r_home",
    link: ROUTE_PATHS.PRESENTATIONS.INDEX,
  },
  {
    name: "templates",
    label: t("mainLayout.drawer.links.templates"),
    icon: "r_grid_view",
    link: ROUTE_PATHS.PRESENTATIONS.TEMPLATES,
  },
  {
    name: "shared_with_me",
    label: t("mainLayout.drawer.links.sharedWithMe"),
    icon: "r_share",
    link: ROUTE_PATHS.PRESENTATIONS.SHARED_WITH_ME,
  },
  {
    name: "subscription_plans",
    label: t("mainLayout.drawer.links.subscriptionPlans"),
    icon: "r_bolt",
    link: ROUTE_PATHS.SUBSCRIPTION_PLANS,
  },
];
</script>

<style scoped lang="scss">
.drawer__logo {
  width: 112px;
}
</style>
