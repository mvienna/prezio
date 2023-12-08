<template>
  <div class="container__wrapper q-mt-lg">
    <div
      class="container"
      :class="
        averageBackgroundBrightness >= backgroundBrightnessThreshold
          ? 'container--black'
          : 'container--white'
      "
    >
      <q-form @submit.prevent="submit()">
        <!-- logo -->
        <div class="row justify-center q-mb-lg">
          <div style="width: 96px">
            <q-img :src="logo" style="height: 48px" fit="contain" />
          </div>
        </div>

        <!-- title -->
        <div
          v-if="presentation?.settings?.participants_info_form_title"
          class="form__title q-mb-md"
        >
          {{ presentation?.settings?.participants_info_form_title }}
        </div>

        <!-- fields -->
        <div class="column q-gutter-md">
          <template
            v-for="field in fields.filter((item) => item?.type)"
            :key="field.id"
          >
            <q-input
              v-model="field.value"
              :type="field.type"
              :label="field.label"
              outlined
            >
              <template #prepend>
                <q-icon v-if="field.isMandatory" name="r_emergency" />
              </template>
            </q-input>
          </template>

          <!-- submit -->
          <q-btn
            color="primary"
            unelevated
            no-caps
            type="submit"
            class="q-py-md text-bold q-mt-lg"
            :label="$t('presentationRoom.auth.form.submit')"
            icon-right="r_waving_hand"
            style="z-index: 2"
            :disable="!isValid"
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios";

/*
 * variables
 */
const router = useRouter();

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const {
  participant,
  room,
  presentation,
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
const fields = ref([]);

onMounted(() => {
  const participantData = participant.value
    ? JSON.parse(participant.value.user_data)
    : {};
  let participantFields = [];
  Object.keys(participantData).forEach((key) => {
    participantFields.push({
      name: key,
      value: participantData[key],
    });
  });

  const requiredFields = JSON.parse(
    presentation.value?.settings?.participants_info_form_fields_data
  ).map((field) => {
    const filledField = participantFields.find(
      (item) => item.name === field.name
    );
    if (filledField) {
      field.value = filledField.value;
    }

    return field;
  });

  fields.value = [...participantFields, ...requiredFields];
});

const isValid = computed(() => {
  return !fields.value.find(
    (field) => field.isMandatory && !field?.value?.length
  );
});

/*
 * submit
 */
const submit = async () => {
  let data = {};
  fields.value.forEach((field) => {
    data[field.name] = field.value;
  });

  await window.Echo.leave(`public.room.${room.value.id}`);
  await window.Echo.leave(`presence.room.${room.value.id}`);

  if (participant.value) {
    await api
      .patch("/user/room", {
        data: JSON.stringify(data),
      })
      .then((response) => {
        participant.value = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    await presentationsStore.loginRoom(data);
  }
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

    .q-icon {
      color: rgba(0, 0, 0, 0.4);
    }
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

    .q-icon {
      color: rgba(255, 255, 255, 0.4);
    }
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
  }
}
</style>
