<template>
  <q-page>
    <div class="container">
      <div
        class="no-wrap justify-between q-mb-lg"
        :class="$q.screen.lt.md ? 'column q-gutter-md' : 'row items-center'"
      >
        <!-- welcome -->
        <div>
          <div class="text-h5 text-semibold" style="font-size: 1.75rem">
            {{ $t("presentationsBrowser.welcome.title", { name: user.name }) }}
          </div>

          <div class="text-grey-9 q-mt-xs">
            {{ $t("presentationsBrowser.welcome.description") }}
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
                {{ $t("presentationsBrowser.upgrade.title") }}
              </div>
              <div class="text-caption text-grey">
                {{ $t("presentationsBrowser.upgrade.description") }}
              </div>
            </div>

            <q-space />

            <div>
              <q-btn
                unelevated
                color="primary"
                no-caps
                :label="$t('presentationsBrowser.upgrade.upgrade')"
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
              :class="$q.screen.lt.md ? 'q-ml-sm' : 'q-ml-3xs q-mr-xs text-h7'"
            >
              {{ $t("presentationsBrowser.newPresentation.title") }}
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
            <div v-if="!$q.screen.lt.md" class="text-h7 q-ml-md">
              {{ $t("presentationsBrowser.newFolder.title") }}
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
          :placeholder="$t('presentationsBrowser.search.placeholder')"
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
      <PresentationsBrowserFolders />

      <!-- presentations table -->
      <PresentationsBrowserPresentations
        @new-presentation="showNewPresentationDialog = true"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useAuthStore } from "stores/auth";
import { storeToRefs } from "pinia";
import { onBeforeMount, onMounted, onUnmounted, ref } from "vue";
import PresentationsBrowserFolders from "components/presentationsBrowser/folders/PresentationsBrowserFolders.vue";
import PresentationsBrowserPresentations from "components/presentationsBrowser/presentations/PresentationsBrowserPresentations.vue";
import PresentationBrowserNewFolder from "components/presentationsBrowser/folders/PresentationsBrowserNewFolder.vue";
import { usePresentationsStore } from "stores/presentations";
import PresentationBrowserNewPresentation from "components/presentationsBrowser/presentations/PresentationsBrowserNewPresentation.vue";
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

useMeta({
  title: t("meta.dashboard.title"),
  titleTemplate: (title) => `${title} - ${t("meta.app")}`,

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
        return `${ogTitle} - ${t("meta.app")}`;
      },
    },
  },
});
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
