import { defineStore } from "pinia";

new Audio("src/assets/sound/error_sca.wav");

const useSoundStore = () =>
  defineStore("sound", {
    state: () => ({
      soundError: new Audio("src/assets/sound/error_scan.wav"),
    }),
    actions: {
      async playError() {
        await this.soundError.play();
      },
    },
  });

export default useSoundStore;
