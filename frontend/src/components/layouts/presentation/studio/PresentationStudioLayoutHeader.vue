<template>
  <q-header class="bg-white q-pa-xs" elevated>
    <q-toolbar>
      <!-- logo -->
      <q-btn
        unelevated
        round
        :href="ROUTE_PATHS.PRESENTATIONS_BROWSER"
        text-color="grey-5"
        size="10px"
      >
        <template #default>
          <q-img src="/favicon.ico" />
        </template>
      </q-btn>

      <div v-if="presentation" class="text-h6 text-semibold text-black q-ml-md">
        <!-- presentation name -->
        <span style="cursor: text">
          {{ presentation.name }}

          <q-popup-edit
            v-model="presentation.name"
            v-slot="scope"
            @update:model-value="
              presentation.name = $event;
              presentationsStore.updatePresentation();
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

        <!-- visibility -->
        <q-btn
          text-color="dark"
          flat
          no-caps
          no-wrap
          round
          size="12px"
          class="q-ml-sm"
          :icon="presentation?.is_private ? 'r_visibility_off' : 'r_visibility'"
          @click="
            presentation.is_private = !presentation.is_private;
            presentationsStore.updatePresentation();
          "
        />
      </div>

      <q-separator vertical class="q-my-sm q-mx-sm" />

      <!-- undo / redo -->
      <div class="row no-wrap items-center">
        <q-btn
          icon="r_undo"
          flat
          round
          disable
          text-color="grey-5"
          size="12px"
        />

        <q-btn
          icon="r_redo"
          flat
          round
          disable
          text-color="grey-5"
          size="12px"
        />
      </div>

      <q-space />

      <div v-if="presentation" class="row no-wrap items-center">
        <div class="row no-wrap q-gutter-xs">
          <!-- save -->
          <q-btn
            flat
            no-caps
            no-wrap
            round
            size="12px"
            :loading="isSaving"
            :color="isSavingError ? 'negative' : 'positive'"
            :icon="isSavingError ? 'r_report' : 'r_check_circle'"
            @click="
              canvasStore.saveSlidePreview();
              presentationsStore.saveSlide(undefined, elements);
            "
          >
            <template v-slot:loading>
              <q-spinner-ios color="grey-4" size="24px" />
            </template>

            <q-tooltip>
              {{
                isSavingError
                  ? $t("presentationLayout.errors.somethingWentWrong")
                  : date.formatDate(
                      lastSavedAt || new Date(presentation.updated_at),
                      "DD.MM.YYYY HH:mm"
                    )
              }}
            </q-tooltip>
          </q-btn>

          <!-- share -->
          <q-btn
            color="dark"
            flat
            no-caps
            no-wrap
            round
            size="12px"
            icon="r_share"
            @click="showShareDialog = true"
          />

          <q-dialog v-model="showShareDialog">
            <PresentationStudioLayoutHeaderShareDialog
              @cancel="showShareDialog = false"
            />
          </q-dialog>

          <!-- download -->
          <q-btn
            color="dark"
            flat
            no-caps
            no-wrap
            round
            disable
            size="12px"
            icon="r_downloading"
          />

          <!-- settings -->
          <q-btn
            color="dark"
            flat
            no-caps
            no-wrap
            round
            size="12px"
            icon="r_settings"
            @click="showSettingsDialog = true"
          />

          <q-dialog v-model="showSettingsDialog" position="right">
            <PresentationSettings
              @cancel="showSettingsDialog = false"
              class="q-mr-md"
              style="height: calc(100vh - 24px - 66px - 24px); margin-top: 66px"
            />
          </q-dialog>
        </div>

        <!-- preview -->
        <q-btn
          color="primary"
          outline
          no-caps
          no-wrap
          :label="$t('presentationLayout.header.preview')"
          class="text-semibold q-ml-sm"
          @click="isPresentationPreview = true"
        />

        <q-dialog v-model="isPresentationPreview">
          <PresentationStudioPreviewPresentation
            @cancel="isPresentationPreview = false"
          />
        </q-dialog>

        <!-- room -->
        <q-btn-dropdown
          split
          no-caps
          color="primary"
          unelevated
          :label="$t('presentationLayout.header.present.title')"
          :menu-offset="[0, 8]"
          content-class="shadow"
          style="z-index: 2"
          class="q-ml-sm"
          icon="r_play_arrow"
          @click="
            startPresentingFromSlide = slide;
            handleStartPresenting();
          "
          @before-show="showStartPresentingOptionsMenu = true"
          @before-hide="showStartPresentingOptionsMenu = false"
        >
          <q-list class="present_btn__menu__list">
            <!-- present now -->
            <q-item
              clickable
              v-close-popup
              class="q-pa-md"
              @click="
                startPresentingFromSlide = slide;
                handleStartPresenting();
              "
            >
              <q-item-section>
                <q-item-label>
                  {{ $t("presentationLayout.header.present.now.title") }}
                </q-item-label>
                <q-item-label caption>
                  {{ $t("presentationLayout.header.present.now.description") }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <!-- present from beginning -->
            <template v-if="slideIndex > 0">
              <q-item
                clickable
                v-close-popup
                class="q-pa-md"
                @click="
                  startPresentingFromSlide = presentation.slides[0];
                  handleStartPresenting();
                "
              >
                <q-item-section>
                  <q-item-label>
                    {{
                      $t(
                        "presentationLayout.header.present.fromBeginning.title"
                      )
                    }}
                  </q-item-label>
                  <q-item-label caption>
                    {{
                      $t(
                        "presentationLayout.header.present.fromBeginning.description"
                      )
                    }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />
            </template>

            <!-- present with backstage -->
            <q-item clickable disable v-close-popup class="q-pa-md">
              <q-item-section>
                <q-item-label>
                  <span>
                    {{
                      $t(
                        "presentationLayout.header.present.withBackstage.title"
                      )
                    }}
                  </span>
                  <q-badge color="dark" rounded class="text-grey-3 q-ml-xs">
                    {{
                      $t("presentationLayout.header.present.withBackstage.beta")
                    }}
                  </q-badge>
                </q-item-label>
                <q-item-label caption>
                  {{
                    $t(
                      "presentationLayout.header.present.withBackstage.description"
                    )
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <!-- fullscreen -->
            <q-item class="q-pl-sm">
              <q-checkbox
                v-model="presentation.settings.is_fullscreen"
                size="sm"
                color="dark"
                disable
              >
                <template #default>
                  <div class="q-pl-xs text-dark">
                    {{ $t("presentationLayout.header.present.fullscreen") }}
                  </div>
                </template>
              </q-checkbox>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <div
            v-if="showStartPresentingOptionsMenu"
            class="start_presenting_options_menu__backdrop"
          ></div>
        </transition>

        <!-- confirm presenting in private -->
        <q-dialog v-model="showStartPresentingInPrivateConfirmationDialog">
          <ConfirmationDialog
            style="max-width: 500px"
            icon="r_visibility_off"
            icon-color="primary"
            :title="
              $t(
                'presentationLayout.header.present.privacySettingsWarning.title'
              )
            "
            :message="
              $t(
                'presentationLayout.header.present.privacySettingsWarning.message'
              )
            "
            cancel-btn-color="grey"
            :cancel-btn-text="
              $t(
                'presentationLayout.header.present.privacySettingsWarning.presentAnyway'
              )
            "
            confirm-btn-color="primary"
            :confirm-btn-text="
              $t(
                'presentationLayout.header.present.privacySettingsWarning.switchToPublic'
              )
            "
            @cancel="
              handleStartPresenting();
              showStartPresentingInPrivateConfirmationDialog = false;
            "
            @confirm="
              async () => {
                presentation.is_private = !presentation.is_private;
                await presentationsStore.updatePresentation();
                await handleStartPresenting();
                showStartPresentingInPrivateConfirmationDialog = false;
              }
            "
          />
        </q-dialog>

        <!-- confirm presenting without a correct answer in quiz slide -->
        <q-dialog v-model="showStartPresentingWithQuizWithoutCorrectAnswer">
          <ConfirmationDialog
            style="max-width: 500px"
            icon="r_rule"
            icon-color="primary"
            :title="
              $t('presentationLayout.header.present.quizSettingsWarning.title')
            "
            cancel-btn-color="grey"
            confirm-btn-color="primary"
            :confirm-btn-text="
              $t(
                'presentationLayout.header.present.quizSettingsWarning.presentAnyway'
              )
            "
            @cancel="
              async () => {
                await presentationsStore.updatePresentation();
                showStartPresentingWithQuizWithoutCorrectAnswer = false;
              }
            "
            @confirm="
              async () => {
                await handleStartPresenting();
                showStartPresentingWithQuizWithoutCorrectAnswer = false;
              }
            "
          >
            <template #default>
              <div class="column no-wrap q-gutterm-md text-center q-pb-md">
                <div
                  v-for="slide in quizSlidesWithoutCorrectAnswers"
                  :key="slide.index"
                >
                  <b>
                    {{
                      $t(
                        "presentationLayout.header.present.quizSettingsWarning.message"
                      )
                    }}
                    №{{ slide.index + 1 }}:
                  </b>
                  {{ slide.title }}
                </div>
              </div>

              <div class="column no-wrap q-pb-lg">
                <q-toggle
                  v-model="presentation.settings.quiz_warning_dismissed"
                  :label="
                    $t(
                      'presentationLayout.header.present.quizSettingsWarning.dismiss'
                    )
                  "
                  color="primary"
                />
              </div>
            </template>
          </ConfirmationDialog>
        </q-dialog>

        <!-- user -->
        <UserMenu is-avatar-only class="q-ml-xs" />
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { ROUTE_PATHS } from "src/constants/routes";
import UserMenu from "components/user/UserMenu.vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { date, useQuasar } from "quasar";
import { useCanvasStore } from "stores/canvas";
import { computed, ref } from "vue";
import PresentationSettings from "components/presentationStudio/settings/PresentationSettings.vue";
import PresentationStudioPreviewPresentation from "components/presentationStudio/preview/PresentationStudioPreview.vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { clearRoutePathFromProps } from "src/helpers/routeUtils";
import ConfirmationDialog from "components/dialogs/ConfirmationDialog.vue";
import PresentationStudioLayoutHeaderShareDialog from "components/layouts/presentation/studio/PresentationStudioLayoutHeaderShareDialog.vue";
import {
  SLIDE_TYPES,
  SLIDE_TYPES_OF_QUIZ,
} from "src/constants/presentationStudio";

/*
 * variables
 */
const router = useRouter();
const $q = useQuasar();

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const {
  slide,
  presentation,
  isSaving,
  isSavingError,
  lastSavedAt,
  isPresentationPreview,
  showSettingsDialog,
  showShareDialog,
} = storeToRefs(presentationsStore);

const canvasStore = useCanvasStore();
const { elements } = storeToRefs(canvasStore);

/*
 * slide index
 */
const slideIndex = computed(() => {
  return presentation.value.slides.findIndex(
    (item) => item.id === slide.value.id
  );
});

/*
 * room
 */
const showStartPresentingOptionsMenu = ref(false);
const showStartPresentingInPrivateConfirmationDialog = ref(false);
const showStartPresentingWithQuizWithoutCorrectAnswer = ref(false);
const quizSlidesWithoutCorrectAnswers = ref([]);

const startPresentingFromSlide = ref();

const handleStartPresenting = async () => {
  if (
    presentation.value.is_private &&
    !showStartPresentingInPrivateConfirmationDialog.value
  ) {
    showStartPresentingInPrivateConfirmationDialog.value = true;
    return;
  }

  await presentationsStore.syncCurrentSlideWithPresentationSlides();
  await presentationsStore.saveSlide(slide.value, elements.value);
  await presentationsStore.updatePresentation();

  /*
   * check presentation slides for correct answers existence
   */
  if (
    !presentation.value.settings.quiz_warning_dismissed &&
    !showStartPresentingWithQuizWithoutCorrectAnswer.value
  ) {
    quizSlidesWithoutCorrectAnswers.value = [];

    presentation.value.slides.map((slide, slideIndex) => {
      if (SLIDE_TYPES_OF_QUIZ.includes(slide.type)) {
        const slideSettings = slide.settings_data
          ? JSON.parse(slide.settings_data)
          : {};

        if (
          ([SLIDE_TYPES.PICK_ANSWER, SLIDE_TYPES.PICK_IMAGE].includes(
            slide.type
          ) &&
            slideSettings?.answerOptions &&
            !slideSettings.answerOptions.filter((option) => option.isCorrect)
              .length) ||
          ([SLIDE_TYPES.TYPE_ANSWER].includes(slide.type) &&
            slideSettings?.correctAnswer &&
            !slideSettings.correctAnswer.value.length)
        ) {
          quizSlidesWithoutCorrectAnswers.value.push({
            index: slideIndex,
            title: JSON.parse(slide.canvas_data)?.find((element) =>
              element.id.includes("-title-top-")
            )?.text,
          });
        }
      }
    });

    if (quizSlidesWithoutCorrectAnswers.value.length) {
      presentation.value.settings.quiz_warning_dismissed = Boolean(
        presentation.value.settings.quiz_warning_dismissed
      );
      showStartPresentingWithQuizWithoutCorrectAnswer.value = true;
      return;
    }
  }

  // if (presentation.value.settings.is_fullscreen) {
  //   await document.documentElement.requestFullscreen();
  // }

  if (!presentation.value?.room?.token) {
    await createPresentationRoom();
  }

  await presentationsStore.updateRoom(undefined, presentation.value.room.id, {
    slide_id: startPresentingFromSlide.value.id,
    disableNotification: true,
  });
  openPresentationRoom();
};

const openPresentationRoom = () => {
  if (!presentation.value?.room?.token) return;

  window.location =
    clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_ROOM) +
    presentation.value?.room?.token;
};

const createPresentationRoom = async () => {
  return await api
    .post(`/presentation/${presentation.value.id}/room`)
    .then((response) => {
      presentation.value.room = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
</script>

<style scoped lang="scss">
::v-deep(.q-btn-group) {
  .q-btn__content {
    font-weight: 600;
  }

  .q-btn:first-child {
    padding-left: 12px;

    i {
      margin-right: 8px;
    }
  }
}

.present_btn__menu__list {
  .q-item:nth-child(1) {
    border-radius: 8px 8px 0 0;
  }
  .q-item:nth-child(3),
  .q-item:nth-child(5) {
    border-radius: 0 0;
  }

  .q-item:nth-child(7) {
    border-radius: 0 0 8px 8px;
  }
}

.start_presenting_options_menu__backdrop {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}
</style>
