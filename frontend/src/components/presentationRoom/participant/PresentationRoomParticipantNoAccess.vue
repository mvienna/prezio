<template>
  <div>
    <!-- logo -->
    <div class="row justify-center q-pa-lg">
      <div style="width: 96px">
        <q-img src="/prezio.svg" style="height: 48px" fit="contain" />
      </div>
    </div>

    <!-- message & illustration -->
    <div class="row no-wrap justify-center text-center">
      <div style="max-width: 500px">
        <div class="text-bold text-16">
          {{ $t("presentationRoom.isPrivate.title") }}
        </div>

        <div class="q-mt-md text-grey">
          {{ $t("presentationRoom.isPrivate.description") }}
        </div>

        <div class="row justify-center q-mt-xl">
          <q-img src="/assets/images/bird_singing.svg" width="300px" />
        </div>
      </div>
    </div>
  </div>
</template>
