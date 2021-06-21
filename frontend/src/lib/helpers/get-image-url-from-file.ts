export function getImageUrlFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('loadend', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Something went wrong'));
      }
    });

    reader.addEventListener('error', reject);

    reader.readAsDataURL(file);
  });
}
