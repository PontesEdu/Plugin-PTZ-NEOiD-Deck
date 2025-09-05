import dgram from 'dgram';

export function sendViscaUDP(cameraIP: any, viscaHex: string) {
  
  const message = Buffer.from(viscaHex.split(' ').map(b => parseInt(b, 16)));
  const client = dgram.createSocket('udp4');
  client.send(message, 1259, cameraIP, err => {
    if (err) console.error('Erro UDP:', err);
    else console.log('Comando enviado via UDP');
    client.close();
  });
}

