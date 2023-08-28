<template>
  <q-layout view="hHh lpR fFf">
    <!-- header -->
    <q-header class="bg-white q-pa-sm" elevated>
      <q-toolbar>
        <!-- logo -->
        <q-btn
          unelevated
          round
          :to="ROUTE_PATHS.DASHBOARD"
          text-color="grey-5"
          size="10px"
        >
          <template #default>
            <q-img src="/favicon.ico" />
          </template>
        </q-btn>

        <div class="row no-wrap items-center q-gutter-sm q-px-lg">
          <q-btn
            icon="undo"
            unelevated
            round
            text-color="grey-5"
            size="12px"
            class="q-btn--bordered"
          />

          <q-btn
            icon="redo"
            unelevated
            round
            text-color="grey-5"
            size="12px"
            class="q-btn--bordered"
          />
        </div>

        <div class="text-h6 text-semibold text-black">
          <span>Новая презентация</span>
          <q-icon name="o_visibility" color="grey-5" class="q-ml-sm" />
        </div>

        <q-space />

        <div class="row no-wrap items-center q-gutter-md">
          <!-- share -->
          <q-btn
            text-color="grey-5"
            unelevated
            no-caps
            no-wrap
            round
            size="12px"
            icon="o_share"
            class="q-btn--bordered"
          />

          <!-- settings -->
          <q-btn
            text-color="grey-5"
            unelevated
            no-caps
            no-wrap
            round
            size="12px"
            icon="o_settings"
            class="q-btn--bordered"
          />

          <!-- download -->
          <q-btn
            text-color="grey-5"
            unelevated
            no-caps
            no-wrap
            round
            size="12px"
            icon="downloading"
            class="q-btn--bordered"
          />

          <!-- preview -->
          <q-btn
            color="primary"
            outline
            no-caps
            no-wrap
            :label="$t('presentationLayout.header.preview')"
            class="text-semibold"
          />

          <!-- run -->
          <q-btn
            color="primary"
            unelevated
            no-caps
            no-wrap
            icon-right="play_arrow"
            :label="$t('presentationLayout.header.run')"
            class="text-semibold"
          />

          <!-- user -->
          <q-btn unelevated no-caps no-wrap class="q-pa-none">
            <template #default>
              <UserAvatar
                :user="user"
                size="36px"
                color="primary"
                style="border-radius: 8px"
              />
            </template>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- left drawer (slides) -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      side="left"
      class="bg-white q-px-sm q-pt-md"
    >
      <!-- header -->
      <div class="row no-wrap q-gutter-md justify-center">
        <!-- new slide -->
        <q-btn
          color="primary"
          icon-right="add"
          no-caps
          unelevated
          :label="$t('presentationLayout.leftDrawer.newSlide')"
        />

        <!-- import -->
        <q-btn
          outline
          color="primary"
          no-caps
          :label="$t('presentationLayout.leftDrawer.import')"
        />
      </div>

      <q-separator class="q-my-md" />

      <!-- slides -->
      <div class="q-px-sm">
        <!-- new slide -->
        <q-card
          flat
          v-ripple
          class="bg-blue-1 relative-position q-py-xl cursor-pointer q-hoverable"
        >
          <div class="q-py-lg">
            <q-icon
              name="add"
              color="primary"
              class="absolute-center"
              size="md"
            />
          </div>
        </q-card>
      </div>
    </q-drawer>

    <!-- right drawer (slides) -->
    <q-drawer
      v-model="rightDrawerOpen"
      show-if-above
      side="right"
      class="bg-white"
      :width="400"
    >
      <q-tabs
        v-model="rightDrawerTab"
        align="justify"
        indicator-color="primary"
        class="bg-white text-black text-white"
        inline-label
      >
        <q-tab
          v-for="tab in rightDrawerTabs"
          :key="tab.name"
          :name="tab.name"
          :icon="tab.icon"
          :label="tab.label"
          no-caps
        />
      </q-tabs>

      <q-tab-panels v-model="rightDrawerTab" animated>
        <!-- design -->
        <q-tab-panel name="design"> design </q-tab-panel>

        <!-- template -->
        <q-tab-panel name="template"> template </q-tab-panel>

        <!-- audio -->
        <q-tab-panel name="audio"> audio </q-tab-panel>
      </q-tab-panels>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ROUTE_PATHS } from "src/constants/routes";
import UserAvatar from "components/user/UserAvatar.vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "stores/auth";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

/*
 * variables
 */
const { user } = storeToRefs(useAuthStore());

const { t } = useI18n({ useScope: "global" });

/*
 * left drawer
 */
const leftDrawerOpen = ref(true);

/*
 * right drawer
 */
const rightDrawerOpen = ref(true);

// tabs
const rightDrawerTabs = [
  {
    name: "design",
    icon: "format_paint",
    label: t("presentationLayout.rightDrawer.tabs.design"),
  },
  {
    name: "template",
    icon: "grid_view",
    label: t("presentationLayout.rightDrawer.tabs.template"),
  },
  {
    name: "audio",
    icon: "graphic_eq",
    label: t("presentationLayout.rightDrawer.tabs.audio"),
  },
];
const rightDrawerTab = ref(rightDrawerTabs[0].name);
</script>

<style scoped lang="scss">
/*
 * tabs
 */
::v-deep(.q-tab) {
  color: $grey-5;
  height: 50px;

  .q-tab__indicator {
    background: $grey-5;
    opacity: 0.3;
    height: 1px;
  }
}

::v-deep(.q-tab--active) {
  color: $dark;

  .q-tab__indicator {
    background: currentColor;
    opacity: 1;
    height: 2px;
  }
}
</style>
