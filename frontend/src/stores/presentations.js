import { defineStore } from "pinia";
import { api } from "boot/axios";

export const usePresentationsStore = defineStore("presentations", {
  state: () => ({
    /*
     * room
     */
    room: null,
    participant: null,
    showRoomInvitationPanel: false,

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

    isPresentationPreview: false,

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
     * folders
     */
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
     * presentations
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

    /*
     * presentation
     */
    async fetchPresentationData(id) {
      return await api
        .get(`/presentation/${id}`)
        .then((response) => {
          this.presentation = response.data;
          this.setSlide(this.presentation.slides[0]);
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
          const presentationIndex = this.presentations.findIndex(
            (item) => item.id === presentation.id
          );
          this.presentations[presentationIndex] = presentation;
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    },

    async deletePresentation(presentation = this.presentation) {
      return await api
        .delete(`/presentation/${presentation.id}`)
        .catch((error) => {
          console.log(error.response.data.message);
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
     * slides
     */
    async addNewSlide(elements = null, type) {
      const response = await api
        .post(`/presentation/${this.presentation.id}/slide`, {
          canvas_data: JSON.stringify(elements),
          order: this.presentation.slides.length,
          type: type,
        })
        .catch((error) => {
          console.log(error);
        });

      this.presentation.slides.push(response.data);
      return await this.setSlide(response.data);
    },

    saveSlide(slide = this.slide, elements) {
      this.isSavingError = false;
      this.isSaving = true;

      api
        .patch(`/presentation/${this.presentation.id}/slide/${slide.id}`, {
          canvas_data: elements,
          preview: slide.preview,
          order: slide.order,
          type: slide.type,
          notes: slide.notes,
          animation: slide.animation,
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
      // add new slide
      await this.addNewSlide(elements, slide.type);

      // // copy original slides props into the new one
      // this.slide = {
      //   ...this.slide,
      //   canvas_data: slide.canvas_data,
      //   preview: slide.preview,
      //   notes: slide.notes,
      //   animation: slide.animation,
      // };
      // this.updateLocalSlide();
      //
      // // save new slide
      // this.saveSlide(undefined, elements);
    },

    async deleteSlide(slide) {
      if (this.presentation.slides.length === 1) return;

      return await api
        .delete(`/presentation/${this.presentation.id}/slide/${slide.id}`)
        .then(() => {
          this.presentation.slides = this.presentation.slides.filter(
            (item) => item.id !== slide.id
          );
          this.setSlide(this.presentation.slides[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    /*
     * slide
     */
    async setSlide(newSlide, elements = null, saveSlide = true) {
      if (this.slide?.id === newSlide.id) return;

      // save previous slide
      if (this.slide && elements && saveSlide) {
        this.slide.canvas_data = JSON.stringify(elements);
        this.updateLocalSlide();
        this.saveSlide(undefined, elements);
      }

      this.slide = newSlide;
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
      this.presentation.slides[slideIndex] = this.slide;
    },

    /*
     * room
     */
    sendPresentationRoomUpdateEvent(
      presentation_id = this.presentation?.id,
      room_id = this.room?.id,
      slide_id = this.slide?.id
    ) {
      api
        .patch(`/presentation/${presentation_id}/room/${room_id}`, {
          slide_id: slide_id,
          showRoomInvitationPanel: this.showRoomInvitationPanel,
        })
        .catch((error) => {
          console.log(error);
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

    async sendPresentationRoomReaction(reaction) {
      if (!reaction) return;

      return await api
        .post(
          `/presentation/${this.presentation?.id}/room/${this.room?.id}/react`,
          {
            reaction: reaction,
          }
        )
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },
  },
});
