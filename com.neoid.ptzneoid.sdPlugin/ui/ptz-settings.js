const { streamDeckClient } = SDPIComponents;


streamDeckClient.on('connected', (jsn) => {
  console.log('Property Inspector conectado', jsn);
  // settings ja são carregadas nos componentes automaticamente
});

// Quando o usuário interagir com os componentes, sdpi-components atualiza automaticamente
// Você pode usar também um botão ou evento manual se quiser.

// Opcional: observar mudanças e imprimir no console
streamDeckClient.getSettings().then(settings => {
});