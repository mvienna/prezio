<template>
  <div class="container__wrapper q-mt-lg">
    <div class="container">
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
          class="form__title"
        >
          {{ presentation?.settings?.participants_info_form_title }}
        </div>

        <!-- google -->
        <q-btn
          flat
          color="primary"
          no-caps
          class="full-width q-py-md text-bold q-mt-lg bg-white"
        >
          <template #default>
            <q-img
              src="/assets/icons/google.svg"
              style="width: 24px"
              class="q-mr-md"
            />
            <span>
              {{ $t("auth.login.google") }}
            </span>
          </template>
        </q-btn>

        <!-- or -->
        <div class="q-py-lg text-center text-grey-2">
          {{ $t("auth.login.or") }}
        </div>

        <div class="column q-gutter-md">
          <template v-for="field in fields" :key="field.id">
            <q-input
              v-model="field.value"
              :type="field.type"
              :label="field.label"
              outlined
            >
              <template #prepend>
                <q-icon
                  v-if="field.isMandatory"
                  name="r_emergency"
                  class="grey-2"
                />
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

/*
 * variables
 */
const router = useRouter();

/*
 * props
 */
defineProps({
  logo: { type: String, default: "/logo_white_with_title_white.png" },
});

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation } = storeToRefs(presentationsStore);

/*
 * form
 */
const fields = ref([]);

onMounted(() => {
  fields.value = JSON.parse(
    presentation.value?.settings?.participants_info_form_fields_data
  );
});

const isValid = computed(() => {
  return fields.value.filter(
    (field) =>
      (field.isMandatory && field.value && field.value.length) ||
      !field.isMandatory
  ).length;
});

/*
 * submit
 */
const submit = async () => {
  const data = fields.value.map((field) => {
    return { name: field.name, value: field.value };
  });

  await presentationsStore.loginRoom(data);
  window.location.reload();
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
      color: $white;
    }
  }
}

::v-deep(.q-field__control) {
  background: $white;
  border-radius: 8px;
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
</style>
