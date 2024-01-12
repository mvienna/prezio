<template>
  <q-card flat>
    <q-form @submit.prevent="$emit('submit', form)">
      <q-card-section class="q-pa-lg">
        <!-- icon -->
        <q-btn
          color="background"
          text-color="primary"
          unelevated
          icon="icon-presentation"
          round
          size="1.15em"
          class="q-mb-3xs"
        />

        <!-- title -->
        <div class="text-16 text-semibold q-my-md">
          {{ $t("presentationsBrowser.newPresentation.title") }}
        </div>

        <!-- name -->
        <q-input
          v-model="form.name"
          :placeholder="$t('presentationsBrowser.newPresentation.fields.name')"
          outlined
          autofocus
          dense
          color="primary"
          class="q-mt-md"
          :rules="[nameRule]"
          lazy-rules
          hide-bottom-space
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
          dense
          options-dense
          hide-dropdown-icon
          clearable
          menu-self="top middle"
          menu-anchor="bottom middle"
          class="q-mt-lg"
          popup-content-class="q-px-sm"
        >
          <template #selected v-if="!form.folder_id">
            <div class="text-grey">
              {{ $t("presentationsBrowser.newPresentation.fields.folder") }}
            </div>
          </template>

          <template #prepend>
            <q-icon name="icon-folder_move" class="text-semibold" size="24px" />
          </template>

          <template #option="scope">
            <q-item
              v-bind="scope.itemProps"
              class="no-margin"
              style="max-width: 436px"
            >
              <q-img
                :src="`/assets/icons/folders/${getFolderIconName($q)}.png`"
                style="width: 1.75em; min-width: 1.75em"
                class="q-mr-sm"
              />

              <div class="ellipsis">
                {{ scope.opt.name }}
              </div>
            </q-item>
          </template>
        </q-select>
      </q-card-section>

      <q-separator />

      <!-- privacy -->
      <q-card-section class="q-pa-lg">
        <div class="text-grey-9 text-16 q-mb-md">
          {{ $t("presentationsBrowser.newPresentation.fields.privacy.title") }}
        </div>

        <q-card flat class="bg-grey-2">
          <q-card-section class="row no-wrap items-center q-py-sm">
            <q-icon
              :name="form.is_private ? 'r_visibility_off' : 'r_visibility'"
              class="q-mr-md"
              size="1.5em"
              color="grey"
            />

            <div>
              <div>
                {{
                  $t(
                    "presentationsBrowser.newPresentation.fields.privacy.private"
                  )
                }}
              </div>
              <div class="q-mt-xs text-grey text-12">
                {{
                  $t(
                    "presentationsBrowser.newPresentation.fields.privacy.description"
                  )
                }}
              </div>
            </div>

            <q-space />

            <!-- privacy -->
            <q-toggle v-model="form.is_private" color="primary" />
          </q-card-section>
        </q-card>
      </q-card-section>

      <q-card-section class="q-px-lg q-pb-lg q-pt-none">
        <div class="row no-wrap q-gutter-lg">
          <!-- cancel -->
          <q-btn
            outline
            no-caps
            :label="$t('presentationsBrowser.newPresentation.cancel')"
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
            :label="$t('presentationsBrowser.newPresentation.create')"
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
import { getFolderIconName } from "src/helpers/generationUtils";

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
  is_private: false,
  folder_id: props.selectedFolder?.id,
});

// name validation
const nameRule = (value) => {
  if (!value) {
    return t(
      "presentationsBrowser.newPresentation.fields.errors.name.required"
    );
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
