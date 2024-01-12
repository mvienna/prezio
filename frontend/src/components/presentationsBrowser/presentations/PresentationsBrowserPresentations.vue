<template>
  <div class="q-mt-lg">
    <div
      class="no-wrap"
      :class="$q.screen.lt.md ? 'column q-gutter-sm' : 'row'"
    >
      <!-- title -->
      <div v-if="selectedFolder" class="text-h6 text-semibold">
        <span
          class="text-grey"
          :class="{ link: selectedFolder }"
          @click="handleFolderClose()"
        >
          {{ $t("presentationsBrowser.presentationItem.title") }}
        </span>
        <span class="text-grey"> / </span>
        {{ selectedFolder.name }}
      </div>

      <div v-else class="text-h6 text-semibold">
        {{ $t("presentationsBrowser.presentationItem.title") }}
      </div>

      <q-space />

      <!-- sort -->
      <div class="row no-wrap items-center scroll-x scroll--hidden">
        <q-btn
          v-for="column in columns"
          flat
          dense
          no-caps
          no-wrap
          color="grey-9"
          size="12px"
          class="q-px-sm q-mr-sm"
          :key="column.value"
          @click="
            () => {
              if (pagination.sortBy === column.value) {
                pagination.descending = !pagination.descending;
              } else {
                pagination.sortBy = column.value;
              }
              presentationsStore.fetchPresentations({ page: 1 }, true);
            }
          "
        >
          <q-icon
            :name="
              pagination.sortBy === column.value
                ? pagination.descending
                  ? 'r_south'
                  : 'r_north'
                : 'r_remove'
            "
            size="1.2em"
            class="q-mr-sm"
            style="font-weight: 700"
          />
          {{ column.label }}
        </q-btn>
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
          transition="fade"
          once
          class="relative-position"
          style="max-width: 100%; overflow: hidden"
        >
          <q-card
            flat
            bordered
            class="presentations_grid__item shadow-2xs-soft shadow-2xs-soft--hoverable"
          >
            <div
              class="presentations_grid__item__preview"
              @mouseover="hoveredPresentationCardId = presentation.id"
              @mouseleave="hoveredPresentationCardId = null"
            >
              <div class="relative-position">
                <q-img
                  :src="
                    presentation.preview?.preview_url ||
                    presentation.preview?.original_url ||
                    presentation.preview
                  "
                />
              </div>

              <transition
                appear
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
              >
                <div
                  v-if="hoveredPresentationCardId === presentation.id"
                  class="presentations_grid__item__preview__overlay absolute-center column no-wrap justify-center q-px-xl"
                >
                  <div class="column no-wrap q-gutter-sm">
                    <!-- open in studio -->
                    <q-btn
                      unelevated
                      color="primary"
                      icon="r_edit"
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
                        clearRoutePathFromProps(
                          ROUTE_PATHS.PRESENTATION_ROOM.HOST
                        ) + presentation?.room?.token
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
                </div>
              </transition>
            </div>

            <q-card-section>
              <div class="row justify-between no-wrap">
                <div style="max-width: calc(100% - 36px - 16px)">
                  <!-- title -->
                  <div class="relative-position">
                    <div
                      class="text-semibold cursor-pointer scroll--hidden"
                      :class="{
                        ellipsis: editingPresentationId !== presentation.id,
                      }"
                      style="width: 100%"
                      :style="`${
                        editingPresentationId === presentation.id
                          ? 'padding: 0 4px; margin-left: -4px; margin-right: 4px; white-space: nowrap; overflow-x: scroll; '
                          : ''
                      }`"
                      @click="handlePresentationNameClick(presentation)"
                      @dblclick="
                        (event) => {
                          event.preventDefault();
                          handlePresentationNameDoubleClick(
                            event,
                            presentation
                          );
                        }
                      "
                      :id="`presentation-${presentation.id}-name`"
                    >
                      {{ presentation.name }}
                    </div>
                  </div>

                  <!-- updated at -->
                  <div class="text-grey-9 text-12 q-mt-xs">
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
                    >
                      <!-- rename -->
                      <q-item
                        class="items-center justify-start"
                        clickable
                        dense
                        v-close-popup
                        @click="
                          handlePresentationNameDoubleClick(
                            $event,
                            presentation
                          )
                        "
                      >
                        <q-icon name="r_edit" size="16px" class="q-mr-sm" />

                        <div>
                          {{
                            $t(
                              "presentationsBrowser.presentationItem.actions.rename"
                            )
                          }}
                        </div>
                      </q-item>

                      <!-- add to folder -->
                      <q-item
                        :disable="!folders.length"
                        class="items-center justify-start"
                        clickable
                        dense
                      >
                        <q-icon
                          name="icon-folder_move"
                          size="1em"
                          class="q-mr-sm"
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
                              <q-img
                                :src="`/assets/icons/folders/${getFolderIconName(
                                  $q
                                )}.png`"
                                style="width: 1.75em; min-width: 1.75em"
                              />

                              <div class="ellipsis q-ml-sm text-no-wrap">
                                {{ folder.name }}
                              </div>
                            </div>
                          </q-item>
                        </q-menu>
                      </q-item>

                      <q-separator class="q-my-sm" />

                      <!-- delete -->
                      <q-item
                        class="items-center justify-start text-red"
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
                          class="q-mr-sm"
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
                    </q-menu>
                  </q-btn>
                </div>
              </div>

              <!-- data -->
              <div class="row no-wrap text-grey q-mt-sm">
                <!-- privacy -->
                <q-btn
                  :color="presentation.is_private ? 'grey-2' : 'accent'"
                  :text-color="presentation.is_private ? 'grey' : 'secondary'"
                  round
                  unelevated
                  size="7px"
                  class="round-borders q-mr-3xs"
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
                    size="14px"
                  />
                </q-btn>

                <!-- slides -->
                <div class="row no-wrap items-center q-mr-3xs">
                  <q-btn
                    color="grey-2"
                    text-color="grey"
                    unelevated
                    round
                    class="round-borders cursor-default q-mr-xs"
                    size="7px"
                  >
                    <q-icon name="r_layers" size="14px" />
                  </q-btn>

                  <div class="text-grey text-12">
                    {{ presentation?.slides?.length || 0 }}
                  </div>
                </div>

                <!-- participants -->
                <div class="row no-wrap items-center">
                  <q-btn
                    color="grey-2"
                    text-color="grey"
                    unelevated
                    round
                    class="round-borders cursor-default q-mr-xs"
                    size="7px"
                  >
                    <q-icon name="r_group" size="14px" />
                  </q-btn>

                  <div class="text-grey text-12">
                    {{ presentation?.participants?.length || 0 }}
                  </div>
                </div>
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
      <q-img src="/assets/illustrations/team_work.svg" style="width: 300px" />
    </div>

    <div class="text-center q-mt-sm">
      <!-- title -->
      <div class="text-h6 text-semibold">
        {{ $t("presentationsBrowser.noPresentations.title") }}
      </div>

      <!-- description -->
      <div>{{ $t("presentationsBrowser.noPresentations.description") }}</div>
    </div>

    <div class="row justify-center q-mt-md">
      <q-btn
        outline
        :label="$t('presentationsBrowser.newPresentation.title')"
        icon="r_add"
        no-caps
        class="bg-white"
        @click="$emit('newPresentation')"
      />
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

const emit = defineEmits(["newPresentation"]);

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

/*
 * rename presentation
 */
const editingPresentationId = ref();

const handlePresentationNameClick = (presentation) => {
  setTimeout(() => {
    if (editingPresentationId.value === presentation?.id) return;
    router.push(
      clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_STUDIO) +
        presentation?.id
    );
  }, 300);
};

const handlePresentationNameDoubleClick = (event, presentation) => {
  editingPresentationId.value = presentation.id;

  const element = document.getElementById(
    `presentation-${presentation.id}-name`
  );
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

    element.scrollLeft = element.scrollWidth;
  }, 100);

  element.addEventListener("blur", () => {
    handlePresentationNameUpdate(presentation);
  });

  element.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" && !event.shiftKey) || event.key === "Escape") {
      element.blur();
    }
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

const handlePresentationNameUpdate = async (presentation) => {
  const element = document.getElementById(
    `presentation-${presentation.id}-name`
  );

  presentation.name = element.innerText;

  await presentationsStore.updatePresentation(presentation);

  element.contentEditable = false;
  editingPresentationId.value = null;
};
</script>

<style scoped lang="scss">
.presentations_grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media screen and (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
  }

  .presentations_grid__item {
    overflow: hidden;

    .presentations_grid__item__preview {
      border-bottom: 1px solid $grey-2;
      position: relative;

      .q-img {
        width: 100%;
        aspect-ratio: 16/9;
        transition: 0.5s;
      }

      .presentations_grid__item__preview__overlay {
        width: 100%;
        height: 100%;
        background: linear-gradient(
          180deg,
          rgba(10, 9, 11, 0.8) 0%,
          rgba(10, 9, 11, 0.4) 100%
        );
        z-index: 1;
      }
    }
  }
}
</style>
