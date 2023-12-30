<template>
  <q-page>
    <div class="container">
      <div class="row no-wrap items-center justify-between q-mb-lg">
        <!-- welcome -->
        <div>
          <div class="text-h5 text-semibold" style="font-size: 1.75rem">
            {{ $t("presentationsBrowser.welcome.title", { name: user.name }) }}
          </div>

          <div class="text-grey q-mt-xs">
            {{ $t("presentationsBrowser.welcome.description") }}
          </div>
        </div>

        <!-- upgrade -->
        <q-card flat class="bg-white medium-rounded-borders shadow-2xs-soft">
          <q-card-section class="row no-wrap items-center q-gutter-md">
            <div class="round-borders bg-accent text-primary q-pa-md">
              <q-icon name="r_bolt" size="24px" />
            </div>

            <div>
              <div class="text-semibold">
                {{ $t("presentationsBrowser.upgrade.title") }}
              </div>
              <div class="text-caption text-grey">
                {{ $t("presentationsBrowser.upgrade.description") }}
              </div>
            </div>

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
      <div class="row no-wrap q-gutter-md">
        <!-- new presentation -->
        <q-btn
          unelevated
          color="primary"
          no-caps
          icon="r_add"
          class="q-py-3xs"
          :label="$t('presentationsBrowser.newPresentation.title')"
          @click="showNewPresentationDialog = true"
        />

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
          class="bg-white q-py-3xs"
          no-caps
          icon="r_create_new_folder"
          :label="$t('presentationsBrowser.newFolder.title')"
          @click="showNewFolderDialog = true"
        />

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

        <q-space />

        <!-- search -->
        <q-input
          v-model="search"
          outlined
          dense
          bg-color="white"
          style="width: 290px"
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
      <PresentationsBrowserPresentations />
    </div>
  </q-page>
</template>

<script setup>
import { useAuthStore } from "stores/auth";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import PresentationsBrowserFolders from "components/presentationsBrowser/folders/PresentationsBrowserFolders.vue";
import PresentationsBrowserPresentations from "components/presentationsBrowser/presentations/PresentationsBrowserPresentations.vue";
import PresentationBrowserNewFolder from "components/presentationsBrowser/folders/PresentationsBrowserNewFolder.vue";
import { usePresentationsStore } from "stores/presentations";
import PresentationBrowserNewPresentation from "components/presentationsBrowser/presentations/PresentationsBrowserNewPresentation.vue";
import { clearRoutePathFromProps } from "src/helpers/routeUtils";
import { ROUTE_PATHS } from "src/constants/routes";
import { useRouter } from "vue-router";

/*
 * variables
 */
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
</script>

<style scoped lang="scss">
.container {
  max-width: 1200px;
  padding: 48px 16px;
}
</style>
