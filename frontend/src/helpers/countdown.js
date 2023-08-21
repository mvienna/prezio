import { ref, computed } from "vue";

const timeLeft = ref();
const countdownInterval = ref();

const startCountdown = (seconds = 60) => {
  // clear previous interval
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value);
  }

  // set seconds
  timeLeft.value = seconds;

  // start interval
  countdownInterval.value = setInterval(() => {
    timeLeft.value--;

    if (timeLeft.value === 0) {
      clearInterval(countdownInterval.value);
    }
  }, 1000);
};

const countdown = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
});

export { startCountdown, countdown, timeLeft };
