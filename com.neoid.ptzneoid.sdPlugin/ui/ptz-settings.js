
const { streamDeckClient } = SDPIComponents;

// Quando o painel carregar
streamDeckClient.on('connected', (jsn) => {
  console.log("Conectado!", jsn);

  // Se quiser carregar configs salvas:
  const settings = jsn.actionInfo.payload.settings;
  document.getElementById("speed").value = settings.speed || 1;
  document.getElementById("tilt").value = settings.tilt || 0;
});

// Exemplo: salvando configurações
function saveSettings() {
  const speed = document.getElementById("speed").value;
  const tilt = document.getElementById("tilt").value;

  streamDeckClient.setSettings({
    speed,
    tilt,
  });
}

// Exemplo: ouvindo mudanças nos inputs
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("speed").addEventListener("input", saveSettings);
  document.getElementById("tilt").addEventListener("input", saveSettings);
});


