<template>
  <div
    class="row no-wrap q-gutter-md q-pt-lg q-px-sm folders scroll-x"
    style="height: 131.6px"
  >
    <!-- loading folders - skeleton -->
    <q-skeleton v-if="isLoading.fetchingFolders" class="bg-grey-2 q-pa-sm">
      <div class="row justify-center q-pb-sm">
        <q-img
          src="/assets/icons/folder.png"
          fit="contain"
          style="width: 64px; opacity: 0.5"
        />
      </div>

      <div style="height: 21px; opacity: 0.5" class="text-center text-semibold">
        {{ $t("myPresentations.newFolder.title") }}
      </div>
    </q-skeleton>

    <!-- folders -->
    <template v-else-if="folders?.length">
      <div
        v-for="folder in folders"
        :key="folder.id"
        class="folder"
        :class="selectedFolder?.id === folder.id ? 'folder--active' : ''"
        @click="selectedFolder = folder"
      >
        <div class="row no-wrap justify-center relative-position">
          <!-- folder icon -->
          <q-img
            :src="`/assets/icons/${getFolderIconName(folder.id)}.png`"
            fit="contain"
            class="folder__icon"
          />

          <!-- folder privacy -->
          <q-icon
            :name="folder.is_private ? 'r_visibility_off' : 'r_visibility'"
            color="grey-5"
            class="absolute-center"
            style="margin-top: 2px"
          />

          <q-menu
            context-menu
            anchor="top right"
            self="top start"
            transition-show="jump-down"
            transition-hide="jump-up"
            :offset="[0, 8]"
            class="q-pa-sm"
          >
            <!-- folder private -->
            <q-item
              class="items-center text-primary"
              clickable
              dense
              @click="
                folder.is_private = !folder.is_private;
                presentationsStore.updateFolder(folder);
              "
            >
              <q-icon
                :name="folder.is_private ? 'r_visibility_off' : 'r_visibility'"
                class="q-mr-sm"
                size="xs"
              />
              <div>
                {{
                  $t(
                    `myPresentations.presentationRow.actions.folder.privacy.${
                      folder.is_private ? "private" : "public"
                    }`
                  )
                }}
              </div>
            </q-item>

            <!-- delete folder -->
            <q-item
              class="items-center text-red"
              target="_blank"
              clickable
              dense
              @click="showFolderDeletionConfirmationDialog = true"
            >
              <q-icon name="r_delete" class="q-mr-sm" size="xs" />
              <div>
                {{
                  $t(
                    "myPresentations.presentationRow.actions.folder.delete.title"
                  )
                }}
              </div>
            </q-item>

            <q-dialog v-model="showFolderDeletionConfirmationDialog">
              <ConfirmationDialog
                icon="r_delete"
                icon-color="red"
                :title="
                  $t(
                    'myPresentations.presentationRow.actions.folder.delete.confirmation.title'
                  )
                "
                :message="
                  $t(
                    'myPresentations.presentationRow.actions.folder.delete.confirmation.message'
                  )
                "
                confirm-btn-color="red"
                @cancel="showFolderDeletionConfirmationDialog = false"
                @confirm="
                  presentationsStore.deleteFolder(folder);
                  showFolderDeletionConfirmationDialog = false;
                "
              />
            </q-dialog>
          </q-menu>
        </div>

        <!-- folder name -->
        <div
          class="text-semibold text-center q-mt-sm text-no-wrap ellipsis q-px-xs"
        >
          {{ folder.name }}

          <q-popup-edit
            v-model="folder.name"
            v-slot="scope"
            @update:model-value="presentationsStore.updateFolder(folder)"
          >
            <q-input
              v-model="scope.value"
              dense
              autofocus
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </div>
      </div>
    </template>

    <!-- no folders -->
    <div
      v-else
      class="folder"
      style="opacity: 0.5"
      @click="showNewFolderDialog = true"
    >
      <!-- folder icon -->
      <div class="row no-wrap justify-center relative-position">
        <q-img
          src="/assets/icons/folder.png"
          fit="contain"
          class="folder__icon"
        />

        <!-- folder privacy -->
        <q-icon
          name="r_visibility_off"
          color="grey-5"
          class="absolute-center"
          style="margin-top: 2px"
        />
      </div>

      <!-- folder name -->
      <div
        class="text-semibold text-center q-mt-sm text-no-wrap ellipsis q-px-xs"
      >
        {{ $t("myPresentations.newFolder.title") }}
      </div>
    </div>

    <!-- new folder form -->
    <q-dialog v-model="showNewFolderDialog">
      <PresentationBrowserNewFolder
        :presentations="
          presentations.filter((presentation) => !presentation.folder_id)
        "
        :selected-presentations="selectedPresentations"
        :is-loading="isLoading.creatingFolder"
        @cancel="showNewFolderDialog = false"
        @submit="
          presentationsStore.createNewFolder($event);
          showNewFolderDialog = false;
        "
      />
    </q-dialog>
  </div>
</template>

<script setup>
import ConfirmationDialog from "components/dialogs/ConfirmationDialog.vue";
import PresentationBrowserNewFolder from "components/presentationsBrowser/folders/PresentationsBrowserNewFolder.vue";
import { ref } from "vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { getFolderIconName } from "src/helpers/generationUtils";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const {
  folders,
  selectedFolder,
  presentations,
  selectedPresentations,
  isLoading,
} = storeToRefs(presentationsStore);

/*
 * dialogs
 */
const showFolderDeletionConfirmationDialog = ref(false);
const showNewFolderDialog = ref(false);
</script>

<style scoped lang="scss">
/*
 * folders
 */
.folders {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.folders::-webkit-scrollbar {
  display: none;
}

.folder {
  max-width: 120px;
  cursor: pointer;
  transition: 0.2s;
  border-radius: 8px;
  padding: 8px;
  outline: 3px solid transparent;
  margin-bottom: 4px;

  div {
    transition: 0.2s;
  }

  &:active {
    transform: scale(0.975);
  }

  &.folder--active {
    div:last-child {
      background: $primary;
      color: white;
      border-radius: 6px;
    }
  }

  .folder__icon {
    width: 64px;
  }
}

::v-deep(.q-skeleton):before {
  content: none;
}
</style>
