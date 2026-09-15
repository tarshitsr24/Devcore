import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Check, X } from 'lucide-react';

const createCroppedFile = (imageSrc, pixelCrop, fileName, fileType) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const context = canvas.getContext('2d');
    context.drawImage(
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
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Unable to crop image.'));
        return;
      }
      resolve(new File([blob], fileName, { type: fileType || 'image/jpeg' }));
    }, fileType || 'image/jpeg', 0.9);
  };
  image.onerror = () => reject(new Error('Unable to read image.'));
  image.src = imageSrc;
});

export default function ImageCropModal({ image, onCancel, onComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const croppedFile = await createCroppedFile(image.url, croppedAreaPixels, image.file.name, image.file.type);
      onComplete(croppedFile);
    } catch (error) {
      onCancel(error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-md bg-white border border-[#E4E4E7] shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4E4E7] bg-[#FAFAFA]">
          <h2 className="text-base font-bold text-[#09090B]">Crop profile photo</h2>
          <button type="button" onClick={() => onCancel()} className="p-1 rounded text-[#71717A] hover:text-[#09090B] hover:bg-[#F4F4F5]" aria-label="Close crop dialog">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="relative h-80 bg-[#09090B]">
          <Cropper
            image={image.url}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>
        <div className="px-5 py-4 space-y-4 bg-white">
          <label className="block text-xs font-semibold text-[#52525B]">
            Zoom
            <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="w-full mt-2 accent-black" />
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => onCancel()} className="px-4 py-2 rounded-md text-xs font-semibold text-[#71717A] bg-white hover:bg-[#F4F4F5] border border-[#E4E4E7]">Cancel</button>
            <button type="button" onClick={handleConfirm} disabled={processing} className="px-4 py-2 rounded-md bg-[#09090B] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 shadow-sm">
              <Check className="w-4 h-4 text-white" />
              <span>{processing ? 'Processing...' : 'Use photo'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
