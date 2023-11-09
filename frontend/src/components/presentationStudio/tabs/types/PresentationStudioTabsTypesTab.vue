<template>
  <div>
    <div
      v-for="(typesGroup, index) in Object.values(types)"
      :key="index"
      :class="index !== 0 ? 'q-mt-lg' : ''"
    >
      <div class="text-grey">
        {{
          $t(
            `presentationLayout.rightDrawer.tabs.types.options.${
              Object.keys(types)[index]
            }`
          )
        }}
      </div>

      <div class="types_grid q-mt-sm">
        <q-item
          v-for="type in typesGroup"
          :key="type.name"
          class="type q-pa-sm"
          :disable="type.disable"
          clickable
          :active="type.name === slide?.type"
          @click="$emit('select', type.name)"
        >
          <div class="row justify-center">
            <q-img :src="`/assets/icons/temp/slideTypes/${type.name}.svg`" />
          </div>

          <div class="text-center text-caption q-mt-sm ellipsis">
            {{
              $t(
                `presentationLayout.rightDrawer.tabs.types.options.${type.name}`
              )
            }}
          </div>

          <q-tooltip
            v-if="type.name === SLIDE_TYPES.LEADERBOARD && type.disable"
          >
            {{
              $t("presentationLayout.rightDrawer.tabs.types.leaderboard.tip")
            }}
          </q-tooltip>
        </q-item>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import {
  SLIDE_TYPES,
  SLIDE_TYPES_OF_QUIZ,
} from "src/constants/presentationStudio";
import { computed } from "vue";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

defineProps({
  disableLayoutSelection: { type: Boolean },
});

/*
 * emits
 */
defineEmits(["select"]);

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { slide, presentation } = storeToRefs(presentationsStore);

/*
 * types
 */
const types = computed(() => {
  return {
    /*
     * content
     */
    content: [
      {
        name: SLIDE_TYPES.CONTENT,
      },
      {
        name: SLIDE_TYPES.QR,
        disable: true,
      },
      {
        name: SLIDE_TYPES.VIDEO,
        disable: true,
      },
    ],

    /*
     * quizzes & games
     */
    quizzesAndGames: [
      {
        name: SLIDE_TYPES.PICK_ANSWER,
      },
      {
        name: SLIDE_TYPES.PICK_IMAGE,
        disable: true,
      },
      {
        name: SLIDE_TYPES.TYPE_ANSWER,
        disable: true,
      },
      {
        name: SLIDE_TYPES.SPINNER_WHEEL,
        disable: true,
      },
      {
        name: SLIDE_TYPES.MATCH_PAIRS,
        disable: true,
      },
      {
        name: SLIDE_TYPES.CORRECT_ORDER,
        disable: true,
      },
      {
        name: SLIDE_TYPES.LEADERBOARD,
        disable: !presentation.value?.slides?.filter((item) =>
          SLIDE_TYPES_OF_QUIZ.includes(item.type)
        )?.length,
      },
    ],

    /*
     * opinion & qna
     */
    userAnswer: [
      {
        name: SLIDE_TYPES.POLL,
        disable: true,
      },
      {
        name: SLIDE_TYPES.OPEN_ENDED,
        disable: true,
      },
      {
        name: SLIDE_TYPES.WORD_CLOUD,
      },
      {
        name: SLIDE_TYPES.SCALES,
        disable: true,
      },
      {
        name: SLIDE_TYPES.QNA,
        disable: true,
      },
      {
        name: SLIDE_TYPES.BRAIN_STORM,
        disable: true,
      },
    ],
  };
});
</script>

<style scoped lang="scss">
.types_grid {
  display: flex;
  flex-wrap: wrap;
  columns: 3;
  gap: 8px;

  .item:nth-last-child(-n + 3) {
    margin-bottom: 0;
  }
}

.type {
  max-width: 117px;
  width: 100%;
  display: inline-block;
  cursor: pointer;
  transition: 0.2s;
  border-radius: 8px;
  border: 1.5px solid $grey-2;
  outline: 3px solid transparent;

  &:hover {
    outline: 3px solid $blue-2;
  }

  .q-img {
    width: 36px;
    height: 36px;
  }

  &.type--active {
    color: $black;

    .q-img {
      border: 1.5px solid $primary;
      outline: 3px solid $blue-2;
    }
  }
}
</style>
