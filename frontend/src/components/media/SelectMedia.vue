<template>
  <q-card flat class="select_media__card relative-position">
    <!-- toolbar -->
    <q-card-section
      class="q-card__toolbar_section column no-wrap q-pa-lg"
      style="height: 100%; max-height: 100%"
    >
      <q-toolbar class="q-pa-none q-mb-sm" style="min-height: 0">
        <!-- title -->
        <div class="text-h6 text-center text-semibold">
          {{ $t("media.select.title") }}
        </div>
      </q-toolbar>

      <!-- close -->
      <div class="absolute-top-right q-mt-lg q-mr-lg">
        <div>
          <q-btn
            text-color="grey"
            unelevated
            icon="r_close"
            round
            size="10px"
            class="round-borders"
            @click="$emit('cancel')"
          />
        </div>
      </div>

      <!-- tabs -->
      <q-tabs
        v-if="!selectedFile"
        v-model="tab"
        align="justify"
        class="text-black"
        inline-label
      >
        <q-tab
          v-for="tab in tabs"
          :key="tab.name"
          :name="tab.name"
          :label="tab.label"
          :disable="tab.disabled"
          :icon="tab.icon"
          :ripple="false"
          no-caps
        />
      </q-tabs>

      <!-- selected file -->
      <div v-if="selectedFile" style="height: calc(100% - 130px)">
        <div
          class="bg-grey-2 rounded-sm overflow-hidden row justify-center"
          style="height: 100%"
        >
          <img
            class="full-height"
            :src="
              selectedFile?.preview_url ||
              selectedFile?.original_url ||
              selectedFile?.urls?.regular ||
              selectedFile?.images?.fixed_height?.url
            "
            :alt="
              selectedFile?.filename ||
              selectedFile?.alt_description ||
              selectedFile?.title
            "
          />
        </div>

        <!-- actions -->
        <div class="row no-wrap q-gutter-md q-pt-lg">
          <!-- go back -->
          <q-btn
            unelevated
            :label="$t('media.select.goBack')"
            icon="r_arrow_back"
            no-caps
            color="grey-2"
            text-color="black"
            class="q-py-sm"
            @click="selectedFile = null"
          />

          <q-space />

          <!-- select -->
          <q-btn
            unelevated
            :label="$t('media.select.submit')"
            :loading="isProcessing"
            no-caps
            color="primary"
            class="q-py-sm"
            @click="handleFileSelection()"
          />
        </div>
      </div>

      <div
        v-else
        style="height: calc(100% - 68px)"
        class="column no-wrap scroll-y hide-scrollbar"
      >
        <!-- content -->
        <q-tab-panels v-model="tab" style="height: 100%">
          <!-- upload -->
          <q-tab-panel
            name="upload"
            class="q-pa-none column justify-center no-wrap q-py-lg"
          >
            <div
              id="drop-area"
              class="column justify-center no-wrap"
              @dragover="allowDrop"
              @drop="dropHandler"
              @dragenter="dragEnterHandler"
              @dragleave="dragLeaveHandler"
            >
              <div class="row justify-center">
                <q-btn
                  unelevated
                  icon="icon-upload"
                  round
                  size="16px"
                  color="grey-2"
                  text-color="grey"
                  :loading="isProcessing"
                />
              </div>

              <div class="text-16 q-mt-md row no-wrap justify-center">
                <div>
                  {{ $t("media.select.tabs.upload.dragAndDropFiles") }}
                </div>

                <div class="q-mx-xs">
                  {{ $t("media.select.tabs.upload.or") }}
                </div>

                <form ref="form">
                  <input
                    :id="fileInputId"
                    type="file"
                    accept="image/*"
                    @change="uploadFile"
                  />
                  <label :for="fileInputId" class="text-primary link">
                    {{ $t("media.select.tabs.upload.browseFiles") }}
                  </label>
                </form>
              </div>

              <div class="text-grey q-mt-xs">
                {{ $t("media.select.tabs.upload.description") }}
              </div>
            </div>
          </q-tab-panel>

          <!-- my uploads -->
          <q-tab-panel name="mine" class="q-pa-none">
            <div class="masonry q-py-lg">
              <q-card
                v-for="file in media"
                :key="file.id"
                flat
                bordered
                class="masonry__item"
                :class="
                  selectedFile?.id === file.id ? 'masonry__item--selected' : ''
                "
                @click="
                  selectedFile = selectedFile?.id === file.id ? null : file
                "
              >
                <!-- added from unsplash -->
                <img
                  v-if="file?.origin === MEDIA_ORIGIN_OPTIONS.UNSPLASH"
                  :src="file?.urls?.regular"
                  :alt="file?.alt_description"
                />

                <!-- uploaded from the computer -->
                <img
                  v-else-if="file?.mime_type?.includes('image')"
                  :src="file?.preview_url || file?.original_url"
                  :alt="file?.preview_url || file?.original_url"
                />

                <!-- context menu -->
                <q-menu
                  touch-position
                  context-menu
                  transition-show="jump-down"
                  transition-hide="jump-up"
                >
                  <!-- delete file -->
                  <q-item
                    class="text-red items-center"
                    clickable
                    @click="deleteFile(file)"
                  >
                    <q-icon name="r_delete" class="q-mr-sm" size="xs" />
                    <div>
                      {{ $t("media.actions.delete.title") }}
                    </div>
                  </q-item>
                </q-menu>
              </q-card>
            </div>
          </q-tab-panel>

          <!-- stock -->
          <q-tab-panel name="stock" class="q-pa-none">
            <!-- search on unsplash -->
            <div class="q-py-lg">
              <q-input
                v-model="unsplash.search"
                clearable
                outlined
                dense
                clear-icon="r_backspace"
                debounce="500"
                color="primary"
                :placeholder="$t('media.select.tabs.stock.search')"
                @update:model-value="handleUnsplashStore()"
              >
                <template #append>
                  <q-icon
                    flat
                    round
                    name="r_search"
                    class="q-ml-md q-mr-sm cursor-pointer"
                    @click="handleUnsplashStore()"
                  />
                </template>
              </q-input>
            </div>

            <!-- results unsplash -->
            <div>
              <q-infinite-scroll
                @load="unsplashStore.fetchUnsplashImages"
                :disable="unsplash.isLoading"
                :offset="100"
                class="masonry"
              >
                <q-card
                  v-for="item in unsplash.images"
                  :key="item.id"
                  class="masonry__item"
                  flat
                  bordered
                  :class="
                    selectedFile?.id === item.id
                      ? 'masonry__item--selected'
                      : ''
                  "
                  @click="
                    selectedFile = {
                      ...item,
                      origin: MEDIA_ORIGIN_OPTIONS.UNSPLASH,
                    }
                  "
                >
                  <!-- image -->
                  <img
                    :src="item.urls.regular"
                    :alt="item.alt_description"
                    :style="`aspect-ratio: ${
                      item.width / item.height
                    }; width: 100%;`"
                  />

                  <!-- author -->
                  <q-tooltip
                    anchor="bottom start"
                    self="top start"
                    class="row no-wrap items-center bg-white q-pa-xs q-pr-sm"
                    style="border: 1px solid #f2f2f2"
                    :offset="[0, 8]"
                  >
                    <q-avatar size="20px" class="q-mr-sm">
                      <q-img :src="item.user.profile_image.small" />
                    </q-avatar>

                    <div class="text-grey text-caption">
                      {{ item.user.name }}
                    </div>
                  </q-tooltip>

                  <!-- context menu -->
                  <q-menu
                    touch-position
                    context-menu
                    transition-show="jump-down"
                    transition-hide="jump-up"
                  >
                    <!-- open in new tab -->
                    <q-item
                      class="items-center"
                      :href="item.links.html"
                      target="_blank"
                      dense
                    >
                      <q-icon name="r_link" class="q-mr-sm" size="xs" />
                      <div>
                        {{ $t("media.actions.open.title") }}
                      </div>
                    </q-item>
                  </q-menu>
                </q-card>

                <template v-slot:loading>
                  <div class="row justify-center q-my-md">
                    <q-spinner-ios size="40px" />
                  </div>
                </template>
              </q-infinite-scroll>
            </div>
          </q-tab-panel>

          <q-tab-panel name="giphy" class="q-pa-none">
            <!-- search on giphy -->
            <div class="q-py-lg">
              <q-input
                v-model="giphy.search"
                clearable
                outlined
                dense
                clear-icon="r_backspace"
                debounce="500"
                color="primary"
                :placeholder="$t('media.select.tabs.stock.search')"
                @update:model-value="handleGiphyStore()"
              >
                <template #append>
                  <q-icon
                    flat
                    round
                    name="r_search"
                    class="q-ml-md q-mr-sm cursor-pointer"
                    @click="handleGiphyStore()"
                  />

                  <q-tabs
                    v-model="giphy.tab"
                    align="justify"
                    dense
                    class="text-primary giphyTabs"
                    inline-label
                    @update:model-value="handleGiphyStore()"
                  >
                    <q-tab
                      v-for="tab in giphy.TAB_OPTIONS"
                      :key="tab"
                      :label="tab"
                      :name="tab"
                      no-caps
                    >
                    </q-tab>
                  </q-tabs>
                </template>
              </q-input>
            </div>

            <!-- results giphy -->
            <div>
              <q-infinite-scroll
                @load="giphyStore.fetchGiphyGifs"
                :disable="giphy.isLoading"
                :offset="100"
                class="masonry"
              >
                <q-card
                  v-for="item in giphy.gifs"
                  :key="item.id"
                  class="masonry__item"
                  flat
                  bordered
                  :class="
                    selectedFile?.id === item.id
                      ? 'masonry__item--selected'
                      : ''
                  "
                  @click="
                    selectedFile = {
                      ...item,
                      origin: MEDIA_ORIGIN_OPTIONS.GIPHY,
                    }
                  "
                >
                  <!-- gif -->
                  <img
                    :src="item?.images?.fixed_height?.url"
                    alt="item"
                    :style="`aspect-ratio: ${
                      item?.images?.fixed_height?.width /
                      item?.images?.fixed_height?.height
                    }; width: 100%;`"
                  />

                  <!-- author -->
                  <q-tooltip
                    anchor="bottom start"
                    self="top start"
                    class="row no-wrap items-center bg-white q-pa-xs q-px-sm"
                    style="border: 1px solid #f2f2f2"
                    :offset="[0, 8]"
                  >
                    <q-avatar size="20px" class="q-mr-sm">
                      <q-img :src="item?.user?.avatar_url" />
                    </q-avatar>

                    <div>
                      <div class="text-caption">
                        {{ item?.title }}
                      </div>

                      <div class="text-grey text-caption">
                        {{ item?.user?.display_name }}
                      </div>
                    </div>
                  </q-tooltip>

                  <!-- context menu -->
                  <q-menu
                    touch-position
                    context-menu
                    transition-show="jump-down"
                    transition-hide="jump-up"
                  >
                    <!-- open in new tab -->
                    <q-item
                      class="items-center"
                      :href="item.url"
                      target="_blank"
                      dense
                    >
                      <q-icon name="r_link" class="q-mr-sm" size="xs" />
                      <div>
                        {{ $t("media.actions.open.title") }}
                      </div>
                    </q-item>
                  </q-menu>
                </q-card>

                <template v-slot:loading>
                  <div class="row justify-center q-my-md">
                    <q-spinner-ios size="40px" />
                  </div>
                </template>
              </q-infinite-scroll>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { api } from "boot/axios";
import { storeToRefs } from "pinia";
import { useAuthStore } from "stores/auth";
import { useUnsplashStore } from "stores/unsplash";
import { useGiphyStore } from "stores/giphy";
import { MEDIA_ORIGIN_OPTIONS } from "src/constants/integrations";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const { user } = storeToRefs(useAuthStore());

const emit = defineEmits(["cancel", "select"]);

const props = defineProps({
  collection: { type: String, default: "default" },
});

/*
 * stores
 */
const unsplashStore = useUnsplashStore();
const { unsplash } = storeToRefs(unsplashStore);

const giphyStore = useGiphyStore();
const { giphy } = storeToRefs(giphyStore);

/*
 * fetch users media
 */
const media = ref([]);

onBeforeMount(() => {
  api
    .get("/media")
    .then((response) => {
      media.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
});

/*
 * tabs
 */
const tabs = computed(() => {
  return {
    upload: {
      name: "upload",
      label: t("media.select.tabs.upload.title"),
    },
    mine: {
      name: "mine",
      label: t("media.select.tabs.mine.title"),
      disabled: !media.value?.length,
    },
    stock: {
      name: "stock",
      label: t("media.select.tabs.stock.title"),
      icon: "icon-unsplash",
    },
    gifsAndStickers: {
      name: "giphy",
      label: t("media.select.tabs.gifsAndStickers.title"),
    },
  };
});
const tab = ref("upload");

/*
 * select file
 */
const selectedFile = ref();
const isProcessing = ref(false);

const handleFileSelection = async () => {
  const origin = selectedFile.value?.origin;

  if (selectedFile.value.origin === MEDIA_ORIGIN_OPTIONS.UNSPLASH) {
    await saveUnsplashImageToUserMedia(selectedFile.value);
  }

  if (selectedFile.value.origin === MEDIA_ORIGIN_OPTIONS.GIPHY) {
    await saveGifToUserMedia(selectedFile.value);
  }

  emit("select", { ...selectedFile.value, origin: origin });
};

/*
 * upload from the computer
 */
const form = ref();
const fileInputId = `fileInput-${Math.random().toString(36).substring(2, 9)}`;

const uploadFile = async (event) => {
  isProcessing.value = true;

  const file = event.target.files[0];

  const formData = new FormData();
  formData.append("file", file);
  formData.append("model_type", "App\\Models\\User");
  formData.append("model_id", user.value.id);
  formData.append("collection", props.collection);

  return await api
    .post("/media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      form.value.reset();
      selectedFile.value = response.data;
      media.value.push(response.data);
    })
    .finally(() => {
      isProcessing.value = false;
    });
};

const deleteFile = (file) => {
  isProcessing.value = true;

  api
    .delete(`/media/${file.id}`)
    .then(() => {
      media.value = media.value.filter((item) => item.id !== file.id);
      selectedFile.value = null;
    })
    .finally(() => {
      isProcessing.value = false;
    });
};

/*
 * unsplash
 */
const saveUnsplashImageToUserMedia = async (data) => {
  isProcessing.value = true;

  return await api
    .post("/media", {
      unsplash_image_data: data,
      model_type: "App\\Models\\User",
      model_id: user.value.id,
      collection: props.collection,
    })
    .then((response) => {
      media.value.push(response.data);
      selectedFile.value = response.data;
    })
    .finally(() => {
      isProcessing.value = false;
    });
};

const handleUnsplashStore = () => {
  unsplash.value.images = [];
  unsplashStore.fetchUnsplashImages();
};

/*
 * giphy
 */
const saveGifToUserMedia = async (data) => {
  isProcessing.value = true;

  return await api
    .post("/media", {
      giphy_gif_data: data,
      model_type: "App\\Models\\User",
      model_id: user.value.id,
      collection: props.collection,
    })
    .then((response) => {
      media.value.push(response.data);
      selectedFile.value = response.data;
    })
    .finally(() => {
      isProcessing.value = false;
    });
};

const handleGiphyStore = () => {
  giphy.value.gifs = [];
  giphyStore.fetchGiphyGifs();
};

/*
 * drag & drop area
 */
const allowDrop = (event) => {
  event.preventDefault();
};

const dragEnterHandler = (event) => {
  event.target.classList.add("hover");
};

const dragLeaveHandler = (event) => {
  event.target.classList.remove("hover");
};

const dropHandler = (event) => {
  event.preventDefault();
  const dropArea = document.getElementById("drop-area");
  dropArea.classList.remove("hover");

  const files = event.dataTransfer.files;

  if (files.length > 0) {
    const file = files[0];
    if (file.type.startsWith("image/")) {
      // displayImage(file);
      uploadFile({ target: { files } });
    } else {
      alert("Please drop an image file");
    }
  }
};
</script>

<style scoped lang="scss">
.select_media__card {
  width: 100%;
  max-width: 800px;
  height: 100%;
  max-height: 600px;
  overflow-y: hidden;
  border-radius: 16px !important;
}

.q-card__toolbar_section {
  position: sticky;
  padding-bottom: 0;
  top: 0;
  z-index: 1;
}

/*
 * tabs
 */
::v-deep(.q-tab) {
  border-bottom: 1px solid $grey-2;

  &.q-tab--active {
    border-bottom: none;
  }
}

::v-deep(.q-panel) {
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

/*
 * file input
 */
[type="file"] {
  height: 0;
  overflow: hidden;
  width: 0;
}

/*
 * masorny grid
 */
.masonry {
  columns: 4 100px;
  column-gap: 16px;

  .masonry__item {
    margin-bottom: 16px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: 0.2s;
    border: 1px solid $grey-2;

    img {
      border-radius: 0;
      transition: 0.2s;
    }

    &:hover {
      border-color: $accent;
    }

    &.masonry__item--selected {
      border-color: $accent;
    }
  }
}

@media screen and (max-width: 640px) {
  .masonry {
    columns: 1 150px;
  }
}

#drop-area {
  border: 1px dashed $grey;
  border-radius: 6px;
  padding: 24px;
  height: 100%;
  text-align: center;
  cursor: grab;
  transition: 0.2s;
}

#drop-area.hover {
  border-color: $primary;
}

::v-deep(.giphyTabs) {
  .q-tab--active {
    .q-tab__label {
      color: $white !important;
      z-index: 1;
    }
  }

  .q-tab__indicator {
    height: 100%;
    background: $primary;
    border-radius: 8px;
  }

  .q-tab {
    border-radius: 8px;
    min-height: 30px;
    height: 30px;
  }
}
</style>
