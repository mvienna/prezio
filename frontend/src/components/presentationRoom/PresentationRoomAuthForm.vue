<template>
  <div class="container__wrapper">
    <div class="container">
      <q-form @submit.prevent="submit()">
        <!-- title -->
        <div
          v-if="presentation?.settings?.participants_info_form_title"
          class="form__title"
        >
          {{ presentation?.settings?.participants_info_form_title }}
        </div>

        <!-- google -->
        <q-btn
          outline
          color="primary"
          no-caps
          class="full-width q-py-md text-bold q-mt-lg"
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
        <div class="q-py-lg text-center text-grey-5">
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

        <svg
          class="form__svg"
          style="right: 5%; top: 0"
          width="53"
          height="51"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path
              d="M13.81 47.388c-2.05-.767-4.005-1.768-5.967-2.716a64.79 64.79 0 0 0-4.025-1.792c-.063-.025-1.036-.312-.998-.456.081-.313.512-.654.71-.877 1.072-1.197 2.106-2.416 3.004-3.744 1.273-1.882 2.492-4.036 2.763-6.3"
            ></path>
            <path
              d="M3 42.42c15.225-3.279 28.41-9.747 36.76-23.393C46.038 8.767 50.728-3.093 52.217-15"
            ></path>
          </g>
        </svg>
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

  await presentationsStore.login(data);
  window.location.reload();
};
</script>

<style scoped lang="scss">
.container__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto 0;
  height: 100%;
  width: 100%;

  .container {
    max-width: 600px;
    width: 100%;
  }

  form {
    padding: 48px;
    background: $white;
    border-radius: 16px;
    box-shadow: rgba(73, 112, 255, 0.1) 0 8px 24px;

    .form__title {
      text-align: center;
      font-size: 20px;
      font-weight: 600;
    }

    .form__svg {
      position: absolute;
      pointer-events: none;
      stroke: $primary;
      fill: none;
      stroke-width: 1.5;
      stroke-linecap: round;
    }
  }
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

@media screen and (max-width: 470px) {
  .container__wrapper {
    form {
      padding: 24px;
    }
  }
}
</style>
