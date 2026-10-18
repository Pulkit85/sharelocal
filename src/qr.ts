import qrcode from 'qrcode-terminal';

export function generateQrCode(text: string): Promise<string> {
  return new Promise((resolve) => {
    qrcode.generate(text, { small: true }, (qr: string) => {
      resolve(qr);
    });
  });
}
