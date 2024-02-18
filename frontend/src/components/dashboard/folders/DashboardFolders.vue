<template>
  <!--  <q-slide-transition>-->
  <div v-if="!selectedFolder && folders.length">
    <!-- title -->
    <div class="text-h6 text-semibold q-mb-md q-mt-lg">
      {{ $t("dashboard.folderItem.title") }}
    </div>

    <div class="folders_grid q-pb-sm">
      <!-- folders -->
      <q-card
        v-for="folder in folders"
        :key="folder.id"
        class="folders_grid__item row no-wrap shadow-2xs-soft shadow-2xs-soft--hoverable"
        bordered
        style="max-width: 100%"
      >
        <q-card-section
          class="row no-wrap items-center"
          style="width: calc(100% - 36px - 16px)"
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
            class="text-semibold hide-scrollbar"
            :class="{ ellipsis: editingFolderId !== folder.id }"
            :title="folder.name"
            style="width: 100%"
            :style="`${
              editingFolderId === folder.id
                ? 'padding: 0 4px; margin-left: -4px; margin-right: 4px; white-space: nowrap; overflow-x: scroll; '
                : ''
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
                  {{ $t("dashboard.presentationItem.actions.rename") }}
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
                    $t("dashboard.presentationItem.actions.folder.delete.title")
                  }}
                </div>
              </q-item>

              <q-dialog v-model="showFolderDeletionConfirmationDialog">
                <ConfirmationDialog
                  icon="r_delete"
                  icon-color="red"
                  :title="
                    $t(
                      'dashboard.presentationItem.actions.folder.delete.confirmation.title',
                    )
                  "
                  :message="
                    $t(
                      'dashboard.presentationItem.actions.folder.delete.confirmation.message',
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

    element.scrollLeft = element.scrollWidth;
  }, 100);

  element.addEventListener("blur", () => {
    handleFolderNameUpdate(folder);
  });

  element.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" && !event.shiftKey) || event.key === "Escape") {
      element.blur();
    }
  });

  element.addEventListener("input", (event) => {
    if (element.innerHTML.length > 100) {
      element.classList.add("text-negative");
    } else {
      element.classList.remove("text-negative");
    }

    charactersLeft.value = 100 - element.innerHTML.length;
  });

  element.addEventListener("paste", (event) => {
    event.stopPropagation();
    event.preventDefault();

    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData
      .getData("Text")
      .replace(/\n/g, " ")
      .replace(/\r/g, "");

    document.execCommand("insertText", false, pastedData);
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

  folder.name = truncateString(element.innerText, 100).trim();

  element.contentEditable = false;
  editingFolderId.value = null;

  presentationsStore.updateFolder(folder);
};
</script>

<style scoped lang="scss">
/*
 * folders
 */
.folders_grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(4, 1fr);

  .folders_grid__item {
    cursor: pointer;
    transition: 0.2s;
    border-radius: 8px;
    border-color: $grey-2;
    overflow: hidden;
    width: 100%;

    .q-card__section {
      border-radius: 0;
      padding: 12px;
    }

    .folder__icon {
      width: 36px;
      min-width: 36px;
      max-width: 36px;
    }

    .folder__name {
      line-height: 50px;
    }
  }

  @media screen and (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 520px) {
    grid-template-columns: repeat(1, 1fr);
  }
}

::v-deep(.q-skeleton):before {
  content: none;
}
</style>
