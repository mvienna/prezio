<template>
  <div class="container__wrapper">
    <div
      class="container"
      :class="
        averageBackgroundBrightness >= backgroundBrightnessThreshold
          ? 'container--black'
          : 'container--white'
      "
    >
      <q-form @submit.prevent="submit()">
        <!-- title -->
        <div class="form__title q-mb-md">
          {{ $t("presentationRoom.auth.form.title") }}
        </div>

        <!-- avatar & username -->
        <q-input
          v-model="form.name"
          type="text"
          :label="$t('presentationRoom.auth.form.name')"
          borderless
          maxlength="25"
          hide-bottom-space
          :error-message="$t('presentationRoom.auth.form.fieldIsRequired')"
          :error="isNameError"
          lazy-rules
          style="width: 100%"
        >
          <template #prepend>
            <q-btn flat round>
              <div style="font-size: 24px">{{ form?.avatar }}</div>

              <q-menu
                transition-show="jump-down"
                transition-hide="jump-up"
                style="border-radius: 16px"
              >
                <EmojiPicker
                  :native="true"
                  theme="light"
                  :offset="16"
                  :static-texts="{
                    placeholder: $t('emoji.searchPlaceholder'),
                    skinTone: $t('emoji.skinTone'),
                  }"
                  :group-names="{
                    smileys_people: $t('emoji.smileys_people'),
                    animals_nature: $t('emoji.animals_nature'),
                    food_drink: $t('emoji.food_drink'),
                    activities: $t('emoji.activities'),
                    travel_places: $t('emoji.travel_places'),
                    objects: $t('emoji.objects'),
                    symbols: $t('emoji.symbols'),
                    flags: $t('emoji.flags'),
                  }"
                  @select="handleEmojiSelection"
                />
              </q-menu>
            </q-btn>
          </template>

          <template #append>
            <div class="text-caption text-grey">
              {{ 25 - (form.name?.length || 0) }}
            </div>
          </template>
        </q-input>

        <!-- submit -->
        <q-btn
          text-color="white"
          unelevated
          color="primary"
          no-caps
          type="submit"
          class="q-py-md text-bold q-mt-lg full-width"
          :label="$t('presentationRoom.auth.form.submit')"
          icon-right="r_sports_esports"
          style="z-index: 2"
        />
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";
import { useI18n } from "vue-i18n";
import { api } from "boot/axios";

/*
 * variables
 */
const router = useRouter();

const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const {
  participant,
  averageBackgroundBrightness,
  backgroundBrightnessThreshold,
} = storeToRefs(presentationsStore);

/*
 * logo
 */
const logo = computed(() => {
  return averageBackgroundBrightness.value >=
    backgroundBrightnessThreshold.value
    ? "/logo_with_title_black.png"
    : "/logo_white_with_title_white.png";
});

/*
 * form
 */
const form = ref({});
const isNameError = ref(false);

const defaultEmojis = [
  "😀",
  "😁",
  "😃",
  "😄",
  "😉",
  "😊",
  "😋",
  "😍",
  "😎",
  "🤔",
  "🤩",
  "🤗",
  "🙂",
  "☺️",
  "😚",
  "😶",
  "😏",
  "🤐",
  "😝",
  "😜",
  "😛",
  "😌",
  "😴",
  "🤤",
  "😓",
  "😔",
  "🙃",
  "🤑",
  "😤",
  "🤯",
  "😬",
  "😱",
  "🤪",
  "😳",
  "😇",
  "🤠",
  "🤫",
  "🤭",
  "🧐",
  "🤓",
  "👽",
  "🙈",
  "🙉",
  "🙊",
];

onMounted(() => {
  const user_data = JSON.parse(participant.value.user_data);

  form.value = {
    name: user_data[0].name,
    avatar: defaultEmojis[Math.floor(Math.random() * defaultEmojis.length)],
  };
});

/*
 * emojis
 */
const handleEmojiSelection = (emoji) => {
  // {
  //     i: "😚",
  //     n: ["kissing face"],
  //     r: "1f61a", // with skin tone
  //     t: "neutral", // skin tone
  //     u: "1f61a" // without tone
  // }

  form.value.avatar = emoji.i;
};

/*
 * submit
 */
const submit = async () => {
  console.log(form.value.name);
  if (!form.value.name?.length) {
    isNameError.value = true;
    return;
  }

  console.log(participant.value?.user_data);
  const data = participant.value?.user_data
    ? JSON.parse(participant.value.user_data)
    : {};

  await api
    .patch("/user/room", {
      user_data: JSON.stringify({
        ...data,
        name: form.value.name,
        avatar: form.value.avatar,
      }),
    })
    .then(() => {
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
};
</script>

<style scoped lang="scss">
.container__wrapper {
  .container {
    max-width: 500px;
    width: 100%;
  }

  form {
    .form__title {
      text-align: center;
      font-size: 20px;
      font-weight: 600;
    }
  }
}

::v-deep(.q-field__control) {
  border-radius: 8px;
  padding: 0 16px;

  .q-btn {
    background: transparent !important;
    backdrop-filter: none !important;
  }
}

::v-deep(.container--black) {
  form {
    .form__title {
      color: $black;
    }
  }

  .q-field__control {
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(4px);
    color: $black;
  }

  .q-btn {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
  }
}

::v-deep(.container--white) {
  form {
    .form__title {
      color: $white;
    }
  }

  .q-field__control {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
    color: $white;
  }

  .q-field__native {
    color: $white;
  }

  .q-field__label {
    color: rgba(255, 255, 255, 0.5);
  }

  .q-btn {
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(4px);
  }
}

::v-deep(.q-field__marginal) {
  color: white;
}

@media screen and (max-width: 600px) {
  .container__wrapper {
    .container {
      max-width: 100%;
    }

    form {
      border: none;
    }
  }
}

::v-deep(.v3-sticky) {
  font-size: 16px !important;
}

.v3-emoji-picker {
  height: 400px !important;
}

::v-deep(.v3-spacing) {
  height: 16px !important;
}

::v-deep(.v3-tone) {
  .v3-icon {
    border-radius: 4px !important;
  }
}

::v-deep(.v3-skin-tones) {
  .v3-skin-tone:first-child {
    border-radius: 4px 0 0 4px !important;
  }
  .v3-skin-tone:last-child {
    border-radius: 0 4px 4px 0 !important;
  }
}

::v-deep(.v3-body-inner) {
  h5 {
    top: -1px !important;
  }
}

::v-deep(.v3-emojis) {
  button {
    border-radius: 8px !important;
  }
}
</style>
