

document.addEventListener("DOMContentLoaded", () => {
  const speedInput = document.getElementById("speed");
  const tiltInput = document.getElementById("tilt");

  // Recebe as settings e atualiza os inputs
  $PI.onDidReceiveSettings(({ settings }) => {
    if (settings.speed) speedInput.value = settings.speed;
    if (settings.tilt) tiltInput.value = settings.tilt;
  });

  function updateSettings() {
    const newSettings = {
      speed: parseInt(speedInput.value, 10),
      tilt: parseInt(tiltInput.value, 10)
    };
    $PI.setSettings(newSettings);
  }

  speedInput.addEventListener("input", updateSettings);
  tiltInput.addEventListener("input", updateSettings);
});
