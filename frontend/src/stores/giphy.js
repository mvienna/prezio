import { defineStore } from "pinia";

export const useGiphyStore = defineStore("giphy", {
  state: () => ({
    giphy: {
      gifs: [],
      pagination: {
        offset: 1,
        limit: 25,
        rating: "g",
        lang: "en",
      },

      search: "",

      isLoading: false,
    },
  }),

  actions: {
    async fetchGiphyGifs(index = null, done = null) {
      this.giphy.isLoading = true;

      const isSearching =
        this.giphy.search && this.giphy.search?.trim()?.length;
      this.giphy.pagination.offset = index * this.giphy.pagination.limit;

      console.log(this.giphy.pagination);
      const request = isSearching
        ? "https://api.giphy.com/v1/gifs/search?" +
          new URLSearchParams({
            api_key: process.env.GIPHY_API_KEY,
            lang: this.giphy.pagination.lang,
            limit: this.giphy.pagination.limit,
            offset: this.giphy.pagination.offset,
            q: this.giphy.search,
          })
        : "https://api.giphy.com/v1/gifs/trending?" +
          new URLSearchParams({
            api_key: process.env.GIPHY_API_KEY,
            limit: this.giphy.pagination.limit,
            offset: this.giphy.pagination.offset,
          });

      await fetch(request)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          console.log(response);

          this.giphy.gifs = [...this.giphy.gifs, ...response.data];
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.giphy.isLoading = false;
        });

      if (done) {
        done();
      }
    },
  },
});
