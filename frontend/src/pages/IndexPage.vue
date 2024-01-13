<template>
  <q-page>
    <q-header class="bg-transparent" bordered>
      <div class="bg-white">
        <div class="container">
          <q-toolbar class="q-pa-md row no-wrap items-center">
            <!-- logo -->
            <div class="row no-wrap">
              <img
                :src="$q.screen.lt.md ? '/logo.svg' : '/prezio.svg'"
                style="height: 38px"
              />

              <div class="q-ml-sm column">
                <q-badge
                  class="bg-grey-2 text-grey-7"
                  style="font-size: 10px; margin-top: 3px"
                  :label="VERSION"
                />
              </div>
            </div>

            <q-space />

            <!-- hyperlinks -->
            <a href="#features" class="text-16 link text-grey-9">
              {{ $t("landing.hyperlinks.features") }}
            </a>
            <a href="#prices" class="text-16 link text-grey-9 q-mx-md">
              {{ $t("landing.hyperlinks.prices") }}
            </a>
            <a href="#faq" class="text-16 link text-grey-9">
              {{ $t("landing.hyperlinks.faq") }}
            </a>

            <q-space />

            <!-- login -->
            <q-btn
              outline
              :label="$t('landing.auth.login')"
              no-caps
              size="16px"
              class="q-mr-md q-px-md"
              style="min-height: 38px"
              :href="appUrl + ROUTE_PATHS.AUTH.LOGIN"
            />

            <!-- signup -->
            <q-btn
              unelevated
              color="primary"
              :label="$t('landing.auth.signup')"
              no-caps
              size="16px"
              class="q-px-md"
              style="min-height: 38px"
              :href="appUrl + ROUTE_PATHS.AUTH.SIGNUP"
            />
          </q-toolbar>
        </div>
      </div>

      <!-- join room toolbar -->
      <!--      <q-toolbar-->
      <!--        v-if="showJoinRoomToolbar"-->
      <!--        class="row no-wrap justify-center items-center q-pa-sm join_room"-->
      <!--      >-->
      <!--        <div class="text-black q-mr-sm">-->
      <!--          {{ $t("landing.joinRoom.title") }}-->
      <!--        </div>-->

      <!--        &lt;!&ndash; join room with token &ndash;&gt;-->
      <!--        <form @submit.prevent="handleRoomSearch()">-->
      <!--          <q-input-->
      <!--            v-model="roomId"-->
      <!--            borderless-->
      <!--            dense-->
      <!--            class="join_room__token_input"-->
      <!--            :placeholder="$t('landing.joinRoom.enterCode')"-->
      <!--            :prefix="$t('landing.joinRoom.url')"-->
      <!--            :error="!!roomSearchError"-->
      <!--            hide-bottom-space-->
      <!--            no-error-icon-->
      <!--          >-->
      <!--            <template #append>-->
      <!--              &lt;!&ndash; join room &ndash;&gt;-->
      <!--              <q-btn-->
      <!--                unelevated-->
      <!--                :label="$t('landing.joinRoom.join')"-->
      <!--                color="grey-2"-->
      <!--                text-color="black"-->
      <!--                size="12px"-->
      <!--                no-caps-->
      <!--                class="q-px-sm"-->
      <!--                @click="handleRoomSearch()"-->
      <!--              />-->
      <!--            </template>-->
      <!--          </q-input>-->
      <!--        </form>-->

      <!--        &lt;!&ndash; close join room toolbar &ndash;&gt;-->
      <!--        <q-btn-->
      <!--          flat-->
      <!--          round-->
      <!--          size="10px"-->
      <!--          color="black"-->
      <!--          icon="r_close"-->
      <!--          class="absolute round-borders"-->
      <!--          style="top: 50%; transform: translateY(-50%); right: 24px"-->
      <!--          @click="showJoinRoomToolbar = false"-->
      <!--        />-->
      <!--      </q-toolbar>-->
    </q-header>

    <!-- heroes -->
    <div class="container">
      <div class="splitter q-py-xl q-my-xl">
        <div class="column no-wrap">
          <!-- title -->
          <div class="text-h3 text-semibold" style="line-height: 1.2">
            {{ $t("landing.heroes.title.static") }} <br />

            <span
              class="typewrite text-primary"
              data-period="4000"
              :data-type="dynamicTitles"
            >
              <span class="wrap"></span>
            </span>
          </div>

          <!-- description -->
          <div class="text-20 q-my-lg q-py-sm" style="max-width: 500px">
            {{ $t("landing.heroes.description") }}
          </div>

          <q-space />

          <!-- create presentation -->
          <div>
            <q-btn
              :label="$t('landing.heroes.action')"
              unelevated
              color="primary"
              no-caps
              size="16px"
              :href="appUrl + ROUTE_PATHS.AUTH.SIGNUP"
            />
          </div>
        </div>

        <!-- heroes illustration -->
        <div>
          <q-img
            src="/assets/illustrations/heroes.svg"
            alt="Prezio heroes illustration"
          />
        </div>
      </div>
    </div>

    <!-- benefits -->
    <div id="features" class="bg-white q-py-xl">
      <div class="container">
        <div class="q-py-xl">
          <!-- title -->
          <div class="text-h4 text-semibold text-center">
            {{ $t("landing.benefits.title") }}
          </div>

          <!-- description -->
          <div class="text-center q-mt-3xs q-mb-xl">
            {{ $t("landing.benefits.description") }}
          </div>

          <!-- sales -->
          <div class="betefit_cards_grid">
            <q-card flat class="betefit_card">
              <q-img src="assets/images/landing/benefit/sales.png" />

              <q-card-section class="q-pa-lg">
                <div class="text-h6 text-semibold q-mb-sm">
                  {{ $t("landing.benefits.sales.title") }}
                </div>

                <div class="text-grey-9">
                  {{ $t("landing.benefits.sales.description") }}
                </div>
              </q-card-section>
            </q-card>

            <!-- experts & teams -->
            <q-card flat class="betefit_card">
              <q-img
                src="assets/images/landing/benefit/experts_and_teams.png"
              />

              <q-card-section class="q-pa-lg">
                <div class="text-h6 text-semibold q-mb-sm">
                  {{ $t("landing.benefits.expertsAndTeams.title") }}
                </div>

                <div class="text-grey-9">
                  {{ $t("landing.benefits.expertsAndTeams.description") }}
                </div>
              </q-card-section>
            </q-card>

            <!-- teachers -->
            <q-card flat class="betefit_card">
              <q-img src="assets/images/landing/benefit/teachers.png" />

              <q-card-section class="q-pa-lg">
                <div class="text-h6 text-semibold q-mb-sm">
                  {{ $t("landing.benefits.teachers.title") }}
                </div>

                <div class="text-grey-9">
                  {{ $t("landing.benefits.teachers.description") }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- mechanics -->
    <div id="mechanics" class="q-py-xl">
      <div class="container">
        <div class="q-py-xl">
          <!-- title -->
          <div
            class="text-h4 text-semibold text-center q-pb-xl q-mb-xl"
            v-html="$t('landing.mechanics.title')"
          ></div>

          <!-- quiz - pick answer -->
          <div class="splitter">
            <div style="max-width: 500px">
              <!-- title -->
              <div class="text-h4 text-semibold">
                {{ $t("landing.mechanics.pickAnswer.title") }}
              </div>

              <!-- description -->
              <div class="q-mt-md text-16 q-mb-lg">
                {{ $t("landing.mechanics.pickAnswer.description") }}
              </div>

              <!-- bullet list -->
              <div class="column no-wrap q-gutter-md">
                <div class="row no-wrap items-center">
                  <div
                    class="row items-center justify-center round-borders q-pa-3xs bg-blue-1"
                  >
                    <q-icon name="r_done" color="primary" size="16px" />
                  </div>

                  <div class="text-16 q-ml-3xs">
                    {{ $t("landing.mechanics.pickAnswer.list.one") }}
                  </div>
                </div>

                <div class="row no-wrap items-center">
                  <div
                    class="row items-center justify-center round-borders q-pa-3xs bg-blue-1"
                  >
                    <q-icon name="r_done" color="primary" size="16px" />
                  </div>

                  <div class="text-16 q-ml-3xs">
                    {{ $t("landing.mechanics.pickAnswer.list.two") }}
                  </div>
                </div>

                <div class="row no-wrap items-center">
                  <div
                    class="row items-center justify-center round-borders q-pa-3xs bg-blue-1"
                  >
                    <q-icon name="r_done" color="primary" size="16px" />
                  </div>

                  <div class="text-16 q-ml-3xs">
                    {{ $t("landing.mechanics.pickAnswer.list.three") }}
                  </div>
                </div>
              </div>
            </div>

            <div class="row justify-end">
              <div style="max-width: 500px; width: 100%">
                <q-img
                  src="/assets/images/landing/mechanics/quiz_pick_answer.svg"
                  class="rounded-3xs"
                />
              </div>
            </div>
          </div>

          <!-- quiz - leaderboard -->
          <div class="splitter q-py-xl q-my-xl">
            <div style="max-width: 500px; width: 100%">
              <q-img
                src="/assets/images/landing/mechanics/quiz_leaderboard.svg"
                class="rounded-3xs"
              />
            </div>

            <div class="row justify-end">
              <div style="max-width: 500px">
                <!-- title -->
                <div class="text-h4 text-semibold">
                  {{ $t("landing.mechanics.leaderboard.title") }}
                </div>

                <!-- description -->
                <div class="q-mt-md text-16 q-mb-lg">
                  {{ $t("landing.mechanics.leaderboard.description") }}
                </div>

                <!-- bullet list -->
                <div class="column no-wrap q-gutter-md">
                  <div class="row no-wrap items-center">
                    <div
                      class="row items-center justify-center round-borders q-pa-3xs bg-blue-1"
                    >
                      <q-icon name="r_done" color="primary" size="16px" />
                    </div>

                    <div class="text-16 q-ml-3xs">
                      {{ $t("landing.mechanics.leaderboard.list.one") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="row items-center justify-center round-borders q-pa-3xs bg-blue-1"
                    >
                      <q-icon name="r_done" color="primary" size="16px" />
                    </div>

                    <div class="text-16 q-ml-3xs">
                      {{ $t("landing.mechanics.leaderboard.list.two") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="row items-center justify-center round-borders q-pa-3xs bg-blue-1"
                    >
                      <q-icon name="r_done" color="primary" size="16px" />
                    </div>

                    <div class="text-16 q-ml-3xs">
                      {{ $t("landing.mechanics.leaderboard.list.three") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- quiz - wordcloud -->
          <div class="splitter">
            <div style="max-width: 500px">
              <!-- title -->
              <div class="text-h4 text-semibold">
                {{ $t("landing.mechanics.wordcloud.title") }}
              </div>

              <!-- description -->
              <div class="q-mt-md text-16 q-mb-lg">
                {{ $t("landing.mechanics.wordcloud.description") }}
              </div>

              <!-- bullet list -->
              <div class="column no-wrap q-gutter-md">
                <div class="row no-wrap items-center">
                  <div
                    class="row items-center justify-center round-borders q-pa-3xs bg-blue-1"
                  >
                    <q-icon name="r_done" color="primary" size="16px" />
                  </div>

                  <div class="text-16 q-ml-3xs">
                    {{ $t("landing.mechanics.wordcloud.list.one") }}
                  </div>
                </div>

                <div class="row no-wrap items-center">
                  <div
                    class="row items-center justify-center round-borders q-pa-3xs bg-blue-1"
                  >
                    <q-icon name="r_done" color="primary" size="16px" />
                  </div>

                  <div class="text-16 q-ml-3xs">
                    {{ $t("landing.mechanics.wordcloud.list.two") }}
                  </div>
                </div>

                <div class="row no-wrap items-center">
                  <div
                    class="row items-center justify-center round-borders q-pa-3xs bg-blue-1"
                  >
                    <q-icon name="r_done" color="primary" size="16px" />
                  </div>

                  <div class="text-16 q-ml-3xs">
                    {{ $t("landing.mechanics.wordcloud.list.three") }}
                  </div>
                </div>
              </div>
            </div>

            <div class="row justify-end">
              <div style="max-width: 500px; width: 100%">
                <q-img
                  src="/assets/images/landing/mechanics/quiz_wordcloud.svg"
                  class="rounded-3xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- tools -->
    <div id="tools" class="bg-white q-py-xl">
      <div class="container">
        <div class="q-py-xl">
          <!-- title -->
          <div class="text-h4 text-semibold text-center">
            {{ $t("landing.tools.title") }}
          </div>

          <!-- description -->
          <div class="row justify-center">
            <div
              class="text-center q-mt-3xs q-mb-xl text-16"
              style="max-width: 800px"
            >
              {{ $t("landing.tools.description") }}
            </div>
          </div>

          <!-- bento -->
          <div>
            <div class="row no-wrap">
              <!-- studio -->
              <div style="min-width: 56.25%" class="q-mr-lg q-pr-sm">
                <q-card flat class="bg-grey-1 rounded-xl">
                  <q-card-section class="q-pa-lg">
                    <div class="text-h4 text-semibold">
                      {{ $t("landing.tools.bento.studio.title") }}
                    </div>
                    <div class="text-18 q-mt-3xs q-mb-lg">
                      {{ $t("landing.tools.bento.studio.description") }}
                    </div>

                    <q-img src="assets/images/landing/tools/studio.png" />
                  </q-card-section>
                </q-card>
              </div>

              <div class="column no-wrap items-stretch">
                <!-- stock -->
                <div class="q-mb-lg q-pb-sm">
                  <q-card flat class="bg-grey-1 rounded-xl">
                    <q-card-section class="q-px-lg q-pt-lg q-pb-none">
                      <div class="text-h4 text-semibold">
                        {{ $t("landing.tools.bento.stock.title") }}
                      </div>

                      <div class="text-18 q-mt-3xs q-mb-lg">
                        {{ $t("landing.tools.bento.stock.description") }}
                      </div>

                      <q-img src="assets/images/landing/tools/stock.png" />
                    </q-card-section>
                  </q-card>
                </div>

                <!-- emojis & gifs -->
                <q-card flat class="bg-grey-1 rounded-xl" style="height: 100%">
                  <q-card-section
                    class="q-px-lg q-pt-lg q-pb-none relative-position overflow-hidden"
                    style="height: 100%"
                  >
                    <div class="text-h4 text-semibold">
                      {{ $t("landing.tools.bento.emojisAndGifs.title") }}
                    </div>

                    <div class="text-18 q-mt-3xs q-mb-md">
                      {{ $t("landing.tools.bento.emojisAndGifs.description") }}
                    </div>

                    <q-img
                      src="assets/images/landing/tools/sparkles.png"
                      style="
                        width: 120px;
                        left: 50%;
                        bottom: -40px;
                        transform: translateX(-50%);
                      "
                      class="absolute"
                    />
                    <q-img
                      src="assets/images/landing/tools/unicorn.png"
                      style="width: 140px; right: 24px; bottom: -24px"
                      class="absolute"
                    />
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <div class="row no-wrap q-mt-lg q-pt-sm">
              <!-- online chat -->
              <q-card flat class="bg-grey-1 rounded-xl">
                <q-card-section class="q-pa-lg">
                  <div class="text-h4 text-semibold">
                    {{ $t("landing.tools.bento.onlineChat.title") }}
                  </div>
                  <div class="text-18 q-mt-3xs q-mb-lg">
                    {{ $t("landing.tools.bento.onlineChat.description") }}
                  </div>

                  <q-img
                    src="assets/images/landing/tools/avatars.png"
                    style="width: 240px"
                  />
                </q-card-section>
              </q-card>

              <!-- templates  -->
              <div style="min-width: 60%" class="q-ml-lg q-pl-sm">
                <q-card flat class="bg-grey-1 rounded-xl">
                  <q-card-section class="q-py-lg q-pl-lg q-pr-none">
                    <div class="q-pr-lg">
                      <div class="text-h4 text-semibold">
                        {{ $t("landing.tools.bento.templates.title") }}
                      </div>

                      <div class="text-18 q-mt-3xs q-mb-lg">
                        {{ $t("landing.tools.bento.templates.description") }}
                      </div>
                    </div>

                    <q-img src="assets/images/landing/tools/templates.png" />
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- prices -->
    <div id="prices" class="q-py-xl">
      <div class="container">
        <div class="q-py-xl">
          <!-- title -->
          <div class="text-h4 text-semibold text-center">
            {{ $t("landing.prices.title") }}
          </div>

          <!-- description -->
          <div class="row justify-center">
            <div
              class="text-center q-mt-3xs q-mb-xl text-16"
              style="max-width: 800px"
            >
              {{ $t("landing.prices.description") }}
            </div>
          </div>

          <!-- plans -->
          <div class="plans_grid">
            <!-- free -->
            <q-card flat bordered class="bg-white">
              <q-card-section>
                <!-- title -->
                <div class="text-18 text-semibold">
                  {{ $t("landing.prices.plans.free.title") }}
                </div>

                <!-- description -->
                <div class="q-mt-sm text-grey">
                  {{ $t("landing.prices.plans.free.description") }}
                </div>

                <!-- price & period -->
                <div class="row no-wrap items-end q-my-md">
                  <div class="text-36 text-semibold">
                    {{ $t("landing.prices.plans.free.price") }}
                  </div>
                  <div class="text-grey q-mb-sm q-ml-xs text-weight-medium">
                    {{ $t("landing.prices.plans.free.period") }}
                  </div>
                </div>

                <!-- participants limit -->
                <div class="row no-wrap items-center">
                  <q-icon
                    name="icon-profile_group"
                    color="primary"
                    size="20px"
                  />
                  <div class="text-semibold q-ml-sm">
                    {{ $t("landing.prices.plans.free.participantsLimit") }}
                  </div>
                </div>

                <q-separator />

                <!-- features -->
                <div class="column no-wrap q-gutter-sm">
                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.free.features.one") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.free.features.two") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.free.features.three") }}
                    </div>
                  </div>
                </div>

                <q-separator />

                <!-- action -->
                <q-btn
                  outline
                  color="grey-9"
                  :label="$t('landing.prices.plans.free.action')"
                  no-caps
                  class="full-width"
                  :href="appUrl + ROUTE_PATHS.AUTH.SIGNUP"
                />
              </q-card-section>
            </q-card>

            <!-- basic -->
            <q-card flat bordered class="bg-white overflow-hidden">
              <div
                style="
                  position: absolute;
                  top: 0;
                  right: 0;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(-150deg, #efb5b5 0%, #ebf0fb 75%);
                  filter: blur(50px);
                "
              ></div>

              <q-card-section>
                <!-- title -->
                <div class="text-18 text-semibold">
                  {{ $t("landing.prices.plans.basic.title") }}
                </div>

                <!-- description -->
                <div class="q-mt-sm text-grey">
                  {{ $t("landing.prices.plans.basic.description") }}
                </div>

                <!-- price & period -->
                <div class="row no-wrap items-end q-my-md">
                  <div class="text-36 text-semibold">
                    {{ $t("landing.prices.plans.basic.price") }}
                  </div>
                  <div class="text-grey q-mb-sm q-ml-xs text-weight-medium">
                    {{ $t("landing.prices.plans.basic.period") }}
                  </div>
                </div>

                <!-- participants limit -->
                <div class="row no-wrap items-center">
                  <q-icon
                    name="icon-profile_group"
                    color="primary"
                    size="20px"
                  />
                  <div class="text-semibold q-ml-sm">
                    {{ $t("landing.prices.plans.basic.participantsLimit") }}
                  </div>
                </div>

                <q-separator />

                <!-- features -->
                <div class="column no-wrap q-gutter-sm">
                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.basic.features.one") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.basic.features.two") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.basic.features.three") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.basic.features.four") }}
                    </div>
                  </div>
                </div>

                <q-separator />

                <!-- action -->
                <q-btn
                  unelevated
                  color="primary"
                  :label="$t('landing.prices.plans.basic.action')"
                  no-caps
                  class="full-width"
                  :href="appUrl + ROUTE_PATHS.AUTH.SIGNUP"
                />
              </q-card-section>
            </q-card>

            <!-- pro -->
            <q-card flat bordered class="bg-white">
              <q-card-section>
                <!-- title -->
                <div class="text-18 text-semibold">
                  {{ $t("landing.prices.plans.pro.title") }}
                </div>

                <!-- description -->
                <div class="q-mt-sm text-grey">
                  {{ $t("landing.prices.plans.pro.description") }}
                </div>

                <!-- price & period -->
                <div class="row no-wrap items-end q-my-md">
                  <div class="text-36 text-semibold">
                    {{ $t("landing.prices.plans.pro.price") }}
                  </div>
                  <div class="text-grey q-mb-sm q-ml-xs text-weight-medium">
                    {{ $t("landing.prices.plans.pro.period") }}
                  </div>
                </div>

                <!-- participants limit -->
                <div class="row no-wrap items-center">
                  <q-icon
                    name="icon-profile_group"
                    color="primary"
                    size="20px"
                  />
                  <div class="text-semibold q-ml-sm">
                    {{ $t("landing.prices.plans.pro.participantsLimit") }}
                  </div>
                </div>

                <q-separator />

                <!-- features -->
                <div class="column no-wrap q-gutter-sm">
                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.pro.features.one") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.pro.features.two") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.pro.features.three") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.pro.features.four") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.pro.features.five") }}
                    </div>
                  </div>
                </div>

                <q-separator />

                <!-- action -->
                <q-btn
                  outline
                  color="grey-9"
                  :label="$t('landing.prices.plans.pro.action')"
                  no-caps
                  class="full-width"
                  :href="appUrl + ROUTE_PATHS.AUTH.SIGNUP"
                />
              </q-card-section>
            </q-card>
          </div>

          <!-- contact -->
          <div class="text-weight-medium text-16 text-center q-mt-lg">
            {{ $t("landing.prices.contact.title") }}
            <a href="mailto:hello@prezio.ru" class="link text-underline">
              {{ $t("landing.prices.contact.mail") }}
            </a>
            .
          </div>
        </div>
      </div>
    </div>

    <!-- faq -->
    <div id="faq" class="bg-white q-py-xl">
      <div class="container">
        <div class="q-py-xl">
          <!-- title -->
          <div class="text-h4 text-semibold text-center q-mb-xl">
            {{ $t("landing.faq.title") }}
          </div>

          <q-separator />

          <q-expansion-item
            group="faq"
            :label="$t('landing.faq.list.one.title')"
            expand-icon="r_add"
          >
            <q-card class="bg-grey-1">
              <q-card-section class="q-px-lg q-pb-lg q-pt-none text-16">
                {{ $t("landing.faq.list.one.description") }}
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-separator />

          <q-expansion-item
            group="faq"
            :label="$t('landing.faq.list.two.title')"
            expand-icon="r_add"
          >
            <q-card class="bg-grey-1">
              <q-card-section class="q-px-lg q-pb-lg q-pt-none text-16">
                {{ $t("landing.faq.list.two.description") }}
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-separator />

          <q-expansion-item
            group="faq"
            :label="$t('landing.faq.list.three.title')"
            expand-icon="r_add"
          >
            <q-card class="bg-grey-1">
              <q-card-section class="q-px-lg q-pb-lg q-pt-none text-16">
                {{ $t("landing.faq.list.three.description") }}
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-separator />

          <q-expansion-item
            group="faq"
            :label="$t('landing.faq.list.four.title')"
            expand-icon="r_add"
          >
            <q-card class="bg-grey-1">
              <q-card-section class="q-px-lg q-pb-lg q-pt-none text-16">
                {{ $t("landing.faq.list.four.description") }}
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </div>
    </div>

    <!-- promo -->
    <div id="promo" class="promo relative-position overflow-hidden q-py-xl">
      <div class="q-my-xl">
        <!-- title -->
        <div class="text-center text-36">{{ $t("landing.promo.title") }}</div>

        <!-- description -->
        <div class="text-center text-16 q-mt-3xs">
          {{ $t("landing.promo.description") }}
        </div>

        <!-- create presentation -->
        <div class="row justify-center q-mt-xl">
          <q-btn
            :label="$t('landing.promo.action')"
            unelevated
            color="primary"
            no-caps
            size="16px"
            :href="appUrl + ROUTE_PATHS.AUTH.SIGNUP"
          />
        </div>

        <!-- background -->
        <div class="absolute" style="top: 0; left: 0; width: 100%">
          <div class="container">
            <q-img
              src="/assets/images/landing/bubbles.png"
              style="width: 100%"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- footer -->
    <div id="footer">
      <div class="q-py-xl q-my-lg">
        <!-- logo -->
        <div class="row justify-center no-wrap">
          <img
            :src="$q.screen.lt.md ? '/logo.svg' : '/prezio.svg'"
            style="height: 30px"
          />

          <div class="q-ml-sm column">
            <q-badge
              class="bg-grey-2 text-grey-7"
              style="font-size: 10px; margin-top: 3px"
              :label="VERSION"
            />
          </div>
        </div>

        <div class="row justify-center q-mt-lg">
          <div class="text-center" style="max-width: 340px">
            {{ $t("landing.footer.title") }}
          </div>
        </div>
      </div>

      <div class="footer">
        <div
          class="q-py-lg q-my-sm q-px-xl q-mx-xl text-grey-9 text-12 row no-wrap"
        >
          <div>
            © {{ new Date().getFullYear() }} Prezio -
            {{ $t("landing.footer.allRightsReserved") }}
          </div>

          <q-space />

          <div>
            {{ $t("landing.footer.madeInRussia") }}
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useMeta } from "quasar";
import { useI18n } from "vue-i18n";
import { ROUTE_PATHS, SUBDOMAINS } from "src/constants/routes";
import { computed, onMounted, ref } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";

/*
 * assembly version
 */
const VERSION = computed(() => {
  return process.env.VERSION;
});

/*
 * url
 */
const appUrl =
  // protocol
  window.location.protocol +
  "//" +
  // subdomain
  SUBDOMAINS.app +
  "." +
  // host
  window.location.host;

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const router = useRouter();

/*
 * join room
 */
const showJoinRoomToolbar = ref(true);

const roomId = ref();
const roomSearchError = ref();

const handleRoomSearch = () => {
  api
    .get(`/room/${roomId.value}`)
    .then((response) => {
      router.push(response.data.room.token);
    })
    .catch((error) => {
      console.log(error);
      roomSearchError.value = error.response.data.message;

      $q.notify({
        message: error.response.data.message,
        color: "red",
        icon: "r_crisis_alert",
      });
    });
};

/*
 * typing animation
 */
const dynamicTitles = [
  t("landing.heroes.title.dynamic.one"),
  t("landing.heroes.title.dynamic.two"),
  t("landing.heroes.title.dynamic.three"),
];

const TxtType = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = "";
  this.tick();
  this.isDeleting = false;
};

TxtType.prototype.tick = function () {
  let i = this.loopNum % this.toRotate.length;
  let fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  const colors = ["var(--q-primary)", "#F53535", "#8136DC"];
  const color = colors[i % colors.length];

  this.el.innerHTML = `<span class="wrap" style="color: ${color}; border-right: 0.08em solid ${color}; animation: pulse 1s infinite steps(1);">
    ${this.txt}
    </span>`;

  let that = this;
  let delta = 200 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(() => {
    that.tick();
  }, delta);
};

onMounted(() => {
  let elements = document.getElementsByClassName("typewrite");
  for (let i = 0; i < elements.length; i++) {
    let toRotate = elements[i].getAttribute("data-type");
    let period = elements[i].getAttribute("data-period");
    if (toRotate) {
      new TxtType(elements[i], toRotate.split(","), period);
    }
  }
});

/*
 * meta
 */
useMeta({
  title: t("meta.app"),
  titleTemplate: (title) => `${title} - ${t("meta.homepage.title")}`,

  // meta tags
  meta: {
    description: {
      name: "description",
      content: t("meta.homepage.description"),
    },
    keywords: {
      name: "keywords",
      content: t("meta.homepage.keywords"),
    },
    equiv: {
      "http-equiv": "Content-Type",
      content: "text/html; charset=UTF-8",
    },
    // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
    ogTitle: {
      property: "og:title",
      // optional; similar to titleTemplate, but allows templating with other meta properties
      template(ogTitle) {
        return `${ogTitle} - ${t("meta.homepage.title")}`;
      },
    },
  },

  // CSS tags
  link: {
    material: {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/icon?family=Material+Icons",
    },
  },

  // JS tags
  script: {
    ldJson: {
      type: "application/ld+json",
      innerHTML: `{ "@context": "http://schema.org" }`,
    },
  },

  // <html> attributes
  htmlAttr: {
    "xmlns:cc": "http://creativecommons.org/ns#", // generates <html xmlns:cc="http://creativecommons.org/ns#">,
    empty: undefined, // generates <html empty>
  },

  // <body> attributes
  bodyAttr: {
    "action-scope": "xyz", // generates <body action-scope="xyz">
    empty: undefined, // generates <body empty>
  },

  // <noscript> tags
  noscript: {
    default: "This is content for browsers with no JS (or disabled JS)",
  },
});
</script>

<style scoped lang="scss">
.q-page {
  background: $grey-1;
}

.container {
  max-width: 1200px;
  padding: 0;
}

.splitter {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
}

.betefit_cards_grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  .betefit_card {
    background: $grey-1;
    border-radius: 1.25em;
  }
}

.join_room {
  background: linear-gradient(
    90deg,
    rgba(233, 238, 253, 1) 0%,
    rgba(249, 233, 243, 1) 100%
  );

  border-top: 1px solid #e8e8eb;
}

::v-deep(.join_room__token_input) {
  .q-field__control {
    border-radius: 10px;
    background: $white;
    padding: 0 5px 0 10px !important;
    //padding: 0 8px !important;
    width: 321px;
  }
  .q-field__prepend {
    padding-right: 4px !important;
  }
}

.plans_grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  .q-card {
    align-self: start;
    border-radius: 12px;

    .q-card__section {
      padding: 20px;

      .q-separator {
        margin: 20px 0;
      }
    }
  }
}

.q-separator {
  background: $grey-2;
}

::v-deep(.q-expansion-item) {
  margin: 16px 0;

  .q-item {
    padding-left: 0;
    padding-right: 24px;
    transition: 0.3s;
  }

  &.q-expansion-item--expanded {
    .q-item {
      padding: 24px;
      background: $grey-1;
      border-radius: 12px 12px 0 0;
      padding-top: 24px;
    }

    .q-card {
      border-radius: 0 0 12px 12px;
    }
  }

  .q-item__label {
    font-weight: 600;
    font-size: 18px;
  }

  &:hover {
    .q-item__label {
      text-decoration: underline;
    }
  }

  .q-focus-helper {
    display: none;
  }
}

.promo {
  background: linear-gradient(
    89.92deg,
    rgba(233, 238, 253, 0.8) 0.07%,
    #f9e9f3 98.96%
  );
}

.footer {
  border-top: 1px solid #e6e6e6;
}
</style>

<style lang="scss">
@keyframes pulse {
  0%,
  100% {
    border-color: currentColor;
  }
  50% {
    border-color: $grey-3;
  }
}
</style>
