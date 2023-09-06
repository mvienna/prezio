<template>
  <q-card flat>
    <!-- toolbar -->
    <q-card-section class="q-card__toolbar_section q-pa-lg">
      <q-toolbar class="justify-between">
        <!-- title -->
        <div class="text-h6 text-bold">{{ $t("media.select.title") }}</div>

        <!-- close -->
        <q-btn
          text-color="grey-5"
          unelevated
          icon="close"
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
          v-for="tab in tabs"
          :key="tab.name"
          :name="tab.name"
          :label="tab.label"
          :disable="tab.disabled"
          no-caps
        />
      </q-tabs>
    </q-card-section>

    <!-- content -->
    <q-card-section class="q-pa-lg">
      <q-tab-panels v-model="tab" animated>
        <!-- upload -->
        <q-tab-panel name="upload" class="q-pa-none">
          <template v-if="selectedFile">
            <!-- uploaded file -->
            <q-img
              class="uploaded__file"
              fit="cover"
              :src="selectedFile.original_url"
              :alt="selectedFile.filename"
            />

            <div class="absolute-right q-mr-lg q-mt-lg row no-wrap">
              <!-- delete file -->
              <q-btn
                color="grey-5"
                unelevated
                icon="delete"
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
                icon="close"
                round
                style="height: 24px"
                size="10px"
                @click="selectedFile = null"
              />
            </div>
          </template>

          <!-- illustration -->
          <template v-else>
            <div class="row justify-center">
              <q-img src="/assets/images/upload.svg" width="300px" />
            </div>

            <div class="text-grey-5 text-center q-mt-md">
              {{ $t("media.select.tabs.upload.description") }}
            </div>
          </template>

          <!-- upload -->
          <q-btn
            v-if="!selectedFile"
            round
            flat
            no-caps
            class="full-width q-mt-lg"
            :loading="isLoading"
          >
            <template #default>
              <form ref="form" class="full-width">
                <input type="file" :id="fileInputId" @change="uploadFile" />
                <label :for="fileInputId" class="full-width">
                  <q-icon name="attach_file" size="sm" class="q-pr-sm" />
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
              <q-img
                v-if="file?.mime_type?.includes('image')"
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
                  <q-icon name="delete" class="q-mr-sm" size="xs" />
                  <div>
                    {{ $t("media.actions.delete.title") }}
                  </div>
                </q-item>
              </q-menu>
            </q-card>
          </div>
        </q-tab-panel>

        <!-- stock -->
        <q-tab-panel name="stock"> </q-tab-panel>

        <!-- gifs and stickers-->
        <q-tab-panel name="gifs_and_stickers"> </q-tab-panel>
      </q-tab-panels>
    </q-card-section>

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
          round
          no-caps
          class="full-width q-py-md"
          color="primary"
          unelevated
          :label="$t('media.select.submit')"
          @click="$emit('select', selectedFile)"
          icon="done"
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

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const { user } = storeToRefs(useAuthStore());

defineEmits(["close", "select"]);

const isLoading = ref(false);

const media = ref([]);
const selectedFile = ref();

/*
 * tabs
 */
const tabs = [
  {
    name: "upload",
    label: t("media.select.tabs.upload.title"),
  },
  {
    name: "mine",
    label: t("media.select.tabs.mine.title"),
  },
  {
    name: "stock",
    label: t("media.select.tabs.stock.title"),
    disabled: true,
  },
  {
    name: "gifs_and_stickers",
    label: t("media.select.tabs.gifsAndStickers.title"),
    disabled: true,
  },
];
const tab = ref("upload");

/*
 * fetch users media
 */
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
 * upload
 */
const form = ref();
const fileInputId = `fileInput-${Math.random().toString(36).substring(2, 9)}`;

const uploadFile = async (event) => {
  isLoading.value = true;

  const file = event.target.files[0];

  const formData = new FormData();
  formData.append("file", file);
  formData.append("model_type", "App\\Models\\User");
  formData.append("model_id", user.value.id);
  formData.append("collection", "default");

  api
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
      isLoading.value = false;
    });
};

const deleteFile = (file) => {
  isLoading.value = true;

  api
    .delete(`/media/${file.id}`)
    .then(() => {
      media.value = media.value.filter((item) => item.id !== file.id);
      selectedFile.value = null;
    })
    .finally(() => {
      isLoading.value = false;
    });
};
</script>

<style scoped lang="scss">
.q-card {
  width: 100%;
  max-width: 650px;
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
  outline: 6px solid $white;

  &:hover {
    outline: 6px solid $blue-3;
  }
}

/*
 * uploaded
 */
.uploaded__file {
  width: 100%;
  border-radius: 6px;
}

/*
 * masorny grid
 */
.masonry {
  columns: 2 200px;
  column-gap: 16px;
  margin-bottom: -16px;

  .masonry__item {
    margin-bottom: 16px;
    display: inline-block;
    border-radius: 8px;
    width: 100%;
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
