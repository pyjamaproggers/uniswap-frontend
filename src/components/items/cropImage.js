export default async function getCroppedImg(imageSrc, pixelCrop) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;

        // Ensure the image is loaded before drawing and processing
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;
            const ctx = canvas.getContext('2d');

            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            );

            // Create the Blob from the canvas
            canvas.toBlob(blob => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                const filename = 'croppedImage.jpeg';
                const mimeType = 'image/jpeg';
                const file = new File([blob], filename, { type: mimeType });
                resolve(file);
            }, 'image/jpeg');
        };

        // Handle image load errors
        image.onerror = () => {
            reject(new Error('Failed to load image source'));
        };
    });
}
