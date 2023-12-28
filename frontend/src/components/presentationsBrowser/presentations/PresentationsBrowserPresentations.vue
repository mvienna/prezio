<template>
  <div class="q-mt-lg">
    <div class="row no-wrap">
      <!-- title -->
      <div v-if="selectedFolder" class="text-h6 text-semibold">
        <span class="text-grey">
          {{ $t("presentationsBrowser.presentationItem.title") }} /
        </span>
        {{ selectedFolder.name }}
      </div>

      <div v-else class="text-h6 text-semibold">
        {{ $t("presentationsBrowser.presentationItem.title") }}
      </div>

      <q-space />

      <!-- sort -->
      <q-btn
        color="grey"
        flat
        icon="r_swap_vert"
        dense
        no-caps
        class="q-pr-md q-pl-sm"
        :label="$t('presentationsBrowser.sort.title')"
      >
        <q-menu
          anchor="bottom right"
          self="top right"
          transition-show="jump-down"
          transition-hide="jump-up"
          :offset="[0, 8]"
          class="q-pa-sm"
          style="border-radius: 12px"
        >
          <q-list class="full-height column q-gutter-sm">
            <!-- sort by -->
            <q-select
              v-model="pagination.sortBy"
              :options="columns"
              emit-value
              map-options
              option-value="value"
              option-label="label"
              outlined
              dense
              options-dense
              @update:model-value="
                presentationsStore.fetchPresentations({ page: 1 }, true)
              "
            />

            <!-- sort direction -->
            <q-btn
              outline
              dense
              color="grey"
              @click="
                pagination.descending = !pagination.descending;
                presentationsStore.fetchPresentations({ page: 1 }, true);
              "
              no-caps
              class="q-py-sm q-px-md"
            >
              <q-icon
                :name="pagination.descending ? 'r_south' : 'r_north'"
                size="14px"
                class="q-mr-sm"
                color="black"
              />
              <span class="text-black">
                {{
                  $t(
                    `presentationsBrowser.sort.direction.${
                      pagination.descending ? "descending" : "ascending"
                    }`
                  )
                }}
              </span>
            </q-btn>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <!-- selected folder path -->
    <div
      v-if="selectedFolder"
      class="q-py-sm q-mt-md link link--no-decorations"
      @click="handleFolderClose()"
    >
      <div class="row items-center no-wrap q-gutter-sm">
        <q-icon name="r_west" color="grey" />
        <div class="text-grey">
          {{ $t("presentationsBrowser.folderItem.goBack") }}
        </div>
      </div>
    </div>

    <!-- presentations -->
    <div class="q-mt-lg">
      <q-infinite-scroll
        @load="onLoad"
        :offset="274"
        :disable="!pagination.page"
        class="presentations_grid"
        ref="infiniteScroll"
      >
        <template #loading>
          <div class="row justify-center q-my-md">
            <q-spinner-ios color="grey" size="24px" />
          </div>
        </template>

        <q-intersection
          v-for="presentation in presentations"
          :key="presentation.id"
          transition="scale"
          once
          class="relative-position"
        >
          <q-img
            :src="
              presentation.preview?.preview_url ||
              presentation.preview?.original_url ||
              presentation.preview
            "
            class="presentations_grid__item__shadow"
            :class="{
              'presentations_grid__item__shadow--active':
                hoveredPresentationCardId === presentation.id,
            }"
          />

          <q-card flat bordered class="presentations_grid__item">
            <div
              class="presentations_grid__item__preview"
              :class="{
                'presentations_grid__item__preview--active':
                  hoveredPresentationCardId === presentation.id,
              }"
              @mouseover="hoveredPresentationCardId = presentation.id"
              @mouseleave="hoveredPresentationCardId = null"
            >
              <q-img
                :src="
                  presentation.preview?.preview_url ||
                  presentation.preview?.original_url ||
                  presentation.preview
                "
              />

              <div
                class="absolute-center column no-wrap justify-center q-px-xl"
              >
                <transition
                  appear
                  enter-active-class="animated zoomIn"
                  leave-active-class="animated zoomOut"
                >
                  <div
                    v-if="hoveredPresentationCardId === presentation.id"
                    class="column no-wrap q-gutter-sm"
                  >
                    <!-- open in studio -->
                    <q-btn
                      unelevated
                      color="primary"
                      icon="r_draw"
                      no-wrap
                      :href="
                        clearRoutePathFromProps(
                          ROUTE_PATHS.PRESENTATION_STUDIO
                        ) + presentation?.id
                      "
                      no-caps
                      :label="
                        $t('presentationsBrowser.presentationItem.actions.edit')
                      "
                    />

                    <!-- launch presentation -->
                    <q-btn
                      unelevated
                      color="white"
                      text-color="black"
                      no-wrap
                      no-caps
                      :href="
                        clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_ROOM) +
                        presentation?.room?.token
                      "
                      icon="r_play_circle"
                      :label="
                        $t(
                          'presentationsBrowser.presentationItem.actions.launch'
                        )
                      "
                    >
                    </q-btn>
                  </div>
                </transition>
              </div>
            </div>

            <q-card-section>
              <div class="row justify-between no-wrap">
                <div>
                  <!-- title -->
                  <div class="text-semibold">
                    {{ presentation.name }}

                    <q-popup-edit
                      v-model="presentation.name"
                      v-slot="scope"
                      @update:model-value="
                        presentationsStore.updatePresentation(presentation)
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

                  <!-- updated at -->
                  <div class="text-grey q-mt-xs">
                    {{ formatDateTime(getUpdatedAtTitle(presentation)) }}

                    <q-tooltip
                      :offset="[0, 8]"
                      anchor="bottom start"
                      self="top left"
                    >
                      {{
                        date.formatDate(
                          getUpdatedAtTitle(presentation),
                          "DD.MM.YYYY HH:mm"
                        )
                      }}
                    </q-tooltip>
                  </div>
                </div>

                <div>
                  <!-- actions menu -->
                  <q-btn
                    flat
                    icon="r_more_vert"
                    color="grey"
                    round
                    size="12px"
                    class="q-ml-sm"
                  >
                    <q-menu
                      anchor="bottom right"
                      self="top right"
                      transition-show="jump-down"
                      transition-hide="jump-up"
                      :offset="[0, 8]"
                      class="q-pa-sm"
                      style="border-radius: 12px"
                    >
                      <q-list
                        class="full-height column q-gutter-sm text-semibold"
                      >
                        <!-- add to folder -->
                        <q-item
                          :disable="!folders.length"
                          class="items-center justify-start q-px-md q-py-sm"
                          clickable
                          dense
                        >
                          <q-icon
                            name="r_menu_open"
                            color="primary"
                            size="16px"
                            class="q-mr-md"
                          />

                          <div>
                            {{
                              $t(
                                "presentationsBrowser.presentationItem.actions.folder.addToFolder"
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
                              :active="folder.id === presentation.folder_id"
                              @click="
                                handleMovingToFolderPresentations(
                                  presentation,
                                  folder
                                )
                              "
                            >
                              <div
                                class="row no-wrap items-center"
                                style="max-width: 200px"
                              >
                                <div
                                  class="row no-wrap justify-center relative-position"
                                >
                                  <q-img
                                    :src="`/assets/icons/folders/${getFolderIconName(
                                      $q
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
                                    color="white"
                                    size="10px"
                                    class="absolute-center"
                                    style="margin-top: 1px; opacity: 0.5"
                                  />
                                </div>

                                <div class="ellipsis q-ml-sm text-no-wrap">
                                  {{ folder.name }}
                                </div>
                              </div>
                            </q-item>
                          </q-menu>
                        </q-item>

                        <!-- delete -->
                        <q-item
                          class="items-center justify-start q-px-md q-py-sm text-red"
                          clickable
                          dense
                          @click="
                            showPresentationDeletionConfirmationDialog = true
                          "
                        >
                          <q-icon
                            name="r_delete"
                            color="red"
                            size="16px"
                            class="q-mr-md"
                          />

                          <div>
                            {{
                              $t(
                                "presentationsBrowser.presentationItem.actions.delete.title"
                              )
                            }}
                          </div>
                        </q-item>

                        <q-dialog
                          v-model="showPresentationDeletionConfirmationDialog"
                        >
                          <ConfirmationDialog
                            icon="r_delete"
                            icon-color="red"
                            :title="
                              $t(
                                'presentationsBrowser.presentationItem.actions.delete.confirmation.title'
                              )
                            "
                            :message="
                              $t(
                                'presentationsBrowser.presentationItem.actions.delete.confirmation.message'
                              )
                            "
                            confirm-btn-color="red"
                            @cancel="
                              showPresentationDeletionConfirmationDialog = false
                            "
                            @confirm="
                              handleDeletingPresentation(presentation);
                              showPresentationDeletionConfirmationDialog = false;
                            "
                          />
                        </q-dialog>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </div>

              <!-- data -->
              <div class="row no-wrap q-gutter-sm text-grey q-mt-sm">
                <!-- privacy -->
                <q-btn
                  :color="presentation.is_private ? 'grey-2' : 'accent'"
                  :text-color="presentation.is_private ? 'grey' : 'primary'"
                  round
                  unelevated
                  size="8px"
                  class="round-borders"
                  @click="
                    presentation.is_private = !presentation.is_private;
                    presentationsStore.updatePresentation(presentation);
                  "
                >
                  <q-icon
                    :name="
                      presentation.is_private
                        ? 'r_visibility_off'
                        : 'r_visibility'
                    "
                    size="16px"
                  />
                </q-btn>

                <!-- slides -->
                <q-btn
                  color="grey-2"
                  text-color="grey"
                  unelevated
                  dense
                  class="rounded-borders q-mr-xs q-px-sm"
                  icon="r_layers"
                  size="10px"
                  :label="presentation.slides.length"
                />

                <!-- participants -->
                <q-btn
                  color="grey-2"
                  text-color="grey"
                  unelevated
                  dense
                  class="rounded-borders q-mr-xs q-px-sm"
                  icon="r_group"
                  size="10px"
                  :label="presentation.participants.length"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-intersection>
      </q-infinite-scroll>
    </div>
  </div>

  <!-- no presentations -->
  <div
    v-if="!presentations.length && !isLoading.fetchingPresentations"
    class="q-py-lg"
  >
    <!-- winking emoji -->
    <div class="row justify-center">
      <q-img src="/assets/images/illustration_1.png" style="width: 300px" />
    </div>

    <div class="text-center q-mt-sm">
      <!-- title -->
      <div class="text-h6 text-semibold">
        {{ $t("presentationsBrowser.noPresentations.title") }}
      </div>

      <!-- description -->
      <div>{{ $t("presentationsBrowser.noPresentations.description") }}</div>
    </div>
  </div>
</template>

<script setup>
import { formatDateTime } from "src/helpers/dateUtils";
import { date } from "quasar";
import ConfirmationDialog from "components/dialogs/ConfirmationDialog.vue";
import { ref, watch } from "vue";
import { ROUTE_PATHS } from "src/constants/routes";
import { clearRoutePathFromProps } from "src/helpers/routeUtils";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { getFolderIconName } from "src/helpers/generationUtils";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const router = useRouter();

/*
 * presentations store
 */
const presentationsStore = usePresentationsStore();
const { folders, selectedFolder, presentations, isLoading, pagination } =
  storeToRefs(presentationsStore);

/*
 * presentation
 */
const columns = [
  {
    label: t("presentationsBrowser.sort.fields.name"),
    value: "name",
  },
  {
    label: t("presentationsBrowser.sort.fields.created_at"),
    value: "created_at",
  },
  {
    label: t("presentationsBrowser.sort.fields.updated_at"),
    value: "updated_at",
  },
];

const getUpdatedAtTitle = (presentation) => {
  // handle the case where row or row.updated_at is missing
  if (!presentation || !presentation.updated_at) {
    return null;
  }

  const slides = presentation.slides || [];

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
    return presentation.updated_at;
  }

  const latestRowDate = new Date(presentation.updated_at);
  const latestSlideDate = new Date(latestUpdatedSlide.updated_at);

  return latestRowDate > latestSlideDate ? latestRowDate : latestSlideDate;
};

/*
 * move presentations to folder
 */
const handleMovingToFolderPresentations = async (presentation, folder) => {
  await presentationsStore.updatePresentation({
    ...presentation,
    folder_id: presentation.folder_id === folder.id ? null : folder.id,
  });
  presentations.value = presentations.value.filter(
    (item) => item.id !== presentation.id
  );
};

const handleFolderClose = () => {
  selectedFolder.value = null;
  presentationsStore.fetchPresentations({ page: 1 }, true);
};

/*
 * delete presentations
 */
const showPresentationDeletionConfirmationDialog = ref(false);

const handleDeletingPresentation = async (presentation) => {
  await presentationsStore.deletePresentation(presentation);
  presentations.value = presentations.value.filter(
    (item) => item.id !== presentation.id
  );
};

const hoveredPresentationCardId = ref();

/*
 * infinite scroll
 */
const infiniteScroll = ref();

const onLoad = async (index, done) => {
  await presentationsStore.fetchPresentations({
    page: index,
  });
  done();
};

watch(
  () => selectedFolder.value,
  () => {
    infiniteScroll.value.setIndex(1);
  }
);
</script>

<style scoped lang="scss">
.presentations_grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  .presentations_grid__item {
    overflow: hidden;

    .presentations_grid__item__preview {
      border-bottom: 1px solid $grey-2;
      position: relative;

      .q-img {
        width: 100%;
        transition: 0.5s;
      }

      &.presentations_grid__item__preview--active {
        .q-img {
          filter: brightness(50%);
        }
      }
    }
  }
}

.presentations_grid__item__shadow {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  height: 60%;

  filter: blur(48px);
  transition: 0.5s;

  &.presentations_grid__item__shadow--active {
    width: 80%;
    height: 80%;
  }
}
</style>
