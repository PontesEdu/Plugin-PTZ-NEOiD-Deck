import net from 'net';

export function sendViscaTCP(cameraIP: any, viscaHex: string) {
  const bytes = Uint8Array.from(viscaHex.split(' ').map(b => parseInt(b, 16)));
  const client = net.createConnection({ host: cameraIP, port: 5678 }, () => {
    client.write(bytes);
  });
  client.on('data', data => {
    console.log('Resposta da câmera:', data.toString('hex'));
    client.end();
  });
  client.on('error', err => {
    console.error('Erro na conexão TCP:', err);
  });
}