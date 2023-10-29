<template>
  <div class="full-height">
    <q-table
      v-if="userHasPresentations"
      :rows="presentations"
      :columns="presentationsColumns"
      v-model:pagination="pagination"
      :filter="search"
      selection="multiple"
      v-model:selected="selectedPresentations"
      row-key="id"
      flat
      separator="none"
      color="primary"
      class="bg-grey-2"
      @request="presentationsStore.fetchPresentations"
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
            @click="
              selectedFolder = null;
              presentationsStore.fetchPresentations();
            "
          />

          <!-- title -->
          <div class="text-h6 text-semibold">
            {{
              selectedFolder ? selectedFolder.name : $t("myPresentations.title")
            }}
          </div>

          <q-spinner-ios
            v-if="isLoading.fetchingPresentations"
            class="q-ml-sm"
          />
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
            :label="$t('myPresentations.noPresentations.create')"
            unelevated
            color="primary"
            no-caps
            @click="showNewPresentationDialog = true"
          />

          <template v-else>
            <!-- move to folder selected presentations -->
            <q-btn
              icon-right="r_folder"
              :label="$t('myPresentations.actions.moveToFolder')"
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
                  :active="folder.id === selectedPresentations[0].folder_id"
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
              :label="$t('myPresentations.actions.delete.title')"
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
                :title="$t('myPresentations.actions.delete.confirmation.title')"
                :message="
                  $t('myPresentations.actions.delete.confirmation.message')
                "
                confirm-btn-color="red"
                @cancel="
                  showMultiplePresentationsDeletionConfirmationDialog = false
                "
                @confirm="
                  handleDeletingPresentations(selectedPresentations);
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
              :src="
                props.row.preview?.preview_url ||
                props.row.preview?.original_url ||
                props.row.preview
              "
              class="presentation__preview"
            />

            <div class="q-ml-sm column no-wrap q-gutter-sm">
              <!-- name -->
              <span class="text-semibold">
                {{ props.row.name }}

                <q-popup-edit
                  v-model="props.row.name"
                  v-slot="scope"
                  @update:model-value="
                    presentationsStore.updatePresentation(props.row)
                  "
                >
                  <q-input
                    v-model="scope.value"
                    dense
                    autofocus
                    @keyup.enter="scope.set"
                  />
                </q-popup-edit>
              </span>

              <div class="row no-wrap items-center">
                <!-- privacy -->
                <button
                  class="row no-wrap items-center text-grey-5 cursor-pointer q-px-none"
                  style="background: transparent; border: none"
                  @click="
                    props.row.is_private = !props.row.is_private;
                    presentationsStore.updatePresentation(props.row);
                  "
                >
                  <q-icon
                    :name="
                      props.row.is_private ? 'r_visibility_off' : 'r_visibility'
                    "
                    class="q-mr-xs"
                  />
                  {{
                    $t(
                      `presentationStudio.settings.visibility.${
                        props.row.is_private ? "private" : "public"
                      }`
                    )
                  }}
                </button>

                <!-- slides -->
                <div class="row no-wrap items-center text-grey-5 q-pl-sm">
                  <q-icon name="r_layers" class="q-mr-xs" />
                  {{ props.row.slides.length }}
                </div>
              </div>
            </div>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-roomToken="props">
        <q-td :props="props">
          <span class="text-semibold">
            <span class="text-uppercase text-monospace">
              {{ props.row?.room?.token }}
            </span>

            <q-popup-edit
              v-if="props.row?.room?.token"
              v-model="props.row.room.token"
              v-slot="scope"
              @update:model-value="
                () => {
                  presentationsStore
                    .sendPresentationRoomUpdateEvent(
                      props.row.id,
                      props.row.room.id,
                      null,
                      props.row.room.token
                    )
                    .catch((error) => {
                      props.row.room.token = error.details.token;

                      $q.notify({
                        message: error.message,
                        color: 'red',
                        icon: 'r_crisis_alert',
                      });
                    });
                }
              "
            >
              <q-input
                v-model="scope.value"
                dense
                type="text"
                autofocus
                :min="1"
                :max="10"
                mask="XXXXXXXXXX"
                hide-bottom-space
                :rules="[(val) => !!val || $t('errors.fieldIsRequired')]"
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </span>
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
                      $t(
                        "myPresentations.presentationRow.actions.folder.addToFolder"
                      )
                    }}
                  </div>

                  <!-- folders options -->
                  <q-menu
                    anchor="top left"
                    self="top end"
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
                    {{
                      $t("myPresentations.presentationRow.actions.duplicate")
                    }}
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
                    {{ $t("myPresentations.presentationRow.actions.stats") }}
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
                    v-html="
                      $t('myPresentations.presentationRow.actions.resetResults')
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
                    class="q-mr-md"
                  />

                  <div>
                    {{ $t("myPresentations.presentationRow.actions.share") }}
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
                    {{
                      $t("myPresentations.presentationRow.actions.delete.title")
                    }}
                  </div>
                </q-item>

                <q-dialog v-model="showPresentationDeletionConfirmationDialog">
                  <ConfirmationDialog
                    icon="r_delete"
                    icon-color="red"
                    :title="
                      $t(
                        'myPresentations.presentationRow.actions.delete.confirmation.title'
                      )
                    "
                    :message="
                      $t(
                        'myPresentations.presentationRow.actions.delete.confirmation.message'
                      )
                    "
                    confirm-btn-color="red"
                    @cancel="showPresentationDeletionConfirmationDialog = false"
                    @confirm="
                      handleDeletingPresentations([props.value]);
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
  </div>

  <!-- no presentations -->
  <div
    v-if="!userHasPresentations"
    class="column no-wrap justify-center"
    style="height: calc(100vh - 66px)"
  >
    <div>
      <!-- winking emoji -->
      <div class="row justify-center">
        <q-icon name="icon-presentation" color="primary" size="64px" />
      </div>

      <div class="text-center q-py-lg">
        <!-- title -->
        <div class="text-h6 text-semibold">
          {{ $t("myPresentations.noPresentations.title") }}
        </div>

        <!-- description -->
        <div>{{ $t("myPresentations.noPresentations.description") }}</div>
      </div>

      <div class="row justify-center q-gutter-md">
        <!-- import -->
        <q-btn
          :label="$t('myPresentations.noPresentations.import')"
          outline
          color="primary"
          no-caps
          disable
        />

        <!-- create -->
        <q-btn
          :label="$t('myPresentations.noPresentations.create')"
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
        @cancel="showNewPresentationDialog = false"
        @submit="handleCreatingNewPresentation($event)"
      />
    </q-dialog>

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
import { formatDateTime } from "src/helpers/dateUtils";
import { date } from "quasar";
import ConfirmationDialog from "components/dialogs/ConfirmationDialog.vue";
import PresentationBrowserNewPresentation from "components/presentationsBrowser/presentations/PresentationsBrowserNewPresentation.vue";
import { onBeforeMount, ref } from "vue";
import { ROUTE_PATHS } from "src/constants/routes";
import { clearRoutePathFromProps } from "src/helpers/routeUtils";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { getFolderIconName } from "src/helpers/generationUtils";
import PresentationBrowserNewFolder from "components/presentationsBrowser/folders/PresentationsBrowserNewFolder.vue";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const router = useRouter();

/*
 * presentations store
 */
const presentationsStore = usePresentationsStore();
const {
  folders,
  selectedFolder,
  presentations,
  selectedPresentations,
  search,
  isLoading,
  pagination,
  userHasPresentations,
} = storeToRefs(presentationsStore);

/*
 * fetch presentations
 */
onBeforeMount(() => {
  presentationsStore.fetchPresentations();
  presentationsStore.fetchFolders();
});

/*
 * presentations table
 */
const presentationColumnsNames = {
  name: "name",
  roomToken: "roomToken",
  updatedAt: "updated_at",
  createdAt: "created_at",
  actions: "actions",
};

const presentationsColumns = [
  {
    name: presentationColumnsNames.name,
    label: t("myPresentations.columns.name"),
    align: "left",
    field: (row) => row.name,
    sortable: true,
  },
  {
    name: presentationColumnsNames.roomToken,
    label: t("myPresentations.columns.roomToken"),
    align: "center",
    field: (row) => row?.room?.token,
    sortable: true,
  },
  {
    name: presentationColumnsNames.updatedAt,
    label: t("myPresentations.columns.updated"),
    align: "center",
    field: (row) => {
      // handle the case where row or row.updated_at is missing
      if (!row || !row.updated_at) {
        return null;
      }

      const slides = row.slides || [];

      const latestUpdatedSlide = slides.reduce((previous, current) => {
        // skip invalid slides
        if (!current || !current.updated_at) {
          return previous;
        }

        const previousDate = new Date(previous.updated_at);
        const currentDate = new Date(current.updated_at);

        return currentDate > previousDate ? current : previous;
      }, slides[0]);

      // if there are no valid slides, return row.updated_at
      if (!latestUpdatedSlide) {
        return row.updated_at;
      }

      const latestRowDate = new Date(row.updated_at);
      const latestSlideDate = new Date(latestUpdatedSlide.updated_at);

      return latestRowDate > latestSlideDate ? latestRowDate : latestSlideDate;
    },
  },
  {
    name: presentationColumnsNames.createdAt,
    label: t("myPresentations.columns.created"),
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

/*
 * open presentation
 */
const handlePresentationClick = (event, item) => {
  if (["TD", "IMG"].includes(event.target.nodeName)) {
    router.push(
      clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_STUDIO) + item.id
    );
  }
};

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

/*
 * move presentations to folder
 */
const handleMovingToFolderPresentations = async (presentations, folder) => {
  await Promise.all(
    presentations.map(async (presentation) => {
      await presentationsStore.updatePresentation({
        ...presentation,
        folder_id: presentation.folder_id === folder.id ? null : folder.id,
      });
    })
  );

  presentationsStore.fetchPresentations();
  selectedPresentations.value = [];
};

/*
 * delete presentations
 */
const showMultiplePresentationsDeletionConfirmationDialog = ref(false);
const showPresentationDeletionConfirmationDialog = ref(false);

const handleDeletingPresentations = async (presentations) => {
  await Promise.all(
    presentations.map(async (presentation) => {
      await presentationsStore.deletePresentation(presentation);
    })
  );

  presentationsStore.fetchPresentations();
  selectedPresentations.value = [];
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
