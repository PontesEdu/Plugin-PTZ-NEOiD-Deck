const { streamDeckClient } = SDPIComponents;


streamDeckClient.on('connected', (jsn) => {
  console.log('Property Inspector conectado', jsn);
  // settings ja são carregadas nos componentes automaticamente
});

// Quando o usuário interagir com os componentes, sdpi-components atualiza automaticamente
// Você pode usar também um botão ou evento manual se quiser.

// Opcional: observar mudanças e imprimir no console
streamDeckClient.getSettings().then(settings => {
  console.log('Configurações iniciais:', settings);
});
//ou podemos fazer:
// streamDeckClient.setSettings({ tilt: 45, speed: 7, direction: 'right' });


streamDeckClient.on('sendToPropertyInspector', (event) => {
  const { command, key, image } = event.payload;

  if (command === "savePresetImage") {
    localStorage.setItem(key, image); // Salva no localStorage
  }

  if (command === "getPresetImage") {
    const img = localStorage.getItem(key) || null;
    streamDeckClient.sendToPlugin({
      command: "presetImage",
      key,
      image: img
    });
  }
});