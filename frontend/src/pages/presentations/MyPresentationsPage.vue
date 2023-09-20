<template>
  <div>
    <!-- loading -->
    <div v-if="isLoading" class="row justify-center q-mt-lg">
      <q-spinner-ios color="primary" size="2em" />
    </div>

    <template v-else>
      <!-- folders -->
      <div class="container">
        <div class="row no-wrap q-gutter-md q-pt-lg q-px-sm folders scroll-x">
          <template v-if="folders?.length">
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
                  :name="
                    folder.is_private ? 'r_visibility_off' : 'r_visibility'
                  "
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
                      handleFolderUpdate(folder);
                    "
                  >
                    <q-icon
                      :name="
                        folder.is_private ? 'r_visibility_off' : 'r_visibility'
                      "
                      class="q-mr-sm"
                      size="xs"
                    />
                    <div>
                      {{
                        $t(
                          `dashboard.presentation.actions.folder.privacy.${
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
                    @click="handleFolderDeletion(folder)"
                  >
                    <q-icon name="r_delete" class="q-mr-sm" size="xs" />
                    <div>
                      {{ $t("dashboard.presentation.actions.folder.delete") }}
                    </div>
                  </q-item>
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
                  @update:model-value="handleFolderUpdate(folder)"
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
              {{ $t("presentations.newFolder.title") }}
            </div>
          </div>
        </div>
      </div>

      <!-- presentations -->
      <div v-if="presentations.length" class="container">
        <q-table
          :rows="filteredPresentations"
          :columns="presentationsColumns"
          :pagination="pagination"
          :filter="search"
          selection="multiple"
          v-model:selected="selectedPresentations"
          row-key="id"
          flat
          separator="none"
          color="primary"
          class="bg-grey-2"
          @row-click="handlePresentationClick"
        >
          <template v-slot:top>
            <div class="row no-wrap items-center">
              <!-- close folder button -->
              <q-btn
                icon="r_close"
                flat
                round
                class="q-mr-sm"
                size="10px"
                :disable="!selectedFolder"
                @click="selectedFolder = null"
              />

              <!-- title -->
              <div class="text-h6 text-semibold">
                {{
                  selectedFolder
                    ? selectedFolder.name
                    : $t("presentations.myPresentationsTitle")
                }}
              </div>
            </div>

            <q-space />

            <div class="row no-wrap q-gutter-sm">
              <!-- import -->
              <q-btn
                outline
                color="primary"
                round
                icon="r_upload"
                size="12px"
                disable
              />

              <!-- new folder -->
              <q-btn
                outline
                color="primary"
                round
                icon="r_create_new_folder"
                size="12px"
                @click="showNewFolderDialog = true"
              />

              <!-- create new presentation -->
              <q-btn
                v-if="!selectedPresentations.length"
                icon-right="r_add"
                :label="$t('dashboard.noPresentations.create')"
                unelevated
                color="primary"
                no-caps
                @click="showNewPresentationDialog = true"
              />

              <template v-else>
                <!-- move to folder selected presentations -->
                <q-btn
                  icon-right="r_folder"
                  :label="$t('dashboard.noPresentations.moveTo')"
                  outline
                  color="primary"
                  no-caps
                >
                  <!-- folders options -->
                  <q-menu
                    anchor="bottom right"
                    self="top right"
                    transition-show="jump-down"
                    transition-hide="jump-up"
                    :offset="[0, 8]"
                    class="q-pa-sm"
                    style="max-height: 304px"
                  >
                    <q-item
                      v-for="folder in folders"
                      :key="folder.id"
                      clickable
                      dense
                      v-close-popup
                      @click="
                        handleMovingToFolderPresentations(
                          selectedPresentations,
                          folder
                        )
                      "
                    >
                      <div class="row no-wrap items-center">
                        <div
                          class="row no-wrap justify-center relative-position"
                        >
                          <q-img
                            :src="`/assets/icons/${getFolderIconName(
                              folder.id
                            )}.png`"
                            style="width: 24px"
                          />

                          <!-- folder privacy -->
                          <q-icon
                            :name="
                              folder.is_private
                                ? 'r_visibility_off'
                                : 'r_visibility'
                            "
                            color="grey-5"
                            size="10px"
                            class="absolute-center"
                            style="margin-top: 1px"
                          />
                        </div>

                        <div class="ellipsis q-ml-sm text-no-wrap">
                          {{ folder.name }}
                        </div>
                      </div>
                    </q-item>
                  </q-menu>
                </q-btn>

                <!-- delete selected presentations -->
                <q-btn
                  icon-right="r_delete"
                  :label="$t('dashboard.noPresentations.delete')"
                  unelevated
                  color="red"
                  no-caps
                  @click="
                    handleDeletingMultiplePresentations(selectedPresentations)
                  "
                />
              </template>
            </div>
          </template>

          <!-- name -->
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <div class="row no-wrap items-center">
                <!-- preview -->
                <q-img
                  :src="props.row.slides[0].preview"
                  class="presentation__preview"
                  fit="contain"
                />

                <div class="q-ml-sm column no-wrap q-gutter-sm">
                  <!-- name -->
                  <div class="text-semibold">
                    {{ props.row.name }}

                    <q-popup-edit
                      v-model="props.row.name"
                      v-slot="scope"
                      @update:model-value="
                        handleRowUpdate($event, props.row.id)
                      "
                    >
                      <q-input
                        v-model="scope.value"
                        dense
                        autofocus
                        @keyup.enter="scope.set"
                      />
                    </q-popup-edit>
                  </div>

                  <div class="row no-wrap items-center">
                    <!-- privacy -->
                    <div class="row no-wrap items-center text-grey-5">
                      <q-icon
                        :name="
                          props.row.is_private
                            ? 'r_visibility_off'
                            : 'r_visibility'
                        "
                        class="q-mr-xs"
                      />
                      {{
                        $t(
                          `presentation.settings.visibility.${
                            props.row.is_private ? "private" : "public"
                          }`
                        )
                      }}
                    </div>

                    <!-- slides -->
                    <div class="row no-wrap items-center text-grey-5 q-pl-md">
                      <q-icon name="r_layers" class="q-mr-xs" />
                      {{ props.row.slides.length }}
                    </div>
                  </div>
                </div>
              </div>
            </q-td>
          </template>

          <!-- updated at -->
          <template v-slot:body-cell-updated_at="props">
            <q-td :props="props">
              {{ formatDateTime(props.value) }}

              <q-tooltip :offset="[0, 0]">
                {{ date.formatDate(props.value, "DD.MM.YYYY HH:mm") }}
              </q-tooltip>
            </q-td>
          </template>

          <!-- created at -->
          <template v-slot:body-cell-created_at="props">
            <q-td :props="props">
              {{ formatDateTime(props.value) }}

              <q-tooltip :offset="[0, 0]">
                {{ date.formatDate(props.value, "DD.MM.YYYY HH:mm") }}
              </q-tooltip>
            </q-td>
          </template>

          <!-- actions -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn icon="more_vert" round flat size="10px">
                <q-menu
                  anchor="bottom right"
                  self="top right"
                  transition-show="jump-down"
                  transition-hide="jump-up"
                  :offset="[0, 8]"
                  class="q-pa-sm"
                >
                  <q-list class="full-height column q-gutter-sm text-semibold">
                    <!-- add to folder -->
                    <q-item
                      :disable="!folders.length"
                      class="items-center justify-start q-px-md q-py-sm"
                      clickable
                      dense
                    >
                      <q-icon
                        name="r_folder"
                        color="primary"
                        size="16px"
                        class="q-mr-sm"
                      />

                      <div>
                        {{
                          $t(
                            "dashboard.presentation.actions.folder.addToFolder"
                          )
                        }}
                      </div>

                      <!-- folders options -->
                      <q-menu
                        anchor="top right"
                        self="top start"
                        transition-show="jump-down"
                        transition-hide="jump-up"
                        :offset="[0, 8]"
                        class="q-pa-sm"
                        style="max-height: 304px"
                      >
                        <q-item
                          v-for="folder in folders"
                          :key="folder.id"
                          clickable
                          dense
                          :active="folder.id === props.row.folder_id"
                          @click="
                            handleMovingToFolderPresentations(
                              [props.row],
                              folder
                            )
                          "
                        >
                          <div class="row no-wrap items-center">
                            <div
                              class="row no-wrap justify-center relative-position"
                            >
                              <q-img
                                :src="`/assets/icons/${getFolderIconName(
                                  folder.id
                                )}.png`"
                                style="width: 24px"
                              />

                              <!-- folder privacy -->
                              <q-icon
                                :name="
                                  folder.is_private
                                    ? 'r_visibility_off'
                                    : 'r_visibility'
                                "
                                color="grey-5"
                                size="10px"
                                class="absolute-center"
                                style="margin-top: 1px"
                              />
                            </div>

                            <div class="ellipsis q-ml-sm text-no-wrap">
                              {{ folder.name }}
                            </div>
                          </div>
                        </q-item>
                      </q-menu>
                    </q-item>

                    <!-- duplicate -->
                    <q-item
                      class="items-center justify-start q-px-md q-py-sm"
                      clickable
                      dense
                      disable
                      v-close-popup
                    >
                      <q-icon
                        name="r_control_point_duplicate"
                        color="primary"
                        size="16px"
                        class="q-mr-sm"
                      />

                      <div>
                        {{ $t("dashboard.presentation.actions.duplicate") }}
                      </div>
                    </q-item>

                    <!-- stats -->
                    <q-item
                      class="items-center justify-start q-px-md q-py-sm"
                      clickable
                      dense
                      disable
                      v-close-popup
                    >
                      <q-icon
                        name="r_query_stats"
                        color="primary"
                        size="16px"
                        class="q-mr-sm"
                      />

                      <div>
                        {{ $t("dashboard.presentation.actions.stats") }}
                      </div>
                    </q-item>

                    <!-- reset results -->
                    <q-item
                      class="items-center justify-start q-px-md q-py-sm"
                      clickable
                      dense
                      disable
                      v-close-popup
                    >
                      <q-icon
                        name="r_restart_alt"
                        color="primary"
                        size="16px"
                        class="q-mr-sm"
                      />

                      <div
                        v-html="
                          $t('dashboard.presentation.actions.resetResults')
                        "
                      ></div>
                    </q-item>

                    <!-- share -->
                    <q-item
                      class="items-center justify-start q-px-md q-py-sm"
                      clickable
                      dense
                      disable
                      v-close-popup
                    >
                      <q-icon
                        name="r_ios_share"
                        color="primary"
                        size="16px"
                        class="q-mr-sm"
                      />

                      <div>
                        {{ $t("dashboard.presentation.actions.share") }}
                      </div>
                    </q-item>

                    <!-- delete -->
                    <q-item
                      class="items-center justify-start q-px-md q-py-sm text-red"
                      clickable
                      dense
                      v-close-popup
                      @click="presentationStore.deletePresentation(props.value)"
                    >
                      <q-icon
                        name="r_delete"
                        color="red"
                        size="16px"
                        class="q-mr-sm"
                      />

                      <div>
                        {{ $t("dashboard.presentation.actions.delete") }}
                      </div>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>

      <!-- no presentations -->
      <div v-else class="column no-wrap justify-center q-mt-lg">
        <!-- winking emoji -->
        <div class="row justify-center">
          <q-img src="/assets/icons/emojis/Winking.png" style="width: 64px" />
        </div>

        <div class="text-center q-pb-lg q-pt-md">
          <!-- title -->
          <div class="text-h6 text-semibold">
            {{ $t("dashboard.noPresentations.title") }}
          </div>

          <!-- description -->
          <div>{{ $t("dashboard.noPresentations.description") }}</div>
        </div>

        <div class="row justify-center q-gutter-md">
          <!-- import -->
          <q-btn
            :label="$t('dashboard.noPresentations.import')"
            outline
            color="primary"
            no-caps
            disable
          />

          <!-- create -->
          <q-btn
            icon-right="add"
            :label="$t('dashboard.noPresentations.create')"
            unelevated
            color="primary"
            no-caps
            @click="showNewPresentationDialog = true"
          />
        </div>
      </div>
    </template>

    <!-- new presentation form -->
    <q-dialog v-model="showNewPresentationDialog">
      <NewPresentation
        :folders="folders"
        :selected-folder="selectedFolder"
        :is-loading="isCreatingPresentation"
        @close="showNewPresentationDialog = false"
        @submit="handleCreatingNewPresentation($event)"
      />
    </q-dialog>

    <!-- new folder form -->
    <q-dialog v-model="showNewFolderDialog">
      <NewPresentationFolder
        :presentations="
          presentations.filter((presentation) => !presentation.folder_id)
        "
        :selected-presentations="selectedPresentations"
        :is-loading="isCreatingFolder"
        @close="showNewFolderDialog = false"
        @submit="handleCreatingNewFolder($event)"
      />
    </q-dialog>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { api } from "boot/axios";
import NewPresentation from "components/presentation/NewPresentation.vue";
import { useRouter } from "vue-router";
import { ROUTE_PATHS } from "src/constants/routes";
import { clearRoutePathFromProps } from "src/helpers/clearRoutePathFromProps";
import { useI18n } from "vue-i18n";
import { formatDateTime } from "src/helpers/formatDateTime";
import { date } from "quasar";
import { usePresentationStore } from "stores/presentation";
import { storeToRefs } from "pinia";
import NewPresentationFolder from "components/presentation/NewPresentationFolder.vue";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const router = useRouter();

/*
 * presentations store
 */
const presentationStore = usePresentationStore();
const { folders, presentations, search, isLoading, isCreatingPresentation } =
  storeToRefs(presentationStore);

const selectedFolder = ref(null);

const filteredPresentations = computed(() => {
  return presentations.value.filter((presentation) =>
    selectedFolder.value
      ? presentation.folder_id === selectedFolder.value?.id
      : !presentation.folder_id
  );
});

/*
 * fetch presentations
 */
onBeforeMount(() => {
  presentationStore.fetchPresentations();
  presentationStore.fetchFolders();
});

/*
 * presentations table
 */
const presentationColumnsNames = {
  name: "name",
  accessKey: "accessKey",
  updatedAt: "updated_at",
  createdAt: "created_at",
  actions: "actions",
};

const presentationsColumns = [
  {
    name: presentationColumnsNames.name,
    label: t("presentations.columns.name"),
    align: "left",
    field: (row) => row.name,
    sortable: true,
  },
  {
    name: presentationColumnsNames.accessKey,
    label: t("presentations.columns.accessKey"),
    align: "center",
    field: (row) => row.accessKey,
    sortable: true,
  },
  {
    name: presentationColumnsNames.updatedAt,
    label: t("presentations.columns.updated"),
    align: "center",
    field: (row) => row.updated_at,
    sortable: true,
  },
  {
    name: presentationColumnsNames.createdAt,
    label: t("presentations.columns.created"),
    align: "center",
    field: (row) => row.created_at,
    sortable: true,
  },
  {
    name: presentationColumnsNames.actions,
    align: "center",
    field: (row) => row,
  },
];

const pagination = ref({
  sortBy: "updated_at",
  descending: true,
  page: 1,
  rowsPerPage: 10,
});

const selectedPresentations = ref([]);

/*
 * open presentation
 */
const handlePresentationClick = (event, item) => {
  if (event.target.nodeName === "TD") {
    router.push(
      clearRoutePathFromProps(ROUTE_PATHS.PRESENTATIONS.PRESENTATION) + item.id
    );
  }
};

/*
 * update presentation
 */
const handleRowUpdate = (event, id) => {
  const presentation = presentations.value.find(
    (presentation) => presentation.id === id
  );

  presentationStore.updatePresentation(presentation);
};

/*
 * new presentation
 */
const showNewPresentationDialog = ref(false);

const handleCreatingNewPresentation = (data) => {
  presentationStore.createNewPresentation(data).then((response) => {
    router.push(
      clearRoutePathFromProps(ROUTE_PATHS.PRESENTATIONS.PRESENTATION) +
        response.data.id
    );
  });
};

/*
 * new folder
 */
const showNewFolderDialog = ref(false);
const isCreatingFolder = ref(false);

const handleCreatingNewFolder = (data) => {
  isCreatingFolder.value = true;

  api
    .post("/folder", {
      name: data.name,
      description: data.description,
      is_private: data.is_private,
      presentations_ids: data.presentationsIds,
    })
    .then((response) => {
      folders.value.push(response.data);
      selectedFolder.value = response.data;

      if (data.presentationsIds.length) {
        data.presentationsIds.forEach((id) => {
          const presentationIndex = presentations.value.findIndex(
            (item) => item.id === id
          );
          presentations.value[presentationIndex].folder_id =
            selectedFolder.value.id;
        });
      }
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      showNewFolderDialog.value = false;
      isCreatingFolder.value = false;
    });
};

const handleFolderUpdate = (folder) => {
  api.patch(`/folder/${folder.id}`, {
    name: folder.name,
    description: folder.description,
    is_private: folder.is_private,
  });
};

const handleFolderDeletion = (folder) => {
  api.delete(`/folder/${folder.id}`).then(() => {
    folders.value = folders.value.filter((item) => item.id !== folder.id);

    if (selectedFolder.value?.id === folder.id) {
      selectedFolder.value = null;
    }

    presentations.value.map((presentation) => {
      if (presentation.folder_id === folder.id) {
        presentation.folder_id = null;
      }

      return presentation;
    });
  });
};

const handleMovingToFolderPresentations = (presentations, folder) => {
  presentations.forEach((presentation) => {
    presentationStore.updatePresentation({
      ...presentation,
      folder_id: presentation.folder_id === folder.id ? null : folder.id,
    });
  });

  selectedPresentations.value = [];
};

const handleDeletingMultiplePresentations = (presentations) => {
  presentations.forEach((presentation) => {
    presentationStore.deletePresentation(presentation);
  });

  selectedPresentations.value = [];
};

const getFolderIconName = (id) => {
  if (id % 4 === 1) {
    return "folder";
  } else if (id % 4 === 2) {
    return "folder_red";
  } else if (id % 4 === 3) {
    return "folder_green";
  } else if (id % 4 === 0) {
    return "folder_pink";
  }
};
</script>

<style scoped lang="scss">
::v-deep(.q-table) {
  border-spacing: 0 8px;

  tbody {
    tr {
      background: $white;

      td:first-child,
      td:first-child:before,
      td:first-child:after {
        border-radius: 8px 0 0 8px;
      }

      td:last-child,
      td:last-child:before,
      td:last-child:after {
        border-radius: 0 8px 8px 0;
      }

      td:before,
      td:after {
        background: rgba(0, 0, 0, 0.01);
      }
    }
  }
}

::v-deep(.q-table__container) {
  height: calc(100vh - 66px - 116px);
  padding-top: 16px;
  margin-top: 0;
}

::v-deep(.q-table__middle) {
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.presentation__preview {
  border-radius: 6px;
  outline: 2px solid $grey-2;
  width: 100px;
  aspect-ratio: 16/9;
}

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
</style>
