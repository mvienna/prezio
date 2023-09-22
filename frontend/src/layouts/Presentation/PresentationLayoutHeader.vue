<template>
  <q-header class="bg-white q-pa-sm" elevated>
    <q-toolbar>
      <!-- logo -->
      <q-btn
        unelevated
        round
        :to="ROUTE_PATHS.PRESENTATIONS.INDEX"
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
              presentationStore.updatePresentation();
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
            presentationStore.updatePresentation();
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
            {{ $t("presentations.errors.somethingWentWrong") }}
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
            presentationStore.saveSlide(undefined, elements);
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
          disable
          no-wrap
          :label="$t('presentationLayout.header.preview')"
          class="text-semibold"
        />

        <!-- run -->
        <q-btn
          color="primary"
          unelevated
          no-caps
          disable
          no-wrap
          icon-right="r_play_arrow"
          :label="$t('presentationLayout.header.run')"
          class="text-semibold"
        />

        <!-- user -->
        <UserMenu is-avatar-only />
      </div>
    </q-toolbar>

    <q-dialog v-model="showSettingsDialog" position="right">
      <PresentationSettings @close="showSettingsDialog = false" />
    </q-dialog>
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
import PresentationSettings from "components/presentation/settings/PresentationSettings.vue";

/*
 * stores
 */
const presentationStore = usePresentationsStore();
const { presentation, isSaving, isSavingError, lastSavedAt } =
  storeToRefs(presentationStore);

const canvasStore = useCanvasStore();
const { elements } = storeToRefs(canvasStore);

/*
 * dialogs
 */
const showSettingsDialog = ref(false);
</script>

<style lang="scss">
.q-dialog__inner {
  padding: calc(66px + 24px) 24px 24px 24px !important;
}
</style>
