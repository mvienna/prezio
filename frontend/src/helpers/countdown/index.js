import { ref, computed } from "vue";

const timeLeft = ref(-1);
const timeLeftPercentage = ref();
let countdownWorker;

const startCountdown = (seconds = 60) => {
  stopCountdown();

  timeLeft.value = seconds;

  countdownWorker = new Worker(new URL("./worker.js", import.meta.url));
  countdownWorker.onmessage = (event) => {
    if (event.data === "countdownComplete") {
      stopCountdown();
    } else {
      timeLeft.value = event.data.timeLeft;
      timeLeftPercentage.value = event.data.timeLeftPercentage;
    }
  };

  countdownWorker.postMessage(seconds);
};

const stopCountdown = () => {
  if (countdownWorker) {
    countdownWorker.terminate();
    timeLeft.value = -1;
    timeLeftPercentage.value = null;
  }
};

const countdown = computed(() => {
  const intTimeLeft = Math.floor(timeLeft.value);
  const minutes = Math.floor(intTimeLeft / 60);
  const seconds = intTimeLeft % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
});

export {
  startCountdown,
  stopCountdown,
  countdown,
  timeLeft,
  timeLeftPercentage,
};
