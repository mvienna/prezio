import { ref, computed } from "vue";

const timeLeft = ref(-1);
const timeLeftPercentage = ref();
const countdownInterval = ref();

const startCountdown = (seconds = 60) => {
  stopCountdown();

  timeLeft.value = seconds;

  countdownInterval.value = setInterval(() => {
    if (timeLeft.value === 0.0) {
      stopCountdown();
      return;
    }

    timeLeft.value = parseFloat((timeLeft.value - 0.1).toFixed(2));
    timeLeftPercentage.value = ((seconds - timeLeft.value) * 100) / seconds;
  }, 100);
};

const stopCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value);
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
