<template>
  <q-card flat>
    <q-card-section class="q-pa-lg">
      <!-- icon -->
      <div class="row justify-center q-mt-md">
        <q-icon name="r_co_present" color="primary" size="52px" />
      </div>

      <!-- title -->
      <div class="text-h6 text-bold text-center q-mt-sm q-mb-lg text-primary">
        {{ $t("myPresentations.newPresentation.title") }}
      </div>

      <!-- close -->
      <div class="absolute-right q-mt-lg q-mr-lg">
        <q-btn
          text-color="grey-5"
          unelevated
          icon="r_close"
          round
          @click="$emit('close')"
        />
      </div>

      <q-form @submit.prevent="$emit('submit', form)">
        <!-- name -->
        <q-input
          v-model="form.name"
          :label="$t('myPresentations.newPresentation.name')"
          outlined
          autofocus
          color="primary"
          class="q-mt-md"
          :rules="[nameRule]"
          lazy-rules
          hide-bottom-space
        />

        <!-- description -->
        <q-input
          v-model="form.description"
          :label="$t('myPresentations.newPresentation.description')"
          outlined
          autogrow
          class="q-mt-lg"
        />

        <!-- folder -->
        <q-select
          v-model="form.folder_id"
          :options="folders"
          emit-value
          map-options
          option-label="name"
          option-value="id"
          outlined
          color="primary"
          hide-dropdown-icon
          clearable
          :label="$t('myPresentations.newPresentation.folder')"
          class="q-mt-lg"
        >
          <template #prepend>
            <q-icon
              name="r_folder"
              class="text-semibold text-primary"
              size="24px"
            />
          </template>
        </q-select>

        <div class="row no-wrap items-center q-mt-lg">
          <!-- submit -->
          <q-btn
            round
            no-caps
            class="full-width q-py-md"
            color="primary"
            unelevated
            :loading="isLoading"
            :label="$t('myPresentations.newPresentation.create')"
            type="submit"
            icon="r_done"
          />

          <!-- privacy -->
          <q-checkbox
            v-model="form.is_private"
            checked-icon="r_visibility_off"
            unchecked-icon="r_visibility"
            indeterminate-icon="r_help"
            class="q-ml-md"
          >
            <q-tooltip class="text-center">
              <div class="q-mb-sm text-semibold" style="font-size: 14px">
                {{
                  $t(
                    `myPresentations.newFolder.privacy.${
                      form.is_private ? "private" : "public"
                    }.title`
                  )
                }}
              </div>

              <div>
                {{
                  $t(
                    `myPresentations.newFolder.privacy.${
                      form.is_private ? "private" : "public"
                    }.description`
                  )
                }}
              </div>
            </q-tooltip>
          </q-checkbox>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

defineEmits(["close", "submit"]);

const props = defineProps({
  isLoading: { type: Boolean },
  folders: { type: Array, default: null },
  selectedFolder: { type: Object, default: null },
});

/*
 * form
 */
const form = ref({
  name: "",
  description: "",
  is_private: true,
  folder_id: props.selectedFolder?.id,
});

// name validation
const nameRule = (value) => {
  if (!value) {
    return t("myPresentations.newPresentation.errors.name.required");
  }
  return true;
};
</script>

<style scoped lang="scss">
.q-card {
  width: 100%;
  max-width: 500px;
  border-radius: 16px !important;
}
</style>
