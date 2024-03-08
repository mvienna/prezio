import { defineStore } from "pinia";

export const useUnsplashStore = defineStore("unsplash", {
  state: () => ({
    unsplash: {
      images: [],
      pagination: {
        page: 1,
        per_page: 100,
        order_by: "popular", // latest, oldest, popular
      },

      search: "",

      isLoading: false,
    },
  }),

  actions: {
    async fetchUnsplashImages(index = null, done = null) {
      this.unsplash.isLoading = true;

      const isSearching =
        this.unsplash.search && this.unsplash.search?.trim()?.length;
      this.unsplash.pagination.page = index;

      const request = isSearching
        ? "https://api.unsplash.com/search/photos?" +
          new URLSearchParams({
            client_id: process.env.UNSPLASH_ACCESS_KEY,
            page: this.unsplash.pagination.page,
            per_page: this.unsplash.pagination.per_page,
            order_by: this.unsplash.pagination.order_by,
            query: this.unsplash.search,
            // language: process.env.APP_LANG.split('-')[0],
          })
        : "https://api.unsplash.com/photos?" +
          new URLSearchParams({
            client_id: process.env.UNSPLASH_ACCESS_KEY,
            page: this.unsplash.pagination.page,
            per_page: this.unsplash.pagination.per_page,
            order_by: this.unsplash.pagination.order_by,
          });

      await fetch(request)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          this.unsplash.images = [
            ...this.unsplash.images,
            ...(isSearching ? response.results : response),
          ];
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.unsplash.isLoading = false;
        });

      if (done) {
        done();
      }
    },
  },
});
