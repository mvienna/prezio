<template>
  <div>
    <!-- select background -->
    <div class="text-grey">
      {{
        $t("presentationLayout.rightDrawer.tabs.design.slideBackground.title")
      }}
    </div>

    <!-- categories -->
    <div class="q-gutter-xs q-mt-sm q-mb-md">
      <q-chip
        v-for="category in categories"
        :key="category.name"
        class="cursor-pointer"
        :class="
          selectedBackgroundsCategory === category.name
            ? 'bg-grey text-white'
            : 'bg-white text-grey'
        "
        outline
        ripple
        :disable="category.disable"
        @click="selectedBackgroundsCategory = category.name"
      >
        {{ category.label }}
      </q-chip>
    </div>

    <!-- backgrounds -->
    <div class="row justify-between q-gutter-md">
      <div
        v-for="background in filteredBackgrounds"
        :key="background.name"
        class="background_option"
        :class="
          backgroundElement?.imageSrc === background.src
            ? 'background_option--active'
            : ''
        "
        @click="handleBackgroundChange(background)"
      >
        <q-img :src="background.src" />
        <div class="text-center q-mt-xs text-semibold">
          {{ background.name }}
        </div>
      </div>
    </div>

    <q-separator class="q-my-lg" />

    <!-- base fill -->
    <div class="text-grey q-mb-sm">
      {{ $t("presentationLayout.rightDrawer.tabs.design.slideBaseFill.title") }}
    </div>

    <div class="row no-wrap justify-between">
      <div
        v-for="color in baseFillColors"
        :key="color"
        class="base_fill_color_box"
        :class="
          color === selectedBaseFillColor ? 'base_fill_color_box--active' : ''
        "
        :style="`background: ${color};`"
        @click="
          selectedBaseFillColor = color;
          handleBaseFillChange();
        "
      ></div>

      <q-separator vertical />

      <div
        class="base_fill_color_box relative-position"
        :style="`background: ${selectedBaseFillColor};`"
        :class="
          !baseFillColors.includes(selectedBaseFillColor)
            ? 'base_fill_color_box--active'
            : ''
        "
      >
        <q-icon
          name="r_colorize"
          class="absolute-center"
          :style="`color: ${textColorOnAColoredBackground(
            selectedBaseFillColor
          )};`"
        />

        <q-menu
          anchor="bottom left"
          self="top left"
          transition-show="jump-down"
          transition-hide="jump-up"
          :offset="[0, 8]"
        >
          <q-color
            format-model="hex"
            no-header-tabs
            v-model="selectedBaseFillColor"
            @change="handleBaseFillChange()"
          />
        </q-menu>
      </div>
    </div>

    <!-- selected background -->
    <div class="text-grey q-mb-sm q-mt-lg">
      {{
        $t(
          "presentationLayout.rightDrawer.tabs.design.slideBackground.select.title"
        )
      }}
    </div>

    <div v-if="backgroundElement?.imageSrc" class="relative-position">
      <q-img :src="backgroundElement?.imageSrc" class="selected_background" />

      <div class="absolute-right q-mt-sm q-mr-sm">
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
            style="width: 290px; border-radius: 12px"
          >
            <div
              class="text-semibold row no-wrap justify-between q-mb-sm q-pb-xs"
            >
              <div>
                {{
                  $t(
                    "presentationLayout.rightDrawer.tabs.design.slideBackground.filters.title"
                  )
                }}

                <q-btn
                  icon="r_restart_alt"
                  flat
                  round
                  size="10px"
                  color="primary"
                  class="q-ml-sm"
                  @click="
                    backgroundFilters = { ...defaultBackgroundFilters };
                    changeBackgroundFilters();
                  "
                >
                  <q-tooltip>
                    {{
                      $t(
                        "presentationLayout.rightDrawer.tabs.design.slideBackground.filters.reset"
                      )
                    }}
                  </q-tooltip>
                </q-btn>
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
                @change="changeBackgroundFilters()"
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
                @change="changeBackgroundFilters()"
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
                @change="changeBackgroundFilters()"
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
                @change="changeBackgroundFilters()"
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
                @change="changeBackgroundFilters()"
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
                @change="changeBackgroundFilters()"
              />
            </div>
          </q-menu>
        </q-btn>
      </div>
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

      <!-- delete preview -->
      <q-btn
        icon="r_delete"
        flat
        round
        :disable="!backgroundElement"
        color="red"
        class="q-py-sm q-ml-md"
        @click="deleteElement(backgroundElement)"
      />
    </div>

    <q-dialog v-model="showSelectBackgroundDialog">
      <SelectMedia
        @close="showSelectBackgroundDialog = false"
        @select="
          handleBackgroundChange($event);
          showSelectBackgroundDialog = false;
        "
      />
    </q-dialog>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { backgrounds } from "src/constants/assets/backgrounds";
import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import SelectMedia from "components/media/SelectMedia.vue";
import { deleteElement } from "stores/canvas/helpers/select";
import { useCanvasMediaStore } from "stores/canvas/media";
import { useCanvasShapeStore } from "stores/canvas/shape";
import { SHAPES_OPTIONS } from "src/constants/canvas/canvasVariables";
import { textColorOnAColoredBackground } from "src/helpers/colorUtils";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const canvasStore = useCanvasStore();
const { elements, MODES_OPTIONS, canvas } = storeToRefs(canvasStore);

const mediaStore = useCanvasMediaStore();
const shapeStore = useCanvasShapeStore();

/*
 * SETUP
 */
onBeforeMount(() => {
  if (backgroundElement.value) {
    backgroundFilters.value = {
      opacity: backgroundElement.value.opacity * 100,
      blur: backgroundElement.value.blur,
      contrast: backgroundElement.value.contrast,
      brightness: backgroundElement.value.brightness,
      invert: backgroundElement.value.invert,
      grayscale: backgroundElement.value.grayscale,
    };
  }

  if (currentBaseFillElement.value) {
    selectedBaseFillColor.value = currentBaseFillElement.value?.fillColor;
  }
});

/*
 * backgrounds
 */
const categories = {
  prezio: {
    name: "prezio",
    label: t(
      "presentationLayout.rightDrawer.tabs.design.slideBackground.categories.prezio"
    ),
  },
  gradients: {
    name: "gradients",
    label: t(
      "presentationLayout.rightDrawer.tabs.design.slideBackground.categories.gradients"
    ),
    disable: true,
  },
  minimalism: {
    name: "minimalism",
    label: t(
      "presentationLayout.rightDrawer.tabs.design.slideBackground.categories.minimalism"
    ),
    disable: true,
  },
  office: {
    name: "office",
    label: t(
      "presentationLayout.rightDrawer.tabs.design.slideBackground.categories.office"
    ),
    disable: true,
  },
  architecture: {
    name: "architecture",
    label: t(
      "presentationLayout.rightDrawer.tabs.design.slideBackground.categories.architecture"
    ),
    disable: true,
  },
  futuristic: {
    name: "futuristic",
    label: t(
      "presentationLayout.rightDrawer.tabs.design.slideBackground.categories.futuristic"
    ),
    disable: true,
  },
};
const selectedBackgroundsCategory = ref(categories.prezio.name);

const filteredBackgrounds = computed(() => {
  return backgrounds;
});

/*
 * change slide background
 */
const backgroundElement = computed(() => {
  return elements.value.find(
    (element) => element.mode === MODES_OPTIONS.value.background
  );
});

const handleBackgroundChange = (background) => {
  elements.value = elements.value.filter(
    (element) => element.mode !== MODES_OPTIONS.value.background
  );

  const src = background?.src || background?.original_url;

  const image = new Image();
  image.src = src;

  image.onload = () => {
    const height = (canvas.value.width / image.width) * image.height;

    mediaStore.addImage(
      src,
      0,
      (canvas.value.height - height) / 2,
      canvas.value.width,
      height,
      "bottom",
      MODES_OPTIONS.value.background,
      true,
      backgroundFilters.value.opacity / 100,
      backgroundFilters.value.blur,
      backgroundFilters.value.contrast,
      backgroundFilters.value.brightness,
      backgroundFilters.value.invert,
      backgroundFilters.value.grayscale
    );
  };
};

/*
 * select background
 */
const showSelectBackgroundDialog = ref(false);

/*
 * background filters
 */
const defaultBackgroundFilters = {
  opacity: 100,
  blur: 0,
  contrast: 100,
  brightness: 100,
  invert: 0,
  grayscale: 0,
};
const backgroundFilters = ref({ ...defaultBackgroundFilters });

const changeBackgroundFilters = () => {
  const backgroundElementIndex = elements.value.findIndex(
    (element) => element.mode === MODES_OPTIONS.value.background
  );

  elements.value[backgroundElementIndex] = {
    ...elements.value[backgroundElementIndex],
    opacity: backgroundFilters.value.opacity / 100,
    blur: backgroundFilters.value.blur,
    contrast: backgroundFilters.value.contrast,
    brightness: backgroundFilters.value.brightness,
    invert: backgroundFilters.value.invert,
    grayscale: backgroundFilters.value.grayscale,
  };

  canvasStore.redrawCanvas();
};

/*
 * base fill
 */
const baseFillColors = [
  "#FFFFFF",
  "#000000",
  "#4971FF",
  "#DB4437",
  "#F4B400",
  "#0F9D58",
  "#DFFF00",
  "#CCCCFF",
  "#6495ED",
];

const currentBaseFillElement = computed(() => {
  return elements.value.find(
    (element) => element.mode === MODES_OPTIONS.value.baseFill
  );
});

const handleBaseFillChange = () => {
  elements.value = elements.value.filter(
    (element) => element.mode !== MODES_OPTIONS.value.baseFill
  );

  shapeStore.addShape(
    SHAPES_OPTIONS.square,
    0,
    0,
    canvas.value.width,
    canvas.value.height,
    "bottom",
    MODES_OPTIONS.value.baseFill,
    true,
    selectedBaseFillColor.value,
    selectedBaseFillColor.value,
    undefined,
    false
  );
};

const selectedBaseFillColor = ref();
</script>

<style scoped lang="scss">
/*
 * categories
 */
::v-deep(.q-chip) {
  border-radius: 8px;
}
::v-deep(.q-chip__icon) {
  display: none;
}

/*
 * background options
 */
.background_option {
  cursor: pointer;
  color: $grey;
  transition: 0.2s;

  .q-img {
    width: 170px;
    aspect-ratio: 16/9;
    border-radius: 8px;
    border: 1.5px solid $grey-2;
    outline: 3px solid transparent;
    transition: 0.2s;
  }

  &:hover {
    .q-img {
      outline: 3px solid $blue-2;
    }
  }

  &.background_option--active {
    color: $black;

    .q-img {
      border: 1.5px solid $primary;
      outline: 3px solid $blue-2;
    }
  }
}

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

/*
 * base fill
 */
.base_fill_color_box {
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  outline: 2px solid $grey-2;
  transition: 0.2s;

  &.base_fill_color_box--active {
    outline: 2px solid $primary;
  }
}
</style>
