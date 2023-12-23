let countdownInterval;

onmessage = function (event) {
  const seconds = event.data;
  let timeLeft = seconds;

  countdownInterval = setInterval(() => {
    if (timeLeft === 0) {
      clearInterval(countdownInterval);
      postMessage("countdownComplete");
      return;
    }

    timeLeft = parseFloat((timeLeft - 0.1).toFixed(2));
    const timeLeftPercentage = ((seconds - timeLeft) * 100) / seconds;

    postMessage({
      timeLeft: timeLeft,
      timeLeftPercentage: timeLeftPercentage,
    });
  }, 100);
};
