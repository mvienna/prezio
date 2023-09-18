<template>
  <q-page>
    <!-- loading -->
    <div v-if="isLoading" class="row justify-center q-mt-lg">
      <q-spinner-ios color="primary" size="2em" />
    </div>

    <template v-else>
      <!-- presentations -->
      <div v-if="presentations.length" class="container">
        <q-table
          :rows="presentations"
          :columns="presentationsColumns"
          :pagination="pagination"
          :filter="search"
          selection="multiple"
          v-model:selected="selectedPresentations"
          row-key="id"
          flat
          separator="none"
          color="primary"
          class="bg-grey-2 q-mt-lg"
          @row-click="handlePresentationClick"
        >
          <template v-slot:top>
            <!-- title -->
            <div class="text-h6 text-semibold">
              {{ $t("presentations.myPresentationsTitle") }}
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
                disable
              />

              <!-- create new presentation -->
              <q-btn
                icon-right="r_add"
                :label="$t('dashboard.noPresentations.create')"
                unelevated
                color="primary"
                no-caps
                @click="showNewPresentationDialog = true"
              />
            </div>
          </template>

          <!-- name -->
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <div>
                {{ props.row.name }}

                <q-popup-edit
                  v-model="props.row.name"
                  v-slot="scope"
                  @update:model-value="handleRowUpdate($event, props.row.id)"
                >
                  <q-input
                    v-model="scope.value"
                    dense
                    autofocus
                    @keyup.enter="scope.set"
                  />
                </q-popup-edit>
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
                    <!-- duplicate -->
                    <q-item
                      class="items-center justify-start q-px-md q-py-sm"
                      style="border-radius: 8px"
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
                      style="border-radius: 8px"
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
                      style="border-radius: 8px"
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
                      style="border-radius: 8px"
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
                      style="border-radius: 8px"
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
      <div v-else class="column no-wrap justify-center full-height">
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
        :is-loading="isCreatingPresentation"
        @close="showNewPresentationDialog = false"
        @submit="handleCreatingNewPresentation($event)"
      />
    </q-dialog>
  </q-page>
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

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const router = useRouter();

/*
 * presentations store
 */
const presentationStore = usePresentationStore();
const { presentations, search, isLoading, isCreatingPresentation } =
  storeToRefs(presentationStore);

/*
 * fetch presentations
 */
onBeforeMount(() => {
  isLoading.value = true;

  api
    .get("/presentations")
    .then((response) => {
      presentations.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
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
    classes: "text-semibold",
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
</script>

<style scoped lang="scss">
.q-page {
  height: calc(100vh - 66px);
}

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
  height: calc(100vh - 66px);
  padding-top: 24px;
  margin-top: 0;
}

::v-deep(.q-table__middle) {
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
