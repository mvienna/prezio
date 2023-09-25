<template>
  <div class="full-height">
    <q-table
      v-if="presentations?.length"
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
      :loading="isLoading.fetchingPresentations"
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
              :label="$t('presentations.actions.moveToFolder')"
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
                    <div class="row no-wrap justify-center relative-position">
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
              :label="$t('presentations.actions.delete.title')"
              unelevated
              color="red"
              no-caps
              @click="
                showMultiplePresentationsDeletionConfirmationDialog = true
              "
            />

            <q-dialog
              v-model="showMultiplePresentationsDeletionConfirmationDialog"
            >
              <ConfirmationDialog
                icon="r_delete"
                icon-color="red"
                :title="$t('presentations.actions.delete.confirmation.title')"
                :message="
                  $t('presentations.actions.delete.confirmation.message')
                "
                confirm-btn-color="red"
                @cancel="
                  showMultiplePresentationsDeletionConfirmationDialog = false
                "
                @confirm="
                  handleDeletingMultiplePresentations(selectedPresentations);
                  showMultiplePresentationsDeletionConfirmationDialog = false;
                "
              />
            </q-dialog>
          </template>
        </div>
      </template>

      <!-- name -->
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <div class="row no-wrap items-center">
            <!-- preview -->
            <q-img
              :src="props.row.preview?.original_url || props.row.preview"
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
                    presentationStore.updatePresentation(props.row)
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
                      props.row.is_private ? 'r_visibility_off' : 'r_visibility'
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
              style="border-radius: 12px"
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
                    class="q-mr-md"
                  />

                  <div>
                    {{
                      $t("dashboard.presentation.actions.folder.addToFolder")
                    }}
                  </div>

                  <!-- folders options -->
                  <q-menu
                    anchor="top right"
                    self="top start"
                    transition-show="jump-left"
                    transition-hide="jump-right"
                    :offset="[16, 8]"
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
                        handleMovingToFolderPresentations([props.row], folder)
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
                    class="q-mr-md"
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
                    class="q-mr-md"
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
                    class="q-mr-md"
                  />

                  <div
                    v-html="$t('dashboard.presentation.actions.resetResults')"
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
                    class="q-mr-md"
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
                  @click="showPresentationDeletionConfirmationDialog = true"
                >
                  <q-icon
                    name="r_delete"
                    color="red"
                    size="16px"
                    class="q-mr-md"
                  />

                  <div>
                    {{ $t("dashboard.presentation.actions.delete.title") }}
                  </div>
                </q-item>

                <q-dialog v-model="showPresentationDeletionConfirmationDialog">
                  <ConfirmationDialog
                    icon="r_delete"
                    icon-color="red"
                    :title="
                      $t(
                        'dashboard.presentation.actions.delete.confirmation.title'
                      )
                    "
                    :message="
                      $t(
                        'dashboard.presentation.actions.delete.confirmation.message'
                      )
                    "
                    confirm-btn-color="red"
                    @cancel="showPresentationDeletionConfirmationDialog = false"
                    @confirm="
                      presentationStore.deletePresentation(props.value);
                      showPresentationDeletionConfirmationDialog = false;
                    "
                  />
                </q-dialog>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template>
    </q-table>

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

    <!-- new presentation form -->
    <q-dialog v-model="showNewPresentationDialog">
      <PresentationBrowserNewPresentation
        :folders="folders"
        :selected-folder="selectedFolder"
        :is-loading="isLoading.creatingPresentation"
        @close="showNewPresentationDialog = false"
        @submit="handleCreatingNewPresentation($event)"
      />
    </q-dialog>
  </div>
</template>

<script setup>
import { formatDateTime } from "src/helpers/formatDateTime";
import { date } from "quasar";
import ConfirmationDialog from "components/dialogs/ConfirmationDialog.vue";
import PresentationBrowserNewPresentation from "components/presentations/browser/presentations/PresentationsBrowserNewPresentation.vue";
import { computed, onBeforeMount, ref } from "vue";
import { ROUTE_PATHS } from "src/constants/routes";
import { clearRoutePathFromProps } from "src/helpers/clearRoutePathFromProps";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { getFolderIconName } from "src/helpers/generateUniqueId";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const router = useRouter();

/*
 * presentations store
 */
const presentationStore = usePresentationsStore();
const {
  folders,
  selectedFolder,
  presentations,
  selectedPresentations,
  search,
  isLoading,
} = storeToRefs(presentationStore);

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
    field: (row) => {
      const latestUpdatedSlide = row.slides.reduce((prev, current) =>
        new Date(current.updated_at) > new Date(prev.updated_at)
          ? current
          : prev
      );

      return row.updated_at > latestUpdatedSlide.updated_at
        ? row.updated_at
        : latestUpdatedSlide.updated_at;
    },
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
 * folders
 */
const showNewFolderDialog = ref(false);

/*
 * move presentations to folder
 */
const handleMovingToFolderPresentations = (presentations, folder) => {
  presentations.forEach((presentation) => {
    presentationStore.updatePresentation({
      ...presentation,
      folder_id: presentation.folder_id === folder.id ? null : folder.id,
    });
  });

  selectedPresentations.value = [];
};

/*
 * delete presentations
 */
const showMultiplePresentationsDeletionConfirmationDialog = ref(false);
const showPresentationDeletionConfirmationDialog = ref(false);

const handleDeletingMultiplePresentations = (presentations) => {
  presentations.forEach((presentation) => {
    presentationStore.deletePresentation(presentation);
  });

  selectedPresentations.value = [];
};
</script>

<style scoled lang="scss">
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

.q-table__container {
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
  outline: 1.5px solid $grey-3;
  width: 100px;
  aspect-ratio: 16/9;
}
</style>
