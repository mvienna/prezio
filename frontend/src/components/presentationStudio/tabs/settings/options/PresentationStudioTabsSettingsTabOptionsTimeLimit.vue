<template>
  <div>
    <div class="row no-wrap items-center justify-between text-semibold">
      <span>
        {{ $t("presentationLayout.rightDrawer.tabs.settings.timeLimit.title") }}

        <q-icon name="r_info" class="q-ml-xs" color="grey-8">
          <q-tooltip class="text-center" max-width="200px" :offset="[0, 8]">
            {{
              $t(
                "presentationLayout.rightDrawer.tabs.settings.timeLimit.description"
              )
            }}
          </q-tooltip>
        </q-icon>
      </span>

      <q-toggle
        v-if="[SLIDE_TYPES.WORD_CLOUD].includes(slide?.type)"
        v-model="slideSettings.isLimitedTime"
        color="primary"
        @update:model-value="
          () => {
            if (isTimeLimitValid(Number(slideSettings.timeLimit))) {
              $emit('updateSlideSettings');
            }
          }
        "
      />
    </div>

    <q-slide-transition>
      <div v-if="slideSettings.isLimitedTime">
        <q-input
          v-model="slideSettings.timeLimit"
          type="number"
          outlined
          dense
          :min="5"
          :max="1800"
          placeholder="1"
          hide-bottom-space
          :rules="timeLimitRules"
          style="width: 160px"
          no-error-icon
          class="q-pb-sm"
          :class="
            ![SLIDE_TYPES.WORD_CLOUD].includes(slide?.type) ? 'q-mt-sm' : ''
          "
          @update:model-value="
            () => {
              if (isTimeLimitValid(Number(slideSettings.timeLimit))) {
                $emit('updateSlideSettings');
              }
            }
          "
        >
          <template #prepend>
            <q-icon name="r_timer" color="black" class="q-mr-xs" />
          </template>

          <template #append>
            <div class="text-caption">
              {{
                $t(
                  "presentationLayout.rightDrawer.tabs.settings.timeLimit.seconds"
                )
              }}
            </div>
          </template>
        </q-input>
      </div>
    </q-slide-transition>
  </div>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { SLIDE_TYPES } from "src/constants/presentationStudio";
import { useI18n } from "vue-i18n";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * emits
 */
defineEmits(["updateSlideSettings"]);

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { slideSettings, slide } = storeToRefs(presentationsStore);

/*
 * rules
 */
const timeLimitRules = [
  (val) =>
    isTimeLimitValid(val) ||
    t("presentationLayout.rightDrawer.tabs.settings.timeLimit.invalid"),
];

const isTimeLimitValid = (val) => {
  return val >= 5 && val <= 1800;
};
</script>
