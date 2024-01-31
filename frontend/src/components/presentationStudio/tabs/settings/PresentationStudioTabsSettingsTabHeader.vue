<template>
  <div>
    <!-- title -->
    <div class="row no-wrap items-center text-semibold">
      <div>
        {{
          slide?.type === SLIDE_TYPES.LEADERBOARD
            ? $t("presentationLayout.rightDrawer.tabs.settings.info.title")
            : $t("presentationLayout.rightDrawer.tabs.settings.info.question")
        }}
      </div>
      <q-icon name="r_help" color="grey-9" class="q-ml-sm" />
    </div>

    <!-- question -->
    <q-input
      v-model="question"
      outlined
      dense
      class="q-mt-sm"
      debounce="500"
      @update:model-value="title.text(question)"
    >
      <template #append>
        <!-- length -->
        <div class="text-12 q-mr-xs">{{ 250 - question?.length }}</div>

        <!-- alignment -->
        <q-btn
          flat
          round
          size="10px"
          color="black"
          :icon="
            title?.align() === 'left'
              ? 'r_format_align_left'
              : title?.align() === 'center'
                ? 'r_format_align_center'
                : title?.align() === 'right'
                  ? 'r_format_align_right'
                  : 'r_format_align_left'
          "
        >
          <q-menu
            anchor="bottom middle"
            self="top middle"
            transition-show="jump-down"
            transition-hide="jump-up"
            style="border: 1px solid #13123a4c"
            class="no-padding"
          >
            <q-btn-group outline>
              <!-- align left -->
              <q-btn
                unelevated
                :text-color="title?.align() === 'left' ? 'dark' : 'grey'"
                :color="title?.align() === 'left' ? 'grey-4' : 'grey-1'"
                icon="r_format_align_left"
                size="10px"
                round
                @click="title.align('left')"
              />

              <!-- align center -->
              <q-btn
                unelevated
                :text-color="title?.align() === 'center' ? 'dark' : 'grey'"
                :color="title?.align() === 'center' ? 'grey-4' : 'grey-1'"
                icon="r_format_align_center"
                size="10px"
                round
                @click="title.align('center')"
              />

              <!-- align right -->
              <q-btn
                unelevated
                :text-color="title?.align() === 'right' ? 'dark' : 'grey'"
                :color="title?.align() === 'right' ? 'grey-4' : 'grey-1'"
                icon="r_format_align_right"
                size="10px"
                round
                @click="title.align('right')"
              />
            </q-btn-group>
          </q-menu>
        </q-btn>
      </template>
    </q-input>

    <!-- description -->
    <q-expansion-item
      v-if="slide?.type !== SLIDE_TYPES.LEADERBOARD"
      class="q-mt-md q-mb-lg text-primary"
    >
      <template #header>
        <div class="row no-wrap items-center">
          <div class="q-item__label link">
            {{
              $t(
                "presentationLayout.rightDrawer.tabs.settings.info.description.label",
              )
            }}
          </div>
        </div>

        <q-space />
      </template>

      <div class="text-black q-mt-sm">
        {{
          $t(
            "presentationLayout.rightDrawer.tabs.settings.info.description.title",
          )
        }}
      </div>
      <div class="text-grey text-caption q-mt-xs">
        {{
          $t(
            "presentationLayout.rightDrawer.tabs.settings.info.description.caption",
          )
        }}
      </div>

      <q-input
        v-model="slideSettings.description"
        :placeholder="
          $t(
            'presentationLayout.rightDrawer.tabs.settings.info.description.placeholder',
          )
        "
        outlined
        dense
        autogrow
        :rows="4"
        class="q-mt-md"
        debounce="1000"
        @update:model-value="$emit('updateSlideSettings')"
      />
    </q-expansion-item>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import { useI18n } from "vue-i18n";
import { SLIDE_TYPES } from "src/constants/presentationStudio";
import { useStudioStore } from "stores/studio";

/*
 * emits
 */
defineEmits(["updateSlideSettings"]);

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const studioStore = useStudioStore();
const { MODE_OPTIONS, layers } = storeToRefs(studioStore);

const presentationsStore = usePresentationsStore();
const { slide, slideSettings } = storeToRefs(presentationsStore);

/*
 * layout title (question)
 */
const question = ref();

const title = computed(() => {
  return layers.value.default?.findOne(MODE_OPTIONS.value.TEXT);
});

watch(
  () => title.value,
  () => {
    question.value = title.value?.text();
  },
  { deep: true },
);

onBeforeMount(() => {
  question.value = title.value?.text();
});
</script>

<style scoped lang="scss">
::v-deep(.q-btn-group) {
  border: 1px solid $grey;
}

::v-deep(.q-expansion-item) {
  .q-item {
    padding: 0 0;
    min-height: 24px;

    &:hover {
      .q-item__label {
        text-decoration: underline;
      }
    }

    .q-focus-helper {
      display: none;
    }
  }
}

::v-deep(.q-textarea .q-field__control),
::v-deep(.q-textarea .q-field__native) {
  min-height: 100px !important;
}
</style>
