<template>
  <div class="form__avatar">
    <!-- avatar -->
    <div class="avatar">
      <div
        id="drop-area"
        class="avatar__file"
        @dragover="allowDrop"
        @drop="dropHandler"
        @dragenter="dragEnterHandler"
        @dragleave="dragLeaveHandler"
      >
        <!-- user avatar -->
        <q-img
          v-if="user.avatar"
          :src="user.avatar.preview_url || user.avatar.original_url"
          :alt="user.name"
          style="width: 100%; height: 100%"
        />

        <!-- default avatar -->
        <q-icon v-else name="r_account_circle" size="2.25rem" />
      </div>
    </div>

    <div class="text-center text-caption text-grey q-mt-sm">
      {{ $t("tooltips.maxUploadFileSize") }}
    </div>

    <!-- action buttons -->
    <div class="row q-gutter-md justify-center q-mt-sm">
      <!-- upload -->
      <q-btn outline no-wrap class="bg-white q-px-md" color="grey-4" no-caps>
        <form ref="form">
          <input
            :id="fileInputId"
            type="file"
            accept="image/*"
            @change="uploadFile"
          />

          <label :for="fileInputId" class="text-black row items-center no-wrap">
            <q-icon name="icon-upload" size="sm" class="q-pr-sm" />
            {{ $t("user.profile.form.avatar.upload") }}
          </label>
        </form>
      </q-btn>

      <!-- delete -->
      <q-btn
        v-if="user.avatar"
        outline
        no-wrap
        class="bg-white q-px-md"
        color="grey-4"
        no-caps
        @click="deleteFile()"
      >
        <q-icon name="r_delete_sweep" size="sm" class="text-red q-pr-sm" />
        <span class="text-red">
          {{ $t("user.profile.form.avatar.delete") }}
        </span>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { api } from "boot/axios";
import { storeToRefs } from "pinia/dist/pinia";
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "stores/auth";

/*
 * variables
 */
const { user } = storeToRefs(useAuthStore());

const $q = useQuasar();

const { t } = useI18n({ useScope: "global" });

/*
 * form
 */
const form = ref();
const fileInputId = `fileInput-${Math.random().toString(36).substring(2, 9)}`;

const isLoading = ref(false);

// upload
const uploadFile = async (event) => {
  isLoading.value = true;

  const file = event.target.files[0];

  const formData = new FormData();
  formData.append("file", file);
  formData.append("model_type", "App\\Models\\User");
  formData.append("model_id", user.value.id);
  formData.append("collection", "avatar");

  api
    .post("/media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      form.value.reset();

      user.value.avatar = response.data;

      $q.notify({
        message: t("user.profile.form.avatar.success.upload"),
        icon: "r_done",
      });
    })
    .catch((error) => {
      $q.notify({
        message: error.response.data.message,
        color: "red",
        icon: "r_crisis_alert",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

// delete
const deleteFile = () => {
  isLoading.value = true;

  api
    .delete(`/media/${user.value.avatar.id}`)
    .then(() => {
      user.value.avatar = null;

      $q.notify({
        message: t("user.profile.form.avatar.success.delete"),
        icon: "r_done",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};

/*
 * drag & drop area
 */
const allowDrop = (event) => {
  event.preventDefault();
};

const dragEnterHandler = (event) => {
  const dropArea = document.getElementById("drop-area");
  dropArea.classList.add("hover");
};

const dragLeaveHandler = (event) => {
  const dropArea = document.getElementById("drop-area");
  dropArea.classList.remove("hover");
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
[type="file"] {
  height: 0;
  overflow: hidden;
  width: 0;
  position: absolute;
}

[type="file"] + label {
  cursor: pointer;
}

.form__avatar {
  background: $grey-3;
  border-radius: 8px;
  padding: 16px;
}

.avatar {
  display: flex;
  justify-content: center;

  .avatar__file {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    border: 4px solid transparent;
    outline: 2px dashed $grey;
    overflow: hidden;
    transition: 0.2s;
    cursor: grab;

    &.hover {
      outline: 2px dashed $primary;
    }

    .q-icon {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
