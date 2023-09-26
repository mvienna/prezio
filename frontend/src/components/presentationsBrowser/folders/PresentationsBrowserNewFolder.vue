<template>
  <q-card flat>
    <q-card-section class="q-pa-lg">
      <!-- icon -->
      <div class="row justify-center q-mt-md">
        <q-icon name="r_create_new_folder" color="primary" size="52px" />
      </div>

      <!-- title -->
      <div class="text-h6 text-bold text-center q-mt-sm q-mb-lg text-primary">
        {{ $t("myPresentations.newFolder.title") }}
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
          :label="$t('myPresentations.newFolder.name')"
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
          :label="$t('myPresentations.newFolder.description')"
          outlined
          autogrow
          class="q-mt-lg"
        />

        <!-- presentations -->
        <div class="q-mt-lg text-h7 text-semibold q-mb-sm">
          {{ $t("myPresentations.newFolder.addPresentations") }}
        </div>

        <div class="row no-wrap q-gutter-md scroll-x">
          <q-card
            v-for="presentation in presentations"
            :key="presentation.id"
            flat
            class="presentation_card"
            :class="
              form.presentationsIds?.includes(presentation.id)
                ? 'presentation_card--active'
                : ''
            "
            @click="handlePresentationCardToggle(presentation)"
          >
            <!-- presentation preview -->
            <q-img
              :src="
                presentation.preview?.preview_url ||
                presentation.preview?.original_url ||
                presentation.preview
              "
            />

            <!-- presentation name -->
            <div class="text-center ellipsis q-mt-sm text-grey">
              {{ presentation.name }}
            </div>
          </q-card>
        </div>

        <div class="row no-wrap items-center q-mt-lg">
          <!-- submit -->
          <q-btn
            round
            no-caps
            class="full-width q-py-md"
            color="primary"
            unelevated
            :loading="isLoading"
            :label="$t('myPresentations.newFolder.create')"
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
 * emits
 */
const emit = defineEmits(["close", "submit"]);

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const props = defineProps({
  isLoading: { type: Boolean },
  presentations: { type: Array, default: null },
  selectedPresentations: { type: Array, default: null },
});

/*
 * form
 */
const form = ref({
  name: "",
  description: "",
  is_private: true,
  presentationsIds: props.selectedPresentations.map(
    (presentation) => presentation.id
  ),
});

// name validation
const nameRule = (value) => {
  if (!value) {
    return t("myPresentations.newFolder.errors.name.required");
  }
  return true;
};

/*
 * select presentations
 */
const handlePresentationCardToggle = (presentation) => {
  if (form.value.presentationsIds?.includes(presentation.id)) {
    form.value.presentationsIds = form.value.presentationsIds.filter(
      (id) => id !== presentation.id
    );
  } else {
    form.value.presentationsIds.push(presentation.id);
  }
};
</script>

<style scoped lang="scss">
.q-card {
  width: 100%;
  max-width: 500px;
  border-radius: 16px !important;
}

.presentation_card {
  width: 164px;
  min-width: 164px;
  aspect-ratio: 16/9;
  cursor: pointer;

  .q-img {
    border: 1.5px solid $grey-2;
    outline: 3px solid transparent;
    transition: 0.2s;
    border-radius: 8px;
    width: 100%;
    height: 100%;
  }

  &.presentation_card--active {
    .q-img {
      border: 1.5px solid $primary;
      outline: 3px solid $blue-2;
    }
  }
}
</style>
