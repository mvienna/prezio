<template>
  <div>
    <div class="text-grey q-mb-sm q-mt-lg">
      {{
        $t(
          "presentationLayout.rightDrawer.tabs.design.slideBackground.select.title"
        )
      }}
    </div>

    <div v-if="backgroundElement?.imageSrc" class="relative-position">
      <q-img
        :src="backgroundElement?.imageSrc"
        class="selected_background"
        :style="`filter: opacity(${
          backgroundFilters.opacity || defaultBackgroundFilters.opacity
        }%) blur(${
          backgroundFilters.blur || defaultBackgroundFilters.blur
        }px) contrast(${
          backgroundFilters.contrast || defaultBackgroundFilters.contrast
        }%) brightness(${
          backgroundFilters.brightness || defaultBackgroundFilters.brightness
        }%) invert(${backgroundFilters.invert}%) grayscale(${
          backgroundFilters.grayscale || defaultBackgroundFilters.grayscale
        }%);`"
      />

      <!-- background filters -->
      <div class="absolute-right q-mt-md q-mr-md">
        <q-btn
          icon="r_tune"
          round
          text-color="black"
          style="
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(4px);
          "
          class="pulse"
          flat
          size="10px"
        >
          <q-menu
            anchor="top left"
            self="top right"
            transition-show="jump-down"
            transition-hide="jump-up"
            :offset="[8, 0]"
            class="q-pa-md"
            style="width: 300px; border-radius: 12px; overflow-x: hidden"
          >
            <div
              class="text-semibold row no-wrap justify-between q-mb-sm q-pb-xs"
            >
              <div class="row no-wrap items-center">
                <div>
                  {{
                    $t(
                      "presentationLayout.rightDrawer.tabs.design.slideBackground.filters.title"
                    )
                  }}
                </div>

                <q-icon
                  name="r_restart_alt"
                  class="q-ml-sm cursor-pointer"
                  @click="
                    backgroundFilters = { ...defaultBackgroundFilters };
                    $emit('changeBackgroundFilters', backgroundFilters);
                  "
                >
                  <q-tooltip>
                    {{
                      $t(
                        "presentationLayout.rightDrawer.tabs.design.slideBackground.filters.reset"
                      )
                    }}
                  </q-tooltip>
                </q-icon>
              </div>

              <q-btn
                icon="r_close"
                v-close-popup
                flat
                round
                size="10px"
                color="grey"
              />
            </div>

            <!-- background opacity -->
            <div class="row no-wrap items-center justify-between">
              <div class="text-caption text-grey">
                {{
                  $t(
                    "presentationLayout.rightDrawer.tabs.design.slideBackground.filters.opacity"
                  )
                }}
              </div>

              <q-slider
                v-model="backgroundFilters.opacity"
                :min="0"
                :max="100"
                label
                style="width: 150px"
                thumb-size="14px"
                :label-value="backgroundFilters.opacity + '%'"
                @change="$emit('changeBackgroundFilters', backgroundFilters)"
              />
            </div>

            <!-- background blur -->
            <div class="row no-wrap items-center justify-between q-mt-sm">
              <div class="text-caption text-grey q-mb-sm">
                {{
                  $t(
                    "presentationLayout.rightDrawer.tabs.design.slideBackground.filters.blur"
                  )
                }}
              </div>

              <q-slider
                v-model="backgroundFilters.blur"
                :min="0"
                :max="30"
                label
                style="width: 150px"
                thumb-size="14px"
                :label-value="backgroundFilters.blur + 'px'"
                @change="$emit('changeBackgroundFilters', backgroundFilters)"
              />
            </div>

            <!-- background contrast -->
            <div class="row no-wrap items-center justify-between q-mt-sm">
              <div class="text-caption text-grey q-mb-sm">
                {{
                  $t(
                    "presentationLayout.rightDrawer.tabs.design.slideBackground.filters.contrast"
                  )
                }}
              </div>

              <q-slider
                v-model="backgroundFilters.contrast"
                :min="0"
                :max="200"
                label
                :markers="100"
                style="width: 150px"
                thumb-size="14px"
                :label-value="backgroundFilters.contrast + '%'"
                @change="$emit('changeBackgroundFilters', backgroundFilters)"
              />
            </div>

            <!-- background brightness -->
            <div class="row no-wrap items-center justify-between q-mt-sm">
              <div class="text-caption text-grey q-mb-sm">
                {{
                  $t(
                    "presentationLayout.rightDrawer.tabs.design.slideBackground.filters.brightness"
                  )
                }}
              </div>

              <q-slider
                v-model="backgroundFilters.brightness"
                :min="0"
                :max="200"
                label
                :markers="100"
                style="width: 150px"
                thumb-size="14px"
                :label-value="backgroundFilters.brightness + '%'"
                @change="$emit('changeBackgroundFilters', backgroundFilters)"
              />
            </div>

            <!-- background invert -->
            <div class="row no-wrap items-center justify-between q-mt-sm">
              <div class="text-caption text-grey q-mb-sm">
                {{
                  $t(
                    "presentationLayout.rightDrawer.tabs.design.slideBackground.filters.invert"
                  )
                }}
              </div>

              <q-slider
                v-model="backgroundFilters.invert"
                :min="0"
                :max="100"
                label
                style="width: 150px"
                thumb-size="14px"
                :label-value="backgroundFilters.invert + '%'"
                @change="$emit('changeBackgroundFilters', backgroundFilters)"
              />
            </div>

            <!-- background grayscale -->
            <div class="row no-wrap items-center justify-between q-mt-sm">
              <div class="text-caption text-grey q-mb-sm">
                {{
                  $t(
                    "presentationLayout.rightDrawer.tabs.design.slideBackground.filters.grayscale"
                  )
                }}
              </div>

              <q-slider
                v-model="backgroundFilters.grayscale"
                :min="0"
                :max="100"
                label
                style="width: 150px"
                thumb-size="14px"
                :label-value="backgroundFilters.grayscale + '%'"
                @change="$emit('changeBackgroundFilters', backgroundFilters)"
              />
            </div>
          </q-menu>
        </q-btn>
      </div>

      <!-- background opacity (duplicate) -->
      <div class="text-caption text-grey q-mt-md">
        {{
          $t(
            "presentationLayout.rightDrawer.tabs.design.slideBackground.filters.opacity"
          )
        }}
      </div>

      <q-slider
        v-model="backgroundFilters.opacity"
        :min="0"
        :max="100"
        label
        class="q-pr-sm"
        :label-value="backgroundFilters.opacity + '%'"
        @change="$emit('changeBackgroundFilters', backgroundFilters)"
      />
    </div>

    <div class="row no-wrap q-pt-md">
      <!-- open preview selection -->
      <q-btn
        :label="
          $t(
            'presentationLayout.rightDrawer.tabs.design.slideBackground.select.open'
          )
        "
        icon-right="r_upload"
        unelevated
        text-color="primary"
        no-caps
        class="q-py-sm full-width select_background__upload_btn"
        @click="showSelectBackgroundDialog = true"
      />

      <q-dialog v-model="showSelectBackgroundDialog">
        <SelectMedia
          @close="showSelectBackgroundDialog = false"
          @select="
            $emit('changeBackground', {
              background: $event,
              backgroundFilters: backgroundFilters,
            });
            showSelectBackgroundDialog = false;
          "
        />
      </q-dialog>

      <!-- delete preview -->
      <q-btn
        v-if="backgroundElement"
        icon="r_delete"
        flat
        round
        color="red"
        class="q-py-sm q-ml-md"
        @click="deleteElement(backgroundElement)"
      />
    </div>
  </div>
</template>

<script setup>
import { deleteElement } from "stores/canvas/helpers/select";
import SelectMedia from "components/media/SelectMedia.vue";
import { onBeforeMount, ref } from "vue";

/*
 * props
 */
const props = defineProps({
  backgroundElement: { type: Object, default: null },
  defaultBackgroundFilters: { type: Object, default: null },
});

/*
 * emits
 */
defineEmits(["changeBackgroundFilters", "changeBackground"]);

/*
 * select background
 */
const showSelectBackgroundDialog = ref(false);

/*
 * background filters
 */
const backgroundFilters = ref({ ...props.defaultBackgroundFilters });

onBeforeMount(() => {
  if (props.backgroundElement) {
    backgroundFilters.value = {
      opacity:
        props.backgroundElement.opacity > 100
          ? props.defaultBackgroundFilters.opacity
          : props.backgroundElement.opacity * 100,
      blur: props.backgroundElement.blur,
      contrast: props.backgroundElement.contrast,
      brightness: props.backgroundElement.brightness,
      invert: props.backgroundElement.invert,
      grayscale: props.backgroundElement.grayscale,
    };
  }
});
</script>

<style scoped lang="scss">
/*
 * select background
 */
.selected_background {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  border: 1.5px solid $grey-2;
}

.select_background__upload_btn {
  border: 1.5px dashed $primary;
}
</style>
