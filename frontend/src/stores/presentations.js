import { defineStore } from "pinia";
import { api } from "boot/axios";
import { startCountdown, timeLeft } from "src/helpers/countdown";
import { SLIDE_TYPES_OF_QUIZ } from "src/constants/presentationStudio";

export const usePresentationsStore = defineStore("presentations", {
  state: () => ({
    /*
     * room
     * participant
     */
    room: null,

    participant: null,
    participants: [],
    isGuest: false,

    showRoomInvitationPanel: false,
    showRoomInformationPanel: true,

    averageRoomBackgroundBrightness: 0,
    roomBackgroundBrightnessThreshold: 128,

    /*
     * folders
     */
    folders: [],
    selectedFolder: null,

    /*
     * presentations
     */
    pagination: {
      sortBy: "updated_at",
      descending: true,
      page: 1,
      rowsPerPage: 10,
    },
    presentations: [],
    selectedPresentations: [],
    search: "",

    userHasPresentations: true,

    /*
     * presentation
     */
    presentation: null,
    slide: null,
    slideSettings: null,

    isPresentationPreview: false,

    showSettingsDialog: false,
    presentationSettingsTabsExpanded: [],

    /*
     * save
     */
    lastChangedAt: null,
    lastSavedAt: null,
    isSaving: false,
    isSavingError: false,

    /*
     * state
     */
    isLoading: {
      fetchingPresentations: false,
      fetchingFolders: false,

      creatingPresentation: false,
      creatingFolder: false,
    },
  }),

  actions: {
    /*
     * FOLDERS API
     */
    fetchFolders() {
      this.isLoading.fetchingFolders = true;
      api
        .get("/folders")
        .then((response) => {
          this.folders = response.data;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading.fetchingFolders = false;
        });
    },

    async createNewFolder(data) {
      this.isLoading.creatingFolder = true;

      return await api
        .post("/folder", {
          name: data.name,
          description: data.description,
          is_private: data.is_private,
          presentations_ids: data.presentationsIds,
        })
        .then((response) => {
          this.folders.push(response.data);
          this.selectedFolder = response.data;

          this.fetchPresentations();
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading.creatingFolder = false;
        });
    },

    async updateFolder(folder) {
      return await api
        .patch(`/folder/${folder.id}`, {
          name: folder.name,
          description: folder.description,
          is_private: folder.is_private,
        })
        .catch((error) => {
          console.log(error);
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    },

    async deleteFolder(folder) {
      return await api
        .delete(`/folder/${folder.id}`)
        .then(() => {
          this.folders = this.folders.filter((item) => item.id !== folder.id);

          if (this.selectedFolder?.id === folder.id) {
            this.selectedFolder = null;
          }

          this.fetchPresentations();
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    },

    /*
     * PRESENTATIONS API
     */
    fetchPresentations(props = null) {
      const { page, rowsPerPage, sortBy, descending } =
        props?.pagination || this.pagination;

      const params = new URLSearchParams({
        page: page,
        limit: rowsPerPage,
        descending: descending,
        ...(sortBy || {}),

        ...(this.selectedFolder ? { folder_id: this.selectedFolder.id } : {}),
      });

      this.isLoading.fetchingPresentations = true;
      api
        .get(`/presentations?${params}`)
        .then((response) => {
          this.presentations = response.data.rows;

          this.userHasPresentations = response.data.userHasPresentations;

          this.pagination = {
            rowsNumber: response.data.total,
            page: page,
            rowsPerPage: rowsPerPage,
            sortBy: sortBy,
            descending: descending,
          };
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading.fetchingPresentations = false;
        });
    },

    /*
     * PRESENTATION API
     */
    async fetchPresentationData(id) {
      return await api
        .get(`/presentation/${id}`)
        .then((response) => {
          this.presentation = response.data;
          this.presentation.settings.is_fullscreen = Boolean(
            this.presentation.settings.is_fullscreen
          );

          const lastSlide = this.presentation.slides.find(
            (slide) => slide.id === this.presentation.settings.last_slide_id
          );

          this.setSlide(lastSlide || this.presentation.slides[0]);
        })
        .catch((error) => {
          throw error.response.data.message;
        });
    },

    async updatePresentation(presentation = this.presentation) {
      return await api
        .patch(`/presentation/${presentation.id}`, {
          name: presentation.name,
          folder_id: presentation.folder_id,
          description: presentation.description,
          preview_id: presentation.preview_id,
          is_private: presentation.is_private,
          settings: presentation.settings,
        })
        .then(() => {
          const presentationIndex = this.presentations?.findIndex(
            (item) => item.id === presentation.id
          );
          if (presentationIndex !== -1) {
            this.presentations[presentationIndex] = presentation;
          }
        })
        .catch((error) => {
          console.log(error.response?.data?.message);
        });
    },

    async deletePresentation(presentation = this.presentation) {
      return await api
        .delete(`/presentation/${presentation.id}`)
        .catch((error) => {
          console.log(error.response?.data?.message);
        });
    },

    async createNewPresentation(data) {
      this.isLoading.creatingPresentation = true;

      return await api
        .post("/presentation", {
          name: data.name,
          description: data.description,
          folder_id: data.folder_id,
          is_private: data.is_private,
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading.creatingPresentation = false;
        });
    },

    /*
     * SLIDES API
     */
    async fetchSlideData(slideId = this.slide.id) {
      return await api
        .get(`/presentation/${this.presentation.id}/slide/${slideId}`)
        .catch((error) => {
          console.log(error);
        });
    },

    async addNewSlide(elements = null, type) {
      const slideIndex = this.presentation.slides.findIndex(
        (item) => item.id === this.slide.id
      );
      const insertAtIndex = slideIndex + 1;

      const response = await api
        .post(`/presentation/${this.presentation.id}/slide`, {
          canvas_data: JSON.stringify(elements),
          order: insertAtIndex,
          type: type,
        })
        .catch((error) => {
          console.log(error);
        });

      this.presentation.slides.splice(insertAtIndex, 0, response.data);

      this.presentation.slides = this.presentation.slides.map((item, index) => {
        item.order = index;
        return item;
      });
      await this.updateSlidesOrder();

      return await this.setSlide(response.data);
    },

    async saveSlide(slide = this.slide, elements, newSlide) {
      this.isSavingError = false;
      this.isSaving = true;

      return await api
        .patch(`/presentation/${this.presentation.id}/slide/${slide.id}`, {
          canvas_data: elements,
          preview: slide.preview,
          order: slide.order,
          type: slide.type,
          settings_data: slide.settings_data,
          notes: slide.notes,
          animation: slide.animation,
          last_slide_id: newSlide?.id || slide?.id,
        })
        .then(() => {
          this.lastSavedAt = new Date();
        })
        .catch((error) => {
          console.log(error);
          this.isSavingError = true;
        })
        .finally(() => {
          this.isSaving = false;
        });
    },

    async duplicateSlide(slide, elements) {
      await this.addNewSlide(elements, slide.type);
    },

    async deleteSlide(slide) {
      if (this.presentation.slides.length === 1) return;

      const slideIndex = this.presentation.slides.findIndex(
        (item) => item.id === slide.id
      );

      const slideToShowAfterDeleting =
        this.presentation.slides[slideIndex + (slideIndex !== 0 ? -1 : 1)];

      return await api
        .delete(`/presentation/${this.presentation.id}/slide/${slide.id}`)
        .then(() => {
          this.presentation.slides = this.presentation.slides.filter(
            (item) => item.id !== slide.id
          );
          this.setSlide(slideToShowAfterDeleting);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    /*
     * SLIDE - LOCAL
     */
    async setSlide(newSlide, elements = null, saveSlide = true) {
      if (!newSlide || this.slide?.id === newSlide.id) return;

      // save previous slide
      if (this.slide && elements && saveSlide) {
        this.slide.canvas_data = JSON.stringify(elements);
        this.updateLocalSlide();
        this.saveSlide(undefined, elements, newSlide);
      }

      this.slide = newSlide;
      this.slideSettings = this.slide.settings_data
        ? JSON.parse(this.slide.settings_data)
        : {};
    },

    async updateSlidesOrder() {
      return await api
        .patch(`/presentation/${this.presentation.id}/slides`, {
          slides: this.presentation.slides,
        })
        .then((response) => {
          response.data.slides.forEach((slide, index) => {
            this.presentation.slides[index].order = slide.order;
          });

          this.setSlide(
            this.presentation.slides.find((item) => item.id === this.slide.id)
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },

    updateLocalSlide() {
      const slideIndex = this.presentation.slides.findIndex(
        (item) => item.id === this.slide.id
      );
      this.slide.settings_data = JSON.stringify(this.slideSettings);
      this.presentation.slides[slideIndex] = this.slide;
    },

    /*
     * room
     */
    async sendPresentationRoomUpdateEvent(
      presentation_id = this.presentation?.id,
      room_id = this.room?.id,
      slide_id = this.slide?.id,
      token = null,
      data = null
    ) {
      if (!presentation_id || !room_id) return;

      return await api
        .patch(`/presentation/${presentation_id}/room/${room_id}`, {
          slide_id: slide_id,
          token: token,
          data: data,
        })
        .catch((error) => {
          throw {
            message: error.response.data.message,
            details: error.response.data.details,
          };
        });
    },

    async loginRoom(data) {
      return await api
        .post(`/room/login`, {
          room_id: this.room?.id,
          data: JSON.stringify(data),
        })
        .then((response) => {
          this.participant = response.data.participant;

          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.token}`;

          localStorage.setItem("participantToken", response.data.token);
        });
    },

    async sendPresentationRoomReaction(
      reaction,
      presentation_id = this.presentation?.id,
      room_id = this.room?.id
    ) {
      if (!reaction) return;

      return await api
        .post(`/presentation/${presentation_id}/room/${room_id}/react`, {
          reaction: reaction,
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },

    async submitPresentationRoomAnswers(answers) {
      answers = answers.filter((answer) => answer?.value?.length);
      if (!answers?.length) return;

      let totalScore = null;

      if (SLIDE_TYPES_OF_QUIZ.includes(this.slide?.type)) {
        totalScore = 0;
        let pointForCorrectAnswer = this.slideSettings.points.max;

        // compute points for correct answer by speed of answering
        if (this.slideSettings.scoreDependsOnTime) {
          const pointsPerSecond =
            (this.slideSettings.points.max - this.slideSettings.points.min) /
            this.slideSettings.timeLimit;

          const secondsTookToAnswer =
            this.slideSettings.timeLimit - timeLeft.value;

          pointForCorrectAnswer = Math.round(
            this.slideSettings.points.max -
              pointsPerSecond * secondsTookToAnswer
          );
        }

        // partial scoring
        if (this.slideSettings.partialScoring) {
          const computeScore = () => {
            let score = 0;

            for (const answer of answers) {
              if (answer.isCorrect === false) {
                return this.slideSettings.points.min;
              } else if (answer.isCorrect === true) {
                score += pointForCorrectAnswer;
              }
            }

            return score;
          };

          totalScore = computeScore();

          // whole scoring
        } else {
          const computeScore = () => {
            if (answers.some((option) => option.isCorrect === false)) {
              return this.slideSettings.points.min;
            } else {
              return pointForCorrectAnswer;
            }
          };

          totalScore = computeScore();
        }
      }

      answers = answers.map((answer) => answer.value);

      return await api
        .post(
          `/presentation/${this.presentation?.id}/room/${this.room?.id}/submit-answers`,
          {
            slide_id: this.slide?.id,
            answers: answers,
            score:
              answers.length > 1 && totalScore
                ? totalScore / answers.length
                : totalScore,
            time_taken_to_answer: this.slideSettings.isLimitedTime
              ? this.slideSettings.timeLimit - timeLeft.value
              : null,
          }
        )
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },

    handleQuizStart() {
      this.room.is_quiz_started = true;

      let timeout = 5000;
      if (
        (this.presentation.settings.quiz_data &&
          JSON.parse(this.presentation.settings.quiz_data).countdown) ||
        !this.presentation.settings.quiz_data
      ) {
        timeout += 5000;
      }

      startCountdown(timeout / 1000);
      this.room.is_submission_locked = true;
      this.sendPresentationRoomUpdateEvent(
        undefined,
        undefined,
        undefined,
        undefined,
        {
          is_submission_locked: this.room.is_submission_locked,
          countdown: timeout / 1000,
          is_quiz_started: this.room.is_quiz_started,
        }
      );

      setTimeout(() => {
        this.room.is_submission_locked = false;
        startCountdown(this.slideSettings.timeLimit);

        this.sendPresentationRoomUpdateEvent(
          undefined,
          undefined,
          undefined,
          undefined,
          {
            is_submission_locked: this.room.is_submission_locked,
            countdown: this.slideSettings.timeLimit,
            is_quiz_started: this.room.is_quiz_started,
          }
        );
      }, timeout);
    },
  },
});
