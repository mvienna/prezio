<template>
  <q-header class="bg-white q-pa-sm" elevated>
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

      <!-- undo / redo -->
      <div class="row no-wrap items-center q-gutter-sm q-px-lg">
        <q-btn
          icon="r_undo"
          unelevated
          round
          disable
          text-color="grey-5"
          size="12px"
          class="q-btn--bordered"
        />

        <q-btn
          icon="r_redo"
          unelevated
          round
          disable
          text-color="grey-5"
          size="12px"
          class="q-btn--bordered"
        />
      </div>

      <div v-if="presentation" class="text-h6 text-semibold text-black">
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
        <q-icon
          :name="presentation?.is_private ? 'r_visibility_off' : 'r_visibility'"
          color="grey-5"
          class="q-ml-sm cursor-pointer"
          @click="
            presentation.is_private = !presentation.is_private;
            presentationsStore.updatePresentation();
          "
        >
        </q-icon>
      </div>

      <q-space />

      <div v-if="presentation" class="row no-wrap items-center q-gutter-md">
        <!-- saving presentation -->
        <q-spinner-ios v-if="isSaving" color="grey-4" size="24px" />

        <!-- saving presentation error -->
        <q-icon
          v-else-if="isSavingError"
          name="r_report"
          color="red"
          size="24px"
        >
          <q-tooltip class="text-red bg-red-1 text-center">
            {{ $t("presentationLayout.errors.somethingWentWrong") }}
          </q-tooltip>
        </q-icon>

        <!-- presentation is saved -->
        <q-icon
          v-else
          name="r_save"
          color="grey-4"
          size="24px"
          class="cursor-pointer"
          @click="
            canvasStore.saveSlidePreview();
            presentationsStore.saveSlide(undefined, elements);
          "
        >
          <q-tooltip>
            {{
              date.formatDate(
                lastSavedAt || new Date(presentation.updated_at),
                "DD.MM.YYYY HH:mm"
              )
            }}
          </q-tooltip>
        </q-icon>

        <!-- share -->
        <q-btn
          text-color="grey-5"
          unelevated
          no-caps
          no-wrap
          round
          disable
          size="12px"
          icon="r_share"
          class="q-btn--bordered"
        />

        <!-- settings -->
        <q-btn
          text-color="grey-5"
          unelevated
          no-caps
          no-wrap
          round
          size="12px"
          icon="r_settings"
          class="q-btn--bordered"
          @click="showSettingsDialog = true"
        />

        <q-dialog v-model="showSettingsDialog" position="right">
          <PresentationSettings
            @cancel="showSettingsDialog = false"
            class="q-mr-md"
            style="height: calc(100vh - 24px - 66px - 24px); margin-top: 66px"
          />
        </q-dialog>

        <!-- download -->
        <q-btn
          text-color="grey-5"
          unelevated
          no-caps
          no-wrap
          round
          disable
          size="12px"
          icon="r_downloading"
          class="q-btn--bordered"
        />

        <!-- preview -->
        <q-btn
          color="primary"
          outline
          no-caps
          no-wrap
          :label="$t('presentationLayout.header.preview')"
          class="text-semibold"
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
          @click="handleStartPresenting()"
          @before-show="showStartPresentingOptionsMenu = true"
          @before-hide="showStartPresentingOptionsMenu = false"
        >
          <q-list class="present_btn__menu__list">
            <!-- present now -->
            <q-item
              clickable
              v-close-popup
              class="q-pa-md"
              @click="handleStartPresenting()"
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
                @click="handleStartPresenting(presentation.slides[0])"
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
              <q-checkbox v-model="isFullscreen" size="sm" color="dark">
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

        <!-- user -->
        <UserMenu is-avatar-only />
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { ROUTE_PATHS } from "src/constants/routes";
import UserMenu from "components/user/UserMenu.vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { date } from "quasar";
import { useCanvasStore } from "stores/canvas";
import { computed, ref } from "vue";
import PresentationSettings from "components/presentationStudio/settings/PresentationSettings.vue";
import PresentationStudioPreviewPresentation from "components/presentationStudio/preview/PresentationStudioPreview.vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { clearRoutePathFromProps } from "src/helpers/routeUtils";

/*
 * variables
 */
const router = useRouter();

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
} = storeToRefs(presentationsStore);

const canvasStore = useCanvasStore();
const { elements } = storeToRefs(canvasStore);

/*
 * dialogs
 */
const showSettingsDialog = ref(false);

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
const isFullscreen = ref(true);

const handleStartPresenting = async (startSlide = slide.value) => {
  await presentationsStore.saveSlide(slide.value, elements.value);

  if (isFullscreen.value) {
    await document.documentElement.requestFullscreen();
  }

  if (!presentation.value?.room?.token) {
    await createPresentationRoom();
  }

  await presentationsStore.sendPresentationRoomUpdateEvent(
    undefined,
    presentation.value.room.id,
    startSlide.id
  );
  openPresentationRoom();
};

const openPresentationRoom = () => {
  if (!presentation.value?.room?.token) return;

  router.push(
    clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_ROOM) +
      presentation.value?.room?.token
  );
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
  left: -16px;
  top: -16px;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}
</style>
