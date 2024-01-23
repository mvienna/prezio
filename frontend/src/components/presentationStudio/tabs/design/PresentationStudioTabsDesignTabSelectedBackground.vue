<template>
  <div>
    <div class="q-mb-sm q-mt-lg">
      {{
        $t(
          "presentationLayout.rightDrawer.tabs.design.slideBackground.select.title"
        )
      }}
    </div>

    <div v-if="baseBackground" class="relative-position">
      <q-img
        :src="baseBackground.getAttr('source')"
        class="selected_background"
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
                    baseBackgroundFilters = { ...defaultBackgroundFilters };
                    handleBaseBackgroundFiltersUpdate();
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
                v-model="baseBackgroundFilters.opacity"
                :min="0"
                :max="1"
                :step="0.01"
                label
                style="width: 150px"
                thumb-size="14px"
                :label-value="
                  Math.round(baseBackgroundFilters.opacity * 100) + '%'
                "
                @change="handleBaseBackgroundFiltersUpdate()"
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
                v-model="baseBackgroundFilters.blurRadius"
                :min="0"
                :max="100"
                label
                style="width: 150px"
                thumb-size="14px"
                :label-value="baseBackgroundFilters.blurRadius + 'px'"
                @change="handleBaseBackgroundFiltersUpdate()"
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
                v-model="baseBackgroundFilters.contrast"
                :min="-100"
                :max="100"
                label
                style="width: 150px"
                thumb-size="14px"
                :label-value="baseBackgroundFilters.contrast + '%'"
                @change="handleBaseBackgroundFiltersUpdate()"
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
                v-model="baseBackgroundFilters.brightness"
                :min="-1"
                :max="1"
                :step="0.01"
                label
                style="width: 150px"
                thumb-size="14px"
                :label-value="
                  Math.round(baseBackgroundFilters.brightness * 100) + '%'
                "
                @change="handleBaseBackgroundFiltersUpdate()"
              />
            </div>
          </q-menu>
        </q-btn>
      </div>

      <!-- background opacity (copy) -->
      <div class="text-caption text-grey q-mt-md">
        {{
          $t(
            "presentationLayout.rightDrawer.tabs.design.slideBackground.filters.opacity"
          )
        }}
      </div>

      <q-slider
        v-model="baseBackgroundFilters.opacity"
        :min="0"
        :max="1"
        :step="0.01"
        label
        class="q-pr-sm"
        :label-value="Math.round(baseBackgroundFilters.opacity * 100) + '%'"
        @change="handleBaseBackgroundFiltersUpdate()"
      />
    </div>

    <div class="row no-wrap q-mt-sm">
      <!-- select media -->
      <q-btn
        :label="
          $t(
            'presentationLayout.rightDrawer.tabs.design.slideBackground.select.open'
          )
        "
        icon="icon-image_add"
        unelevated
        no-caps
        no-wrap
        color="primary"
        @click="showSelectBackgroundDialog = true"
      />

      <q-dialog v-model="showSelectBackgroundDialog">
        <SelectMedia
          @cancel="showSelectBackgroundDialog = false"
          @select="
            studioStore.updateBaseLayer(
              null,
              $event?.preview_url ||
                $event?.original_url ||
                $event?.urls?.regular,
              baseBackgroundFilters
            );

            showSelectBackgroundDialog = false;
          "
        />
      </q-dialog>

      <!-- delete preview -->
      <q-btn
        v-if="baseBackground"
        icon="r_delete_sweep"
        outline
        style="width: 36px"
        size="12px"
        class="q-ml-md"
        @click="studioStore.deleteNodes([baseBackground])"
      />
    </div>
  </div>
</template>

<script setup>
import SelectMedia from "components/media/SelectMedia.vue";
import { computed, onMounted, ref } from "vue";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { useStudioStore } from "stores/studio";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { showSelectBackgroundDialog } = storeToRefs(presentationsStore);

const studioStore = useStudioStore();
const { layers } = storeToRefs(studioStore);

/*
 * background filters
 */
const baseBackground = computed(() => {
  return layers.value.base?.findOne(".baseBackground");
});

onMounted(() => {
  if (baseBackground.value) {
    baseBackgroundFilters.value = {
      opacity: baseBackground.value.opacity(),
      blurRadius: baseBackground.value.blurRadius(),
      brightness: baseBackground.value.brightness(),
      contrast: baseBackground.value.contrast(),
    };
  }
});

const baseBackgroundFilters = ref({
  opacity: 1,
  blurRadius: 0,
  brightness: 0,
  contrast: 0,
});

const defaultBackgroundFilters = {
  opacity: 1,
  blurRadius: 0,
  brightness: 0,
  contrast: 0,
};

const handleBaseBackgroundFiltersUpdate = () => {
  studioStore.updateBaseLayer(
    undefined,
    undefined,
    baseBackgroundFilters.value
  );
};
</script>

<style scoped lang="scss">
/*
 * select background
 */
.selected_background {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
}
</style>
