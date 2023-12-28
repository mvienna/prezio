<template>
  <q-card flat class="q-pa-sm">
    <q-card-section class="q-pa-lg">
      <!-- icon -->
      <div class="row justify-center q-mt-md">
        <q-icon name="r_create_new_folder" color="primary" size="52px" />
      </div>

      <!-- title -->
      <div class="text-h6 text-bold text-center q-mt-lg">
        {{ $t("presentationsBrowser.newFolder.title") }}
      </div>

      <q-form @submit.prevent="$emit('submit', form)">
        <!-- name -->
        <q-input
          v-model="form.name"
          :label="$t('presentationsBrowser.newFolder.fields.name')"
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
          :label="$t('presentationsBrowser.newFolder.fields.description')"
          outlined
          autogrow
          class="q-mt-lg"
        />

        <!-- presentations -->
        <div class="q-mt-lg text-h7 text-semibold q-mb-sm">
          {{ $t("presentationsBrowser.newFolder.fields.addPresentations") }}
        </div>

        <div class="row no-wrap q-gutter-md scroll-x q-pb-md">
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

        <div class="row no-wrap q-gutter-lg q-mt-sm">
          <!-- cancel -->
          <q-btn
            outline
            no-caps
            :label="$t('presentationsBrowser.newFolder.cancel')"
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
            :label="$t('presentationsBrowser.newFolder.create')"
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
 * emits
 */
const emit = defineEmits(["cancel", "submit"]);

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const props = defineProps({
  isLoading: { type: Boolean },
  presentations: { type: Array, default: null },
});

/*
 * form
 */
const form = ref({
  name: "",
  description: "",
  presentationsIds: [],
});

// name validation
const nameRule = (value) => {
  if (!value) {
    return t("presentationsBrowser.newFolder.fields.errors.name.required");
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
    border: 2px solid $grey-2;
    outline: 2px solid transparent;
    transition: 0.2s;
    border-radius: 8px;
    width: 100%;
    height: 100%;
  }

  &:hover {
    .q-img {
      border-color: $accent;
    }
  }

  &.presentation_card--active {
    .q-img {
      border-color: $primary;
      outline-color: $accent;
    }
  }
}
</style>
