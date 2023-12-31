<template>
  <!--  <q-slide-transition>-->
  <div v-if="!selectedFolder && folders.length">
    <!-- title -->
    <div class="text-h6 text-semibold q-mb-md q-mt-lg">
      {{ $t("presentationsBrowser.folderItem.title") }}
    </div>

    <div class="row q-gutter-md folders q-pb-sm">
      <!-- folders -->
      <q-card
        v-for="folder in folders"
        :key="folder.id"
        class="folder row no-wrap shadow-2xs-soft shadow-2xs-soft--hoverable"
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
          <div
            class="text-semibold scroll--hidden"
            :class="{ ellipsis: editingFolderId !== folder.id }"
            :title="folder.name"
            :style="`${
              editingFolderId === folder.id
                ? 'padding: 0 4px; margin-left: -4px; margin-right: 4px; white-space: nowrap; overflow-x: scroll; min-width: 140px; max-width: 140px;'
                : 'min-width: 165px; max-width: 165px;'
            }`"
            :id="`folder-${folder.id}-name`"
          >
            {{ folder.name }}
          </div>

          <div
            v-if="editingFolderId === folder.id"
            class="text-grey text-caption text-center"
            style="width: calc(25px + 8px); margin-right: -8px"
          >
            {{ charactersLeft }}
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
              class="q-py-sm"
            >
              <!-- rename -->
              <q-item
                class="items-center justify-start"
                clickable
                dense
                v-close-popup
                @click="handleFolderNameClick($event, folder)"
              >
                <q-icon name="r_edit" size="16px" class="q-mr-sm" />
                <div>
                  {{
                    $t("presentationsBrowser.presentationItem.actions.rename")
                  }}
                </div>
              </q-item>

              <q-separator class="q-my-sm" />

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
import { computed, ref } from "vue";
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

const charactersLeft = ref();

const handleFolderNameClick = (event, folder) => {
  editingFolderId.value = folder.id;

  const element = document.getElementById(`folder-${folder.id}-name`);
  element.contentEditable = true;
  charactersLeft.value = 100 - element.innerHTML.length;

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

    if (element.innerHTML.length > 100) {
      element.classList.add("text-negative");
    } else {
      element.classList.remove("text-negative");
    }

    charactersLeft.value = 100 - element.innerHTML.length;
  });
};

const handleFolderNameUpdate = (folder) => {
  const element = document.getElementById(`folder-${folder.id}-name`);
  element.scrollLeft = 0;

  function truncateString(inputString, maxLength) {
    if (inputString.length <= maxLength) {
      return inputString;
    }

    const words = inputString.split(" ");

    let truncatedWords = [];
    let currentLength = 0;

    for (const word of words) {
      if (currentLength + word.length + truncatedWords.length > maxLength) {
        break;
      }

      truncatedWords.push(word);
      currentLength += word.length;
    }

    return truncatedWords.join(" ");
  }

  // folder.name = truncateString(element.innerText, 100);
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
  width: 300px;
  min-width: 300px;
  max-width: 300px;

  .q-card__section {
    border-radius: 0;
    padding: 12px;
  }

  &:hover {
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
