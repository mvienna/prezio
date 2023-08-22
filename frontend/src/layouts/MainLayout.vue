<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-grey-2 q-pa-sm">
      <q-toolbar style="max-width: 1000px; margin: 0 auto">
        <!-- search -->
        <q-input
          :placeholder="$t('mainLayout.header.search')"
          dense
          borderless
          class="full-width q-pr-md"
        >
          <template #prepend>
            <q-icon name="o_search" />
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
          icon="o_notifications"
          class="q-mr-md q-btn--bordered"
        />

        <!-- go premium -->
        <q-btn
          color="yellow-9"
          text-color="black"
          unelevated
          no-caps
          no-wrap
          icon="o_workspace_premium"
          :label="$t('mainLayout.header.goPro')"
          class="q-mr-md text-semibold q-px-lg"
        />

        <!-- user menu -->
        <q-btn
          unelevated
          no-caps
          no-wrap
          text-color="black"
          class="text-semibold q-pa-xs q-pl-md"
        >
          <template #default>
            <div class="q-mr-md">
              {{ user.name }}
            </div>
            <UserAvatar
              :user="user"
              size="27px"
              color="primary"
              style="border-radius: 50%"
            />

            <q-menu
              anchor="bottom right"
              self="top right"
              transition-show="jump-down"
              transition-hide="jump-up"
              :offset="[0, 8]"
              class="q-pa-sm"
              fit
            >
              <div class="column q-gutter-sm">
                <q-item
                  v-for="item in userMenuLinks"
                  :key="item.name"
                  :to="item.link"
                  dense
                  class="items-center text-semibold justify-start rounded-borders q-px-lg q-py-sm"
                  :class="
                    item.name ===
                    userMenuLinks.find(
                      (link) => link.link === ROUTE_PATHS.AUTH.LOGOUT
                    ).name
                      ? 'text-red'
                      : 'text-primary'
                  "
                >
                  <q-icon
                    :name="item.icon"
                    class="q-mr-sm text-semibold"
                    size="20px"
                  />
                  <div
                    :class="
                      item.name ===
                      userMenuLinks.find(
                        (link) => link.link === ROUTE_PATHS.AUTH.LOGOUT
                      ).name
                        ? 'text-red'
                        : 'text-black'
                    "
                  >
                    {{ item.label }}
                  </div>
                </q-item>
              </div>

              <!--              <div class="text-italic text-grey-5 text-right q-pr-sm q-py-sm">-->
              <!--                v{{ VERSION }}-->
              <!--              </div>-->
            </q-menu>
          </template>
        </q-btn>
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
        <q-img src="/public/logo_white.png" />
      </div>

      <!-- links -->
      <div class="column q-gutter-sm q-pa-sm">
        <q-item
          v-for="item in drawerLinks"
          :key="item.name"
          :to="item.link"
          dense
          class="items-center justify-start text-grey-2 q-py-sm"
          style="border-radius: 8px"
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
import { storeToRefs } from "pinia";
import { useAuthStore } from "stores/auth";
import UserAvatar from "components/user/UserAvatar.vue";
import { useI18n } from "vue-i18n";
import { ROUTE_PATHS } from "src/constants/routes";
import { useRouter } from "vue-router";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const router = useRouter();

/*
 * left drawer
 */
const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

/*
 * user
 */
const { user } = storeToRefs(useAuthStore());

const userMenuLinks = ref([
  {
    name: "profile",
    label: t("mainLayout.header.userMenuLinks.profile"),
    icon: "o_account_circle",
    link: ROUTE_PATHS.USER.PROFILE,
  },
  {
    name: "my_plan",
    label: t("mainLayout.header.userMenuLinks.myPlan"),
    icon: "track_changes",
    link: ROUTE_PATHS.USER.MY_PLAN,
  },
  {
    name: "payments",
    label: t("mainLayout.header.userMenuLinks.payments"),
    icon: "o_wallet",
    link: ROUTE_PATHS.USER.PAYMENTS,
  },
  {
    name: "logout",
    label: t("mainLayout.header.userMenuLinks.logout"),
    icon: "logout",
    link: ROUTE_PATHS.AUTH.LOGOUT,
  },
]);

/*
 * drawer links
 */
const drawerLinks = [
  {
    name: "my_presentations",
    label: t("mainLayout.drawer.links.myPresentations"),
    icon: "home",
    link: ROUTE_PATHS.PRESENTATIONS.INDEX,
  },
  {
    name: "templates",
    label: t("mainLayout.drawer.links.templates"),
    icon: "grid_view",
    link: ROUTE_PATHS.PRESENTATIONS.TEMPLATES,
  },
  {
    name: "shared_with_me",
    label: t("mainLayout.drawer.links.sharedWithMe"),
    icon: "share",
    link: ROUTE_PATHS.PRESENTATIONS.SHARED_WITH_ME,
  },
  {
    name: "subscription_plans",
    label: t("mainLayout.drawer.links.subscriptionPlans"),
    icon: "bolt",
    link: ROUTE_PATHS.SUBSCRIPTION_PLANS,
  },
];

/*
 * assembly version
 */
const VERSION = process.env.VERSION?.substring(0, 7)?.replaceAll('"', "");
</script>

<style scoped lang="scss">
.drawer__logo {
  width: 112px;
}
</style>
