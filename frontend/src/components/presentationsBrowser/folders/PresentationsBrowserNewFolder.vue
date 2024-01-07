<template>
  <q-card flat>
    <q-form @submit.prevent="$emit('submit', form)">
      <q-card-section class="q-pa-lg">
        <!-- icon -->
        <q-btn
          color="background"
          text-color="primary"
          unelevated
          icon="icon-folder_add"
          round
          size="1.15em"
          class="q-mb-3xs"
        />

        <!-- title -->
        <div class="text-h7 text-semibold q-my-md">
          {{ $t("presentationsBrowser.newFolder.title") }}
        </div>

        <!-- name -->
        <q-input
          v-model="form.name"
          :placeholder="$t('presentationsBrowser.newFolder.fields.name')"
          outlined
          dense
          autofocus
          :maxlength="100"
          color="primary"
          :rules="[nameRule]"
          lazy-rules
          no-error-icon
          hide-bottom-space
        >
          <template #append>
            <div class="row items-center text-no-wrap text-caption">
              {{ 100 - form.name?.length }}
            </div>
          </template>
        </q-input>

        <!-- description -->
        <!--        <q-input-->
        <!--          v-model="form.description"-->
        <!--          :label="$t('presentationsBrowser.newFolder.fields.description')"-->
        <!--          outlined-->
        <!--          autogrow-->
        <!--          class="q-mt-lg"-->
        <!--        />-->
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-lg">
        <!-- add presentations -->
        <div class="text-h7 text-semibold q-mb-sm">
          {{
            $t("presentationsBrowser.newFolder.fields.addPresentations.title")
          }}
        </div>

        <div class="text-grey-9">
          {{
            $t(
              "presentationsBrowser.newFolder.fields.addPresentations.description"
            )
          }}
        </div>
      </q-card-section>

      <div class="row no-wrap q-gutter-md scroll-x scroll--hidden q-px-lg">
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
          <div class="text-center ellipsis q-mt-sm text-sm">
            {{ presentation.name }}
          </div>
        </q-card>
      </div>

      <q-card-section class="q-pa-lg">
        <div class="row no-wrap q-gutter-lg">
          <!-- cancel -->
          <q-btn
            outline
            no-caps
            :label="$t('presentationsBrowser.newFolder.cancel')"
            class="q-py-sm"
            style="width: 100%"
            color="grey"
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
      </q-card-section>
    </q-form>
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
    border: 1px solid $grey-2;
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
    }
  }
}
</style>
