<template>
  <div>
    <!-- avatar -->
    <div class="avatar">
      <!-- uploaded avatar -->
      <q-img
        v-if="user.avatar"
        class="avatar__file"
        :src="user.avatar.preview_url || user.avatar.original_url"
        :alt="user.name"
      />

      <!-- default avatar -->
      <q-icon v-else name="r_person" size="160px" class="avatar__default" />
    </div>

    <!-- action buttons -->
    <div class="row q-gutter-md justify-center q-mt-sm">
      <!-- upload -->
      <div>
        <q-btn round flat no-caps>
          <form ref="form">
            <input
              :id="fileInputId"
              type="file"
              accept="image/*"
              @change="uploadFile"
            />
            <label :for="fileInputId">
              <q-icon name="r_upload" size="sm" class="q-pr-sm" />
              {{ $t("user.profile.form.avatar.upload") }}
            </label>
          </form>
        </q-btn>

        <div class="text-center text-caption text-grey q-mt-xs">
          {{ $t("tooltips.maxUploadFileSize") }}
        </div>
      </div>

      <!-- delete -->
      <div v-if="user.avatar">
        <q-btn
          icon="r_delete"
          color="red"
          flat
          class="q-py-sm"
          @click="deleteFile()"
        />
      </div>
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

        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers":
          "X-Requested-With,Content-Type,X-Token-Auth,Authorization",
        Accept: "application/json",
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
</script>

<style scoped lang="scss">
[type="file"] {
  height: 0;
  overflow: hidden;
  width: 0;
}

[type="file"] + label {
  border-radius: 8px;
  padding: 8px 24px;
  text-align: center;
  font-weight: 600;
  background: $primary;
  color: $white;
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: all 0.2s;
  vertical-align: middle;
  outline: 4px solid $white;

  &:hover {
    outline: 4px solid $blue-3;
  }
}

.avatar {
  display: flex;
  justify-content: center;

  .avatar__file {
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }

  .avatar__default {
    background: $grey-2;
    color: $grey-5;
    border-radius: 100%;
    padding: 20px;
    margin: 0 auto;
  }
}
</style>
