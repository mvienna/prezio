<template>
  <q-card flat class="q-pa-sm">
    <q-card-section class="q-pa-lg">
      <!-- icon -->
      <div class="row justify-center q-mt-md">
        <q-icon name="r_co_present" color="primary" size="52px" />
      </div>

      <!-- title -->
      <div class="text-h6 text-bold text-center q-mt-lg">
        {{ $t("myPresentations.newPresentation.title") }}
      </div>

      <!-- privacy -->
      <div class="row justify-center q-mt-sm">
        <q-checkbox
          v-model="form.is_private"
          :label="
            $t(
              `myPresentations.newPresentation.fields.privacy.${
                form.is_private ? 'private' : 'public'
              }.title`
            )
          "
          checked-icon="r_visibility_off"
          unchecked-icon="r_visibility"
          indeterminate-icon="r_help"
          class="text-primary text-semibold q-gutter-xs"
        >
          <q-tooltip class="text-center">
            <div>
              {{
                $t(
                  `myPresentations.newPresentation.fields.privacy.${
                    form.is_private ? "private" : "public"
                  }.description`
                )
              }}
            </div>
          </q-tooltip>
        </q-checkbox>
      </div>

      <q-form @submit.prevent="$emit('submit', form)">
        <!-- name -->
        <q-input
          v-model="form.name"
          :label="$t('myPresentations.newPresentation.fields.name')"
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
          :label="$t('myPresentations.newPresentation.fields.description')"
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
          :label="$t('myPresentations.newPresentation.fields.folder')"
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

        <div class="row no-wrap q-gutter-lg q-mt-sm">
          <!-- cancel -->
          <q-btn
            outline
            no-caps
            :label="$t('myPresentations.newPresentation.cancel')"
            class="q-py-sm"
            style="width: 100%"
            color="primary"
            @click="$emit('cancel')"
          />

          <!-- confirm -->
          <q-btn
            unelevated
            no-caps
            :loading="isLoading"
            :label="$t('myPresentations.newPresentation.create')"
            class="q-py-sm"
            style="width: 100%"
            color="primary"
            type="submit"
          />
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

defineEmits(["cancel", "submit"]);

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
    return t("myPresentations.newPresentation.fields.errors.name.required");
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
