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

        <!-- room -->
        <form
          @submit.prevent="handleRoomSearch()"
          class="full-width"
          style="max-width: 280px"
        >
          <q-input
            v-model="roomId"
            dense
            standout="bg-primary text-white"
            class="q-pr-md"
            :placeholder="$t('mainLayout.header.room.enterCode')"
            :prefix="roomLinkPrefix"
            :error="!!roomSearchError"
            hide-bottom-space
          >
            <template #append>
              <q-icon
                name="r_contactless"
                class="cursor-pointer"
                @click="handleRoomSearch()"
              >
                <q-tooltip>
                  {{ $t("mainLayout.header.room.join") }}
                </q-tooltip>
              </q-icon>
            </template>
          </q-input>
        </form>

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
      bordered
      :width="260"
      class="q-px-sm"
    >
      <!-- logo -->
      <div class="drawer__logo q-ma-lg">
        <router-link :to="ROUTE_PATHS.INDEX">
          <q-img src="/logo_black.png" />
        </router-link>
      </div>

      <!-- links -->
      <div class="column q-pa-sm">
        <q-item
          v-for="item in drawerLinks"
          :key="item.name"
          :to="item.link"
          dense
          :disable="item.disable"
          class="items-center justify-start q-py-md"
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
import { useI18n } from "vue-i18n";
import { ROUTE_PATHS } from "src/constants/routes";
import { useRouter } from "vue-router";
import UserMenu from "components/user/UserMenu.vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { api } from "boot/axios";
import { clearRoutePathFromProps } from "src/helpers/routeUtils";
import { useQuasar } from "quasar";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const $q = useQuasar();

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
    link: ROUTE_PATHS.PRESENTATIONS_BROWSER,
  },
  {
    name: "templates",
    label: t("mainLayout.drawer.links.templates"),
    icon: "r_grid_view",
    disable: true,
    link: "",
  },
  {
    name: "shared_with_me",
    label: t("mainLayout.drawer.links.sharedWithMe"),
    icon: "r_share",
    disable: true,
    link: "",
  },
  {
    name: "subscription_plans",
    label: t("mainLayout.drawer.links.subscriptionPlans"),
    icon: "r_bolt",
    disable: true,
    link: "",
  },
];

const roomId = ref();
const roomSearchError = ref();
const roomLinkPrefix = `${window.location.hostname}/room/`;

const handleRoomSearch = () => {
  api
    .get(`/room/${roomId.value}`)
    .then((response) => {
      router.push(
        clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_ROOM) +
          response.data.room.token
      );
    })
    .catch((error) => {
      roomSearchError.value = error.response.data.message;

      $q.notify({
        message: error.response.data.message,
        color: "red",
        icon: "r_crisis_alert",
      });
    });
};
</script>

<style scoped lang="scss">
.drawer__logo {
  width: 112px;
}

::v-deep(.q-field__control) {
  box-shadow: none !important;
  border-radius: 8px;
}
</style>
