'use client';
import React, { useState } from 'react';

export default function MamografiaUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resultado, setResultado] = useState<{ clase: string; confianza: number } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [base64Imagen, setBase64Imagen] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setSelectedFile(file);

  const reader = new FileReader();
  reader.onload = () => {
    const buffer = reader.result as ArrayBuffer;
    const bytes = new Uint8Array(buffer);

    // Leer header del PGM (tipo P5)
    let header = '';
    let i = 0;
    while (header.split('\n').length < 4 && i < bytes.length) {
      header += String.fromCharCode(bytes[i++]);
    }
    const headerLines = header.trim().split('\n');
    const [magic, dims, maxVal] = headerLines.slice(0, 3);
    if (magic !== 'P5') {
      alert('Solo se soportan archivos PGM tipo P5');
      return;
    }

    const [width, height] = dims.split(' ').map(Number);
    const start = i;
    const gray = bytes.slice(start, start + width * height);

    // Crear canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.createImageData(width, height);
    for (let j = 0; j < gray.length; j++) {
      const val = gray[j];
      imageData.data[j * 4 + 0] = val; // R
      imageData.data[j * 4 + 1] = val; // G
      imageData.data[j * 4 + 2] = val; // B
      imageData.data[j * 4 + 3] = 255; // A
    }

    ctx.putImageData(imageData, 0, 0);
    const pngUrl = canvas.toDataURL('image/png');
    setPreview(pngUrl);
    //setBase64Imagen(pngUrl);
  };

  reader.readAsArrayBuffer(file);
};


  const handleSubmit = async () => {
    if (!selectedFile || !preview) return;
    setBase64Imagen(preview);
    setResultado({
      clase: 'CIRC', // puedes usar otras como 'NORM', 'CALC', etc.
     confianza: 87.2, // valor entre 0 y 100
    });

    try {
      const res = await fetch('/sr_image.png');
      const blob = await res.blob();

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setBase64Imagen(base64);
      };
      reader.readAsDataURL(blob);

      // También puedes enviar a API si decides hacerlo
      // const response = await fetch('/api/procesar-mamografia', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     fileBase64: base64Imagen,
      //     fileName: selectedFile.name,
      //   }),
      // });
      // const data = await response.json();
      // setResultado(data);
    } catch (error) {
      console.error('Error al cargar imagen base64:', error);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl px-10 py-12 space-y-8 border border-gray-100">
      <h1 className="text-4xl font-extrabold text-center text-blue-700">Clasificación de Mamografías</h1>
      <p className="text-center text-gray-500 text-sm">Sube una imagen .pgm para su análisis mediante IA</p>

      <div>
        <label htmlFor="mamografia" className="block mb-2 text-sm font-medium text-gray-700">
          Seleccionar archivo (.pgm)
        </label>
        <input
          id="mamografia"
          type="file"
          accept=".pgm"
          onChange={handleFileChange}
          className="block w-full border border-gray-300 rounded-lg p-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {preview && (
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
          <img src={preview} alt="Preview" className="max-h-80 mx-auto border border-gray-200 rounded-xl" />
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-xl transition duration-300"
      >
        Procesar Imagen
      </button>

      {base64Imagen && (
  <div className="text-center mt-6 space-y-4">
    {resultado && (
      <div className="bg-green-100 border border-green-300 text-green-800 text-md font-semibold rounded-xl p-4">
        <p className="text-lg font-bold mb-1">Resultado:</p>
        <p>
          Clase detectada: <span className="font-bold">{resultado.clase}</span>
        </p>
        <p>
          Confianza: <span className="font-bold">{resultado.confianza.toFixed(2)}%</span>
        </p>
      </div>
    )}

    <img
      src={base64Imagen}
      alt="Imagen Base64"
      className="max-h-96 mx-auto border rounded-xl"
    />
  </div>
)}

    </div>
  );
}
