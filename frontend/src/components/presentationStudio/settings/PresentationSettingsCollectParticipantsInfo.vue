<template>
  <div>
    <!-- toggle -->
    <div class="row no-wrap">
      <q-checkbox
        v-model="form.requireParticipantsInfo"
        size="32px"
        @update:model-value="handleSave()"
        :class="form.requireParticipantsInfo ? 'text-primary' : ''"
        class="q-mb-md text-semibold"
      >
        <div class="q-ml-sm">
          {{
            $t(`presentationStudio.settings.collectParticipantsInfo.checkbox`)
          }}
        </div>
      </q-checkbox>
    </div>

    <q-slide-transition>
      <div v-if="form.requireParticipantsInfo">
        <!-- heading -->
        <q-input
          v-model="form.title"
          outlined
          :label="
            $t(
              `presentationStudio.settings.collectParticipantsInfo.fields.heading.title`
            )
          "
        />

        <!-- form fields -->
        <div class="q-mt-md q-mb-sm">
          {{
            $t(
              `presentationStudio.settings.collectParticipantsInfo.fields.title`
            )
          }}
        </div>

        <draggable
          v-if="form.fields.length"
          v-model="form.fields"
          :component-data="{
            tag: 'ul',
            type: 'transition-group',
            class: 'column no-wrap q-gutter-md',
          }"
          v-bind="fieldsDraggingOptions"
          item-key="id"
          handle=".field_handle"
          @start="handleStartDragging"
          @end="handleFieldsReorder"
          @reordered="handleFieldsReorder"
        >
          <template #item="{ element }">
            <q-card flat class="row no-wrap items-center">
              <q-icon
                name="r_drag_indicator"
                color="grey"
                size="sm"
                class="field_handle q-mr-sm"
              />

              <q-input
                v-model="element.label"
                type="text"
                :label="
                  $t(
                    'presentationStudio.settings.collectParticipantsInfo.fields.default.label'
                  )
                "
                outlined
                class="full-width"
              >
                <template #prepend>
                  <q-select
                    v-model="element.type"
                    dense
                    hide-selected
                    borderless
                    hide-dropdown-icon
                    map-options
                    options-dense
                    color="black"
                    emit-value
                    option-value="value"
                    class="q-borderless"
                    :options="Object.values(fieldTypes)"
                  >
                    <template #default>
                      <div class="column justify-center">
                        <q-icon
                          :name="fieldTypes[element.type].icon"
                          size="sm"
                        />
                      </div>
                    </template>

                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section>
                          <q-icon :name="scope.opt.icon" size="xs" />
                        </q-item-section>
                        <q-item-section class="text-no-wrap q-pr-md no-margin">
                          <q-item-label>{{ scope.opt.label }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-separator vertical class="q-ml-sm" />

                  <q-input
                    v-model="element.name"
                    type="text"
                    :label="
                      $t(
                        'presentationStudio.settings.collectParticipantsInfo.fields.default.name'
                      )
                    "
                    borderless
                    class="q-borderless"
                    style="width: 80px"
                  />

                  <q-separator vertical />
                </template>

                <template #append>
                  <q-checkbox
                    v-model="element.isMandatory"
                    checked-icon="r_emergency"
                    unchecked-icon="r_check_box_outline_blank"
                    indeterminate-icon="r_help"
                    size="sm"
                  >
                    <q-tooltip>
                      <div
                        class="text-center"
                        v-html="
                          $t(
                            `presentationStudio.settings.collectParticipantsInfo.fields.mandatory.${
                              element.isMandatory ? 'on' : 'off'
                            }`
                          )
                        "
                      ></div>
                    </q-tooltip>
                  </q-checkbox>

                  <q-btn
                    v-if="form.fields.length > 1"
                    flat
                    round
                    icon="r_delete_sweep"
                    class="round-borders"
                    size="sm"
                    @click="deleteField(element)"
                  />
                </template>
              </q-input>
            </q-card>
          </template>
        </draggable>

        <div class="row no-wrap q-gutter-md q-ml-md q-pt-md">
          <q-btn
            :label="
              $t(
                `presentationStudio.settings.collectParticipantsInfo.fields.add`
              )
            "
            unelevated
            no-caps
            icon="r_add"
            color="grey-2"
            text-color="black"
            @click="addField()"
          />

          <q-btn
            v-if="isUnsavedChanges"
            unelevated
            color="primary"
            icon="r_done"
            size="12px"
            style="width: 36px"
            :disable="!isFieldsValid"
            @click="handleSave()"
          />
        </div>
      </div>
    </q-slide-transition>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { usePresentationsStore } from "stores/presentations";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import draggable from "vuedraggable/src/vuedraggable";
import { generateUniqueId } from "src/helpers/generationUtils";
import { useQuasar } from "quasar";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const $q = useQuasar();

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation } = storeToRefs(presentationsStore);

/*
 * form
 */
const fieldTypes = {
  text: {
    icon: "r_text_fields",
    value: "text",
    label: t(
      "presentationStudio.settings.collectParticipantsInfo.fields.types.text"
    ),
  },
  email: {
    icon: "r_mail",
    value: "email",
    label: t(
      "presentationStudio.settings.collectParticipantsInfo.fields.types.email"
    ),
  },
  number: {
    icon: "r_pin",
    value: "number",
    label: t(
      "presentationStudio.settings.collectParticipantsInfo.fields.types.number"
    ),
  },
  date: {
    icon: "r_calendar_month",
    value: "date",
    label: t(
      "presentationStudio.settings.collectParticipantsInfo.fields.types.date"
    ),
  },
  password: {
    icon: "r_password",
    value: "password",
    label: t(
      "presentationStudio.settings.collectParticipantsInfo.fields.types.password"
    ),
  },
};

const defaultField = {
  label: t(
    "presentationStudio.settings.collectParticipantsInfo.fields.default.value"
  ),
  name: "name",
  type: fieldTypes.text.value,
  isMandatory: false,
};

const form = ref({
  requireParticipantsInfo: Boolean(
    presentation.value.settings.require_participants_info
  ),
  title:
    presentation.value.settings.participants_info_form_title ||
    t(
      "presentationStudio.settings.collectParticipantsInfo.fields.heading.default"
    ),
  fields: JSON.parse(
    presentation.value.settings.participants_info_form_fields_data
  ) || [
    {
      ...defaultField,
      id: generateUniqueId(undefined),
    },
  ],
});

const addField = () => {
  form.value.fields.push({
    ...defaultField,
    id: generateUniqueId(undefined, form.value.fields),
  });
};

const deleteField = (field) => {
  form.value.fields = form.value.fields.filter((item) => item.id !== field.id);
};

const isFieldsValid = computed(() => {
  return form.value.fields.filter(
    (field) => field.name.length && field.label.length
  )?.length;
});

const handleSave = async () => {
  presentation.value.settings = {
    ...presentation.value.settings,
    require_participants_info: form.value.requireParticipantsInfo,
    participants_info_form_title: form.value.title,
    participants_info_form_fields_data: JSON.stringify(form.value.fields),
  };
  await presentationsStore.updatePresentation();
};

const isUnsavedChanges = computed(() => {
  return (
    form.value.title !==
      presentation.value?.settings?.participants_info_form_title ||
    JSON.stringify(form.value.fields) !==
      JSON.stringify(
        JSON.parse(
          presentation.value?.settings?.participants_info_form_fields_data
        )
      )
  );
});

/*
 * fields drag
 */
const isFieldDragging = ref(false);
const fieldsDraggingOptions = ref({
  animation: 200,
  group: "attributes",
  direction: "vertical",
  disabled: false,
  ghostClass: "ghost",
});

const handleStartDragging = () => {
  isFieldDragging.value = true;
};

const handleEndDragging = () => {
  isFieldDragging.value = false;
};

const handleFieldsReorder = async () => {
  handleEndDragging();
};
</script>

<style scoped lang="scss">
.field_handle {
  cursor: grab;
}

//::v-deep(.q-borderless) {
//  .q-field__control {
//    box-shadow: none !important;
//  }
//  .q-field__control:before,
//  .q-field__control:after {
//    border: none !important;
//    transition: none !important;
//  }
//}
</style>
