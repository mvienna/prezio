<template>
  <!--  <q-slide-transition>-->
  <div v-if="!selectedFolder && folders.length">
    <!-- title -->
    <div class="text-h6 text-semibold q-mb-md q-mt-lg">
      {{ $t("presentationsBrowser.folderItem.title") }}
    </div>

    <div class="row no-wrap q-gutter-md folders scroll-x">
      <!-- folders -->
      <q-card
        v-for="folder in folders"
        :key="folder.id"
        v-ripple
        class="folder q-hoverable row no-wrap"
        flat
        bordered
      >
        <q-card-section
          class="row no-wrap items-center"
          @click="handleFolderSelect($event, folder)"
        >
          <!-- folder icon -->
          <q-img
            :src="`/assets/icons/folders/${getFolderIconName($q)}.png`"
            fit="contain"
            class="folder__icon q-mr-sm"
          />

          <!-- folder name -->
          <div class="relative-position">
            <!--            <div class="text-semibold text-center text-no-wrap ellipsis">-->
            <!--              {{ folder.name }}-->

            <!--              <q-popup-edit-->
            <!--                v-model="folder.name"-->
            <!--                v-slot="scope"-->
            <!--                @update:model-value="presentationsStore.updateFolder(folder)"-->
            <!--              >-->
            <!--                <q-input-->
            <!--                  v-model="scope.value"-->
            <!--                  dense-->
            <!--                  autofocus-->
            <!--                  @keyup.enter="scope.set"-->
            <!--                />-->
            <!--              </q-popup-edit>-->
            <!--            </div>-->

            <div
              class="text-semibold"
              :class="{ ellipsis: editingFolderId !== folder.id }"
              :title="folder.name"
              :style="`${
                editingFolderId === folder.id
                  ? 'margin-left: -4px; padding: 0 4px; white-space: nowrap;'
                  : 'max-width: 150px;'
              }`"
              :id="`folder-${folder.id}-name`"
            >
              {{ folder.name }}
            </div>
          </div>
        </q-card-section>

        <q-card-section style="padding-left: 0">
          <q-btn flat icon="r_more_vert" color="grey" round size="12px">
            <q-menu
              anchor="bottom right"
              self="top end"
              transition-show="jump-down"
              transition-hide="jump-up"
              :offset="[0, 8]"
              class="q-pr-sm q-pb-sm column no-wrap q-gutter-sm"
            >
              <!-- rename -->
              <q-item
                class="items-center justify-start q-px-md q-py-sm"
                clickable
                dense
                v-close-popup
                @click="handleFolderNameClick($event, folder)"
              >
                <q-icon
                  name="r_edit"
                  color="primary"
                  size="16px"
                  class="q-mr-md"
                />

                <div>
                  {{
                    $t("presentationsBrowser.presentationItem.actions.rename")
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
                      "presentationsBrowser.presentationItem.actions.folder.delete.title"
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
                      'presentationsBrowser.presentationItem.actions.folder.delete.confirmation.title'
                    )
                  "
                  :message="
                    $t(
                      'presentationsBrowser.presentationItem.actions.folder.delete.confirmation.message'
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
          </q-btn>
        </q-card-section>
      </q-card>
    </div>
  </div>
  <!--  </q-slide-transition>-->
</template>

<script setup>
import ConfirmationDialog from "components/dialogs/ConfirmationDialog.vue";
import { ref } from "vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { getFolderIconName } from "src/helpers/generationUtils";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { folders, selectedFolder, presentations, isLoading } =
  storeToRefs(presentationsStore);

/*
 * dialogs
 */
const showFolderDeletionConfirmationDialog = ref(false);

const handleFolderSelect = (event, folder) => {
  if (editingFolderId.value === folder.id) return;
  selectedFolder.value = folder;
  presentationsStore.fetchPresentations({ page: 1 }, true);
};

/*
 * rename folder
 */
const editingFolderId = ref();

const handleFolderNameClick = (event, folder) => {
  editingFolderId.value = folder.id;

  const element = document.getElementById(`folder-${folder.id}-name`);
  element.contentEditable = true;

  setTimeout(() => {
    element.focus();

    // collapse the range to the end.
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);

    // clear any existing selections.
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }, 100);

  element.addEventListener("blur", () => {
    handleFolderNameUpdate(folder);
  });

  element.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" && !event.shiftKey) || event.key === "Escape") {
      element.blur();
    }
  });
};

const handleFolderNameUpdate = (folder) => {
  const element = document.getElementById(`folder-${folder.id}-name`);

  folder.name = element.innerText;
  presentationsStore.updateFolder(folder);

  element.contentEditable = false;
  editingFolderId.value = null;
};
</script>

<style scoped lang="scss">
/*
 * folders
 */
.folder {
  cursor: pointer;
  transition: 0.2s;
  border-radius: 8px;
  border-color: $grey-2;
  overflow: hidden;

  .q-card__section {
    border-radius: 0;
    padding: 12px;
  }

  &:hover {
    border-color: $accent;
  }

  .folder__icon {
    width: 50px;
  }

  .folder__name {
    line-height: 50px;
  }
}

::v-deep(.q-skeleton):before {
  content: none;
}
</style>
