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
            }.title`
          )
        }}
      </div>

      <div class="types_grid q-mt-sm">
        <!-- TODO: use slide type to detect active type - :active="type.name === 'free'" -->
        <q-item
          v-for="type in typesGroup"
          :key="type.name"
          class="type q-pa-sm"
          :disable="type.disable"
          clickable
          :active="type.name === 'free'"
          @click="$emit('select')"
        >
          <div class="row justify-center">
            <q-img :src="`/assets/icons/temp/slideTypes/${type.name}.svg`" />
          </div>

          <div class="text-center text-caption q-mt-sm ellipsis">
            {{ type.label }}
          </div>
        </q-item>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

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
 * types
 */
const types = {
  /*
   * content
   */
  content: [
    {
      name: "free",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.content.free"
      ),
    },
    {
      name: "qr",
      label: t("presentationLayout.rightDrawer.tabs.types.options.content.qr"),
      disable: true,
    },
    {
      name: "video",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.content.video"
      ),
      disable: true,
    },
  ],

  /*
   * quizzes & games
   */
  quizzesAndGames: [
    {
      name: "pickAnswer",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.quizzesAndGames.pickAnswer"
      ),
      disable: true,
    },
    {
      name: "pickImage",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.quizzesAndGames.pickImage"
      ),
      disable: true,
    },
    {
      name: "typeAnswer",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.quizzesAndGames.typeAnswer"
      ),
      disable: true,
    },
    {
      name: "spinnerWheel",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.quizzesAndGames.spinnerWheel"
      ),
      disable: true,
    },
    {
      name: "matchPairs",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.quizzesAndGames.matchPairs"
      ),
      disable: true,
    },
    {
      name: "correctOrder",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.quizzesAndGames.correctOrder"
      ),
      disable: true,
    },
  ],

  /*
   * user answers
   */
  userAnswer: [
    {
      name: "poll",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.userAnswer.poll"
      ),
      disable: true,
    },
    {
      name: "openEnded",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.userAnswer.openEnded"
      ),
      disable: true,
    },
    {
      name: "wordCloud",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.userAnswer.wordCloud"
      ),
      disable: true,
    },
    {
      name: "scales",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.userAnswer.scales"
      ),
      disable: true,
    },
    {
      name: "questionsAndAnswers",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.userAnswer.questionsAndAnswers"
      ),
      disable: true,
    },
    {
      name: "brainStorm",
      label: t(
        "presentationLayout.rightDrawer.tabs.types.options.userAnswer.brainStorm"
      ),
      disable: true,
    },
  ],
};
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
