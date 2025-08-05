const { streamDeckClient } = SDPIComponents;

const CamerasOpitions = `
  <option value="cam1">Câmera 1</option>
  <option value="cam2">Câmera 2</option>
  <option value="cam3">Câmera 3</option>
  <option value="cam4">Câmera 4</option>
  <option value="cam5">Câmera 5</option>
  <option value="cam6">Câmera 6</option>
`


document.querySelector('#option').innerHTML = CamerasOpitions;

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