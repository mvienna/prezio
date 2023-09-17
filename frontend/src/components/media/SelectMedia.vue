<template>
  <q-card flat class="relative-position">
    <!-- toolbar -->
    <q-card-section class="q-card__toolbar_section q-pa-lg">
      <q-toolbar class="justify-between q-px-none">
        <!-- title -->
        <div class="text-h6 text-bold">{{ $t("media.select.title") }}</div>

        <!-- close -->
        <q-btn
          text-color="grey-5"
          unelevated
          icon="r_close"
          round
          @click="$emit('close')"
        />
      </q-toolbar>

      <!-- tabs -->
      <q-tabs
        v-model="tab"
        align="justify"
        indicator-color="primary"
        class="bg-white text-black text-white"
        inline-label
      >
        <q-tab
          v-for="tab in Object.values(tabs)"
          :key="tab.name"
          :name="tab.name"
          :label="tab.label"
          :disable="tab.disabled"
          :icon="tab.icon"
          no-caps
        />
      </q-tabs>
    </q-card-section>

    <!-- content -->
    <q-card-section class="q-pa-lg" style="height: calc(100% - 124px)">
      <q-tab-panels v-model="tab" animated class="full-height">
        <!-- upload -->
        <q-tab-panel name="upload" class="q-pa-none column no-wrap full-height">
          <template v-if="selectedFile">
            <!-- uploaded file -->
            <q-img
              class="uploaded__file"
              fit="fill"
              :src="selectedFile?.original_url || selectedFile?.urls?.regular"
              :alt="selectedFile?.filename || selectedFile?.alt_description"
            />

            <div class="absolute-right q-mr-lg q-mt-lg row no-wrap">
              <!-- delete file -->
              <q-btn
                color="grey-5"
                unelevated
                icon="r_delete"
                round
                style="height: 24px"
                class="q-mr-sm"
                size="10px"
                @click="deleteFile(selectedFile)"
              />

              <!-- reset file -->
              <q-btn
                color="grey-5"
                unelevated
                icon="r_close"
                round
                style="height: 24px"
                size="10px"
                @click="selectedFile = null"
              />
            </div>
          </template>

          <!-- upload illustration -->
          <template v-else>
            <q-space />

            <div class="row justify-center">
              <q-img src="/assets/images/upload.svg" width="300px" />
            </div>

            <div class="text-grey-5 text-center q-mt-md">
              {{ $t("media.select.tabs.upload.description") }}
            </div>
          </template>

          <q-space />

          <!-- upload -->
          <q-btn
            v-if="!selectedFile"
            round
            flat
            no-caps
            class="full-width q-mt-lg"
            :loading="isProcessing"
          >
            <template #default>
              <form ref="form" class="full-width">
                <input
                  :id="fileInputId"
                  type="file"
                  accept="image/*"
                  @change="uploadFile"
                />
                <label :for="fileInputId" class="full-width">
                  <q-icon name="r_upload" size="sm" class="q-pr-sm" />
                  {{ $t("user.profile.form.avatar.upload") }}
                </label>
              </form>
            </template>
          </q-btn>
        </q-tab-panel>

        <!-- mine -->
        <q-tab-panel name="mine">
          <!-- none -->
          <template v-if="!media.length">
            <div class="row justify-center">
              <q-img src="/assets/images/upload.svg" width="300px" />
            </div>

            <div class="text-grey-5 text-center q-mt-md">
              {{ $t("media.select.tabs.upload.description") }}
            </div>
          </template>

          <!-- users files -->
          <div v-else class="masonry">
            <q-card
              v-for="file in media"
              :key="file.id"
              flat
              bordered
              class="masonry__item"
              :class="
                selectedFile?.id === file.id ? 'masonry__item--selected' : ''
              "
              @click="selectedFile = selectedFile?.id === file.id ? null : file"
            >
              <!-- added from unsplash -->
              <q-img
                v-if="file?.origin === selectedStockImageOriginOptions.unsplash"
                :src="file?.urls?.regular"
                :alt="file?.alt_description"
              />

              <!-- uploaded from the computer -->
              <q-img
                v-else-if="file?.mime_type?.includes('image')"
                :src="file?.original_url"
                :alt="file?.original_url"
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
          <!-- search unsplash-->
          <div class="q-px-md q-pt-md">
            <q-input
              v-model="search"
              outlined
              clearable
              clear-icon="r_block"
              debounce="300"
              color="primary"
              :placeholder="$t('media.select.tabs.stock.search')"
              class="q-mb-lg"
              @keydown="
                (event) => (event.key === 'Enter' ? handleSearch() : '')
              "
            >
              <template #append>
                <q-icon
                  flat
                  round
                  name="r_search"
                  class="q-ml-md q-mr-sm cursor-pointer"
                  @click="handleSearch()"
                />
              </template>
            </q-input>
          </div>

          <!-- results unsplash -->
          <div
            style="
              max-height: calc(100vh - 24px * 2 - 124px - 24px - 72px - 200px);
            "
          >
            <q-infinite-scroll
              @load="stockImagesStore.fetchStockImages"
              :offset="500"
              class="masonry q-pa-md"
            >
              <q-card
                v-for="item in stockImages"
                :key="item.id"
                flat
                bordered
                class="masonry__item"
                :class="
                  selectedFile?.id === item.id ? 'masonry__item--selected' : ''
                "
                @click="
                  selectedFile =
                    selectedFile?.id === item.id
                      ? null
                      : { ...item, origin: 'unsplash' }
                "
              >
                <!-- image -->
                <q-img :src="item.urls.regular" :alt="item.alt_description" />

                <!-- author -->
                <q-tooltip
                  anchor="bottom start"
                  self="top start"
                  class="row no-wrap items-center q-py-sm bg-white"
                  style="border-radius: 20px; border: 1px solid #f2f2f2"
                >
                  <q-avatar size="24px" class="q-mr-sm">
                    <q-img :src="item.user.profile_image.small" />
                  </q-avatar>

                  <div class="text-grey">
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
                  <!-- delete file -->
                  <q-item
                    class="items-center"
                    :href="item.links.html"
                    target="_blank"
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

        <!-- gifs and stickers-->
        <q-tab-panel name="r_gifs_and_stickers"> </q-tab-panel>
      </q-tab-panels>
    </q-card-section>

    <q-space />

    <!-- select -->
    <transition
      appear
      enter-active-class="animated fadeInUp"
      leave-active-class="animated fadeOutDown"
    >
      <q-card-section
        v-if="selectedFile"
        class="q-card__submit_button_section q-px-lg q-pb-lg q-pt-none"
      >
        <q-btn
          :label="$t('media.select.submit')"
          icon="r_done"
          round
          no-caps
          class="full-width q-py-md"
          color="primary"
          unelevated
          @click="handleFileSelection()"
        />
      </q-card-section>
    </transition>
  </q-card>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { api } from "boot/axios";
import { storeToRefs } from "pinia";
import { useAuthStore } from "stores/auth";
import { useStockImagesStore } from "stores/stock-images";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const { user } = storeToRefs(useAuthStore());

const emit = defineEmits(["close", "select"]);

/*
 * stores
 */
const stockImagesStore = useStockImagesStore();
const { stockImages, search } = storeToRefs(stockImagesStore);

/*
 * tabs
 */
const tabs = {
  upload: {
    name: "upload",
    label: t("media.select.tabs.upload.title"),
  },
  mine: {
    name: "mine",
    label: t("media.select.tabs.mine.title"),
  },
  stock: {
    name: "stock",
    label: t("media.select.tabs.stock.title"),
    icon: "icon-unsplash",
  },
  gifsAndStickers: {
    name: "gifs_and_stickers",
    label: t("media.select.tabs.gifsAndStickers.title"),
    disabled: true,
  },
};
const tab = ref("upload");

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
 * select file
 */
const selectedFile = ref();
const selectedStockImageOriginOptions = { unsplash: "unsplash" };
const isProcessing = ref(false);

const handleFileSelection = async () => {
  if (selectedFile.value.origin === selectedStockImageOriginOptions.unsplash) {
    await saveStockImage(selectedFile.value);
  }

  emit("select", selectedFile.value);
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
  formData.append("collection", "default");

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
const saveStockImage = async (data) => {
  isProcessing.value = true;

  return await api
    .post("/media", {
      unsplash_image_data: data,
      model_type: "App\\Models\\User",
      model_id: user.value.id,
      collection: "default",
    })
    .then((response) => {
      media.value.push(response.data);
    })
    .finally(() => {
      isProcessing.value = false;
    });
};

const handleSearch = () => {
  stockImages.value = [];
  stockImagesStore.fetchStockImages();
};
</script>

<style scoped lang="scss">
.q-card {
  width: 100%;
  max-width: 800px;
  height: 100%;
  max-height: 700px;
  overflow-y: hidden;
}

.q-card__toolbar_section {
  position: sticky;
  padding-bottom: 0;
  top: 0;
  background: $white;
  z-index: 1;
}

.q-card__submit_button_section {
  position: sticky;
  bottom: 0;
  //background: $white;
}

/*
 * tabs
 */
::v-deep(.q-tab) {
  color: $grey-5;
  height: 50px;

  .q-tab__indicator {
    background: $grey-5;
    opacity: 0.3;
    height: 1px;
  }
}

::v-deep(.q-tab--active) {
  color: $dark;

  .q-tab__indicator {
    background: currentColor;
    opacity: 1;
    height: 2px;
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

[type="file"] + label {
  border-radius: 8px;
  padding: 16px 24px;
  text-align: center;
  min-height: 40px;
  font-weight: 600;
  background: $primary;
  color: $white;
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: all 0.2s;
  vertical-align: middle;
}

/*
 * uploaded
 */
.uploaded__file {
  height: calc(100% - 56px - 24px);
  border-radius: 6px;
}

/*
 * masorny grid
 */
.masonry {
  columns: 3 200px;
  column-gap: 16px;

  .masonry__item {
    margin-bottom: 16px;
    //display: inline-block;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s;
    border-width: 1.5px;
    outline: 3px solid transparent;

    &:hover {
      outline: 3px solid $blue-2;
    }

    &.masonry__item--selected {
      border-color: $primary;
      outline: 3px solid $blue-2;
    }
  }
}

@media screen and (max-width: 640px) {
  .masonry {
    columns: 1 150px;
  }
}
</style>
