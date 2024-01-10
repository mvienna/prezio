<template>
  <div>
    <!-- title -->
    <div class="q-mb-sm text-semibold">
      {{
        $t("presentationLayout.rightDrawer.tabs.settings.groups.answerOptions")
      }}

      <q-icon name="r_help" class="q-ml-xs" color="grey-8">
        <q-tooltip class="text-center" max-width="350px" :offset="[0, 8]">
          {{
            $t(
              `presentationLayout.rightDrawer.tabs.settings.answerOptions.description.${slide?.type}`
            )
          }}
        </q-tooltip>
      </q-icon>
    </div>

    <!-- answer options -->
    <draggable
      v-if="slideSettings.answerOptions.length"
      v-model="slideSettings.answerOptions"
      :component-data="{
        tag: 'ul',
        type: 'transition-group',
        class: 'column no-wrap q-gutter-sm',
      }"
      v-bind="answerOptionsDraggingOptions"
      item-key="id"
      handle=".layer_handle"
      @start="handleStartDraggingAnswerOptions"
      @end="handleLayersReorderAnswerOptions"
      @reordered="handleLayersReorderAnswerOptions"
    >
      <template #item="{ element, index }">
        <div class="row no-wrap items-center">
          <q-icon
            name="r_drag_indicator"
            color="grey"
            size="sm"
            class="layer_handle cursor-pointer"
          />

          <q-input
            v-model="element.value"
            outlined
            dense
            style="width: 100%"
            class="q-mx-sm"
            debounce="1000"
            @update:model-value="$emit('updateSlideSettings')"
            :placeholder="
              $t(
                'presentationLayout.rightDrawer.tabs.settings.answerOptions.answerOption'
              ) +
              (index + 1)
            "
            :maxlength="150"
            :rules="[
              (val) =>
                val.length <= 150 ||
                $t(
                  'presentationLayout.rightDrawer.tabs.settings.answerOptions.maxLengthErrorMessage'
                ),
            ]"
            hide-bottom-space
            no-error-icon
          >
            <template #append>
              <div class="text-sm q-mr-xs">
                {{ 150 - element.value?.length }}
              </div>

              <q-btn
                v-if="element.image"
                flat
                icon="r_delete_sweep"
                color="red"
                round
                size="8px"
                @click="element.image = null"
                class="q-mr-xs"
              />

              <q-btn
                flat
                color="grey-9"
                round
                size="8px"
                @click="showSelectAnswerImageDialog[index] = true"
              >
                <template #default>
                  <q-icon
                    v-if="!element.image"
                    name="icon-image_add"
                    size="16px"
                  />

                  <q-img
                    v-else
                    :src="element.image"
                    style="
                      width: 24px;
                      height: 24px;
                      aspect-ratio: 1;
                      border-radius: 8px;
                    "
                  />
                </template>
              </q-btn>

              <!-- select preview -->
              <q-dialog v-model="showSelectAnswerImageDialog[index]">
                <SelectMedia
                  @cancel="showSelectAnswerImageDialog[index] = false"
                  @select="
                    (event) => {
                      element.image =
                        event?.preview_url ||
                        event?.original_url ||
                        event?.urls?.regular;
                      showSelectAnswerImageDialog[index] = false;
                    }
                  "
                />
              </q-dialog>
            </template>
          </q-input>

          <div class="row no-wrap">
            <q-checkbox
              v-model="element.isCorrect"
              size="32px"
              @update:model-value="$emit('updateSlideSettings')"
              :color="element.isCorrect ? 'positive' : 'grey'"
              keep-color
            >
              <q-tooltip>
                {{
                  $t(
                    "presentationLayout.rightDrawer.tabs.settings.answerOptions.tickTheCorrectAnswerOption"
                  )
                }}
              </q-tooltip>
            </q-checkbox>

            <q-btn
              flat
              color="grey"
              icon="r_delete_sweep"
              size="12px"
              style="border-radius: 50%; width: 32px"
              :disable="slideSettings.answerOptions.length <= 2"
              @click="handleRemovingAnswerOption(index)"
            />
          </div>
        </div>
      </template>
    </draggable>

    <!-- add answer option -->
    <div class="q-mt-md" style="margin-left: 32px">
      <q-btn
        v-if="slideSettings.answerOptions?.length < 8"
        unelevated
        :label="
          $t(
            'presentationLayout.rightDrawer.tabs.settings.answerOptions.addAnswerOption'
          )
        "
        icon="r_add"
        no-caps
        color="grey-2"
        text-color="black"
        @click="handleAddingNewAnswerOption()"
      />
    </div>
  </div>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import draggable from "vuedraggable/src/vuedraggable";
import SelectMedia from "components/media/SelectMedia.vue";

/*
 * emits
 */
defineEmits(["updateSlideSettings"]);

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { slideSettings, slide } = storeToRefs(presentationsStore);

/*
 * answer options (add / remove)
 */
const handleAddingNewAnswerOption = () => {
  slideSettings.value.answerOptions.push({
    value: "",
    isCorrect: false,
    isSelected: false,
  });
};

const handleRemovingAnswerOption = (answerOptionIndex) => {
  slideSettings.value.answerOptions = slideSettings.value.answerOptions.filter(
    (option, index) => index !== answerOptionIndex
  );
};

/*
 * drag
 */
const isAnswerOptionDragging = ref(false);
const answerOptionsDraggingOptions = ref({
  animation: 200,
  group: "attributes",
  direction: "vertical",
  disabled: false,
  ghostClass: "ghost",
});

const handleStartDraggingAnswerOptions = () => {
  isAnswerOptionDragging.value = true;
};

const handleEndDraggingAnswerOptions = () => {
  isAnswerOptionDragging.value = false;
};

const handleLayersReorderAnswerOptions = async () => {
  handleEndDraggingAnswerOptions();
};

/*
 * answers images
 */
const showSelectAnswerImageDialog = ref([]);
</script>
