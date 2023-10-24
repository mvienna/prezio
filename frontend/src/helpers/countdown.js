import { ref, computed } from "vue";

const timeLeft = ref();
const timeLeftPercentage = ref();
const countdownInterval = ref();

const startCountdown = (seconds = 60) => {
  stopCountdown();

  timeLeft.value = seconds;

  countdownInterval.value = setInterval(() => {
    timeLeft.value--;
    timeLeftPercentage.value = ((seconds - timeLeft.value) * 100) / seconds;

    if (timeLeft.value === 0) {
      stopCountdown();
    }
  }, 1000);
};

const stopCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value);
    timeLeft.value = 0;
    timeLeftPercentage.value = 0;
  }
};

const countdown = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
});

export {
  startCountdown,
  stopCountdown,
  countdown,
  timeLeft,
  timeLeftPercentage,
};
