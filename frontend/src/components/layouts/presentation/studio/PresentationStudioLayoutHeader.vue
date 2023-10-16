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
        <q-btn
          v-if="!presentation?.room"
          color="primary"
          unelevated
          no-caps
          no-wrap
          icon-right="r_play_arrow"
          :label="$t('presentationLayout.header.run')"
          class="text-semibold"
          @click="handleCreatingPresentationRoom()"
        />

        <q-btn
          v-else
          color="green"
          unelevated
          no-caps
          no-wrap
          :to="
            clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_ROOM) +
            presentation.room.token
          "
          :label="$t('presentationLayout.header.open')"
          icon-right="r_wifi_tethering"
          class="text-semibold"
          @click="openInFullscreen()"
        />

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
import { ref } from "vue";
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
 * room
 */
const handleCreatingPresentationRoom = () => {
  api
    .post(`/presentation/${presentation.value.id}/room`)
    .then((response) => {
      router.push(
        clearRoutePathFromProps(ROUTE_PATHS.PRESENTATION_ROOM) +
          response.data.token
      );

      openInFullscreen();
    })
    .catch((error) => {
      console.log(error);
    });
};

const openInFullscreen = () => {
  document.documentElement.requestFullscreen();
};
</script>

<style scoped lang="scss">
.pulsing_circle {
  position: relative;
  width: 10px;
  height: 10px;
  background-color: $white;
  border-radius: 50%;
  animation: pulse 1s infinite alternate;
}

.pulsing_circle::before,
.pulsing_circle::after {
  content: "";
  position: absolute;
  width: inherit;
  height: inherit;
  border-radius: inherit;
  animation: inherit;
}

.pulsing_circle::before {
  animation-delay: 0.5s;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.8);
  }
}
</style>
