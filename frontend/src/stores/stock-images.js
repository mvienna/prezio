import { defineStore } from "pinia";

export const useStockImagesStore = defineStore("stockImages", {
  state: () => ({
    stockImages: [],
    pagination: {
      page: 1,
      per_page: 100,
      order_by: "popular", // latest, oldest, popular
    },

    search: "",

    isLoading: false,
  }),

  actions: {
    async fetchStockImages(index = null, done = null) {
      const isSearching = this.search && this.search?.trim()?.length;
      this.pagination.page = index;

      const request = isSearching
        ? "https://api.unsplash.com/search/photos?" +
          new URLSearchParams({
            client_id: process.env.UNSPLASH_ACCESS_KEY,
            page: this.pagination.page,
            per_page: this.pagination.per_page,
            order_by: this.pagination.order_by,
            query: this.search,
            // language: process.env.APP_LANG.split('-')[0],
          })
        : "https://api.unsplash.com/photos?" +
          new URLSearchParams({
            client_id: process.env.UNSPLASH_ACCESS_KEY,
            page: this.pagination.page,
            per_page: this.pagination.per_page,
            order_by: this.pagination.order_by,
          });

      await fetch(request)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          this.stockImages = [
            ...this.stockImages,
            ...(isSearching ? response.results : response),
          ];
        })
        .catch((error) => {
          console.log(error);
        });

      if (done) {
        done();
      }
    },
  },
});
