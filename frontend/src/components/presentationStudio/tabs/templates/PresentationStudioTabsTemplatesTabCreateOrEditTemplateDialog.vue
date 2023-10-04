<template>
  <q-card flat class="q-pa-sm">
    <q-card-section class="q-pa-lg">
      <!-- icon -->
      <div class="row justify-center q-mt-md">
        <q-icon name="r_document_scanner" color="primary" size="52px" />
      </div>

      <!-- title -->
      <div class="text-h6 text-bold text-center q-mt-lg">{{ title }}</div>

      <!-- privacy -->
      <div class="row justify-center q-mt-sm">
        <q-checkbox
          v-model="form.is_private"
          :label="
            $t(
              `presentationLayout.rightDrawer.tabs.templates.createOrEdit.fields.privacy.${
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
                  `presentationLayout.rightDrawer.tabs.templates.createOrEdit.fields.privacy.${
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
          :label="
            $t(
              'presentationLayout.rightDrawer.tabs.templates.createOrEdit.fields.name'
            )
          "
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
          :label="
            $t(
              'presentationLayout.rightDrawer.tabs.templates.createOrEdit.fields.description'
            )
          "
          outlined
          autogrow
          class="q-mt-lg"
        />

        <!-- category -->
        <!-- TODO: change accessibility by admins (user roles) -->
        <q-select
          v-if="
            [2].includes(user.id) || user.email === 'inagamov.ar@yandex.com'
          "
          v-model="form.category"
          :options="categories.filter((category) => category.label)"
          map-options
          emit-value
          option-value="name"
          :label="
            $t(
              'presentationLayout.rightDrawer.tabs.templates.createOrEdit.fields.category'
            )
          "
          outlined
          autogrow
          clearable
          class="q-mt-lg"
        />

        <div class="row no-wrap q-gutter-lg q-mt-sm">
          <!-- cancel -->
          <q-btn
            outline
            no-caps
            :label="cancelBtnText"
            class="q-py-sm"
            color="primary"
            @click="$emit('cancel')"
          />

          <!-- confirm -->
          <q-btn
            unelevated
            no-caps
            :label="submitBtnText"
            class="q-py-sm"
            color="primary"
            type="submit"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "stores/auth";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const { user } = storeToRefs(useAuthStore());

/*
 * props
 */
const props = defineProps({
  title: { type: String, default: null },

  cancelBtnText: { type: String, default: null },
  submitBtnText: { type: String, default: null },

  name: { type: String, default: null },
  description: { type: String, default: null },
  category: { type: String, default: null },
  isPrivate: { type: Boolean, default: true },

  categories: { type: Array, default: null },
});

/*
 * emits
 */
defineEmits(["cancel", "submit"]);

/*
 * form
 */
const form = ref({
  name: props.name,
  description: props.description,
  is_private: props.isPrivate,
  category: props.category,
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
  width: 500px;
  border-radius: 16px !important;
}

.q-btn {
  width: 100%;
}
</style>
