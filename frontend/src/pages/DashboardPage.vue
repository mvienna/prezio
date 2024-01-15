<template>
  <q-page>
    <div class="container">
      <div
        class="no-wrap justify-between q-mb-lg"
        :class="$q.screen.lt.md ? 'column q-gutter-md' : 'row items-center'"
      >
        <!-- welcome -->
        <div>
          <div class="text-h5 text-semibold text-28">
            {{ $t("dashboard.welcome.title", { name: user.name }) }}
          </div>

          <div class="text-grey-9 q-mt-xs">
            {{ $t("dashboard.welcome.description") }}
          </div>
        </div>

        <!-- upgrade -->
        <q-card flat class="bg-white shadow-xs-hard rounded-3xs">
          <q-card-section class="row no-wrap items-center">
            <div
              class="round-borders bg-background text-primary row items-center justify-center"
              style="min-width: 46px; width: 46px; height: 46px"
            >
              <q-icon name="r_bolt" size="24px" />
            </div>

            <div class="q-mx-md q-px-xs">
              <div class="text-semibold">
                {{ $t("dashboard.upgrade.title") }}
              </div>
              <div class="text-caption text-grey">
                {{ $t("dashboard.upgrade.description") }}
              </div>
            </div>

            <q-space />

            <div>
              <q-btn
                unelevated
                color="primary"
                no-caps
                :label="$t('dashboard.upgrade.upgrade')"
                :to="ROUTE_PATHS.PROFILE.SUBSCRIPTION"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- actions -->
      <div
        class="no-wrap"
        :class="$q.screen.lt.md ? 'column' : 'row items-center'"
      >
        <div class="row no-wrap">
          <!-- new presentation -->
          <q-btn
            unelevated
            color="primary"
            no-caps
            class="q-mr-md"
            :class="$q.screen.lt.md ? 'q-py-sm' : 'q-py-3xs'"
            @click="showNewPresentationDialog = true"
          >
            <q-icon name="r_add" />
            <div
              :class="$q.screen.lt.md ? 'q-ml-sm' : 'q-ml-3xs q-mr-xs text-16'"
            >
              {{ $t("dashboard.newPresentation.title") }}
            </div>
          </q-btn>

          <!-- new presentation form -->
          <q-dialog v-model="showNewPresentationDialog">
            <PresentationBrowserNewPresentation
              :folders="folders"
              :selected-folder="selectedFolder"
              :is-loading="isLoading.creatingPresentation"
              @cancel="showNewPresentationDialog = false"
              @submit="handleCreatingNewPresentation($event)"
            />
          </q-dialog>

          <!-- new folder -->
          <q-btn
            v-if="!selectedFolder"
            outline
            no-wrap
            class="bg-white q-mr-md"
            :class="$q.screen.lt.md ? 'q-py-sm' : 'q-py-3xs'"
            :round="$q.screen.lt.md"
            no-caps
            @click="showNewFolderDialog = true"
          >
            <q-icon name="icon-folder_add" />
            <div v-if="!$q.screen.lt.md" class="text-16 q-ml-md">
              {{ $t("dashboard.newFolder.title") }}
            </div>
          </q-btn>

          <!-- new folder form -->
          <q-dialog v-model="showNewFolderDialog">
            <PresentationBrowserNewFolder
              :presentations="
                presentations.filter((presentation) => !presentation.folder_id)
              "
              :is-loading="isLoading.creatingFolder"
              @cancel="showNewFolderDialog = false"
              @submit="
                presentationsStore.createNewFolder($event);
                showNewFolderDialog = false;
              "
            />
          </q-dialog>
        </div>

        <q-space />

        <!-- search -->
        <q-input
          v-model="search"
          outlined
          dense
          bg-color="white"
          style="width: 290px"
          :class="$q.screen.lt.md ? 'full-width q-mt-lg' : ''"
          :placeholder="$t('dashboard.search.placeholder')"
          debounce="500"
          clearable
          clear-icon="r_backspace"
          @update:model-value="
            presentationsStore.fetchPresentations(undefined, true)
          "
        >
          <template #prepend>
            <q-icon name="r_search" />
          </template>
        </q-input>
      </div>

      <!-- folders -->
      <DashboardFolders />

      <!-- presentations table -->
      <DashboardPresentations
        @new-presentation="showNewPresentationDialog = true"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useAuthStore } from "stores/auth";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import DashboardFolders from "components/dashboard/folders/DashboardFolders.vue";
import DashboardPresentations from "components/dashboard/presentations/DashboardPresentations.vue";
import PresentationBrowserNewFolder from "components/dashboard/folders/DashboardNewFolder.vue";
import { usePresentationsStore } from "stores/presentations";
import PresentationBrowserNewPresentation from "components/dashboard/presentations/DashboardNewPresentation.vue";
import { clearRoutePathFromProps } from "src/helpers/routeUtils";
import { ROUTE_PATHS } from "src/constants/routes";
import { useRouter } from "vue-router";
import { useMeta } from "quasar";
import { useI18n } from "vue-i18n";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const router = useRouter();

/*
 * stores
 */
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const presentationsStore = usePresentationsStore();
const { presentations, isLoading, folders, selectedFolder, search } =
  storeToRefs(presentationsStore);

onBeforeMount(() => {
  presentationsStore.fetchFolders();
});

/*
 * new presentation
 */
const showNewPresentationDialog = ref(false);

const handleCreatingNewPresentation = (data) => {
  presentationsStore.createNewPresentation(data).then((response) => {
    router.push(
      clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_STUDIO) +
        response.data.id
    );
  });
};

/*
 * folders
 */
const showNewFolderDialog = ref(false);

const metaOptions = {
  title: t("meta.dashboard.title", { split: "|" }),
  titleTemplate: (title) => title,

  // meta tags
  meta: {
    description: {
      name: "description",
      content: t("meta.dashboard.description"),
    },
    keywords: {
      name: "keywords",
      content: t("meta.dashboard.keywords"),
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
        return t("meta.dashboard.ogTitle");
      },
    },
    // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
    ogDescription: {
      property: "og:description",
      // optional; similar to titleTemplate, but allows templating with other meta properties
      template(ogDescription) {
        return t("meta.dashboard.ogDescription");
      },
    },
  },
};

if (window.location.host === process.env.STAGING_HOST) {
  metaOptions.meta.robots = {
    name: "robots",
    content: "noindex, nofollow",
  };
}

useMeta(metaOptions);
</script>

<style scoped lang="scss">
.container {
  max-width: 1200px;
  padding: 48px 16px;
}
</style>

<style lang="scss">
.chaport-container {
  display: block;
}
</style>
