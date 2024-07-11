import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const qrCodeContainerRef = useRef(null);

  const generateQRCode = () => {
    if (inputValue.trim()) {
      const URL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${inputValue}`;
      setQrCodeUrl(URL);
      showToast();
    }
  };

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2000);
  };

  const downloadQRCode = () => {
    if (qrCodeContainerRef.current) {
      toPng(qrCodeContainerRef.current, { backgroundColor: 'white' })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'qr-code-generated-by-sridhar.png';
          link.click();
        })
        .catch((err) => {
          console.error('Failed to download QR code', err);
        });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-orange-500">
      <h1 className="text-5xl text-white shadow-md mb-8 p-5 ">QR Code Generator</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <input
          type="text"
          className="w-full p-2 mb-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-orange-500"
          placeholder="Enter or Paste URL Here"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className="w-full bg-orange-500 text-white py-2 rounded-md hover:shadow-lg transition mb-4"
          onClick={generateQRCode}
        >
          Generate
        </button>
        {qrCodeUrl && (
          <div className="flex flex-col items-center">
            <div
              ref={qrCodeContainerRef}
              className="bg-white p-10 mt-4"
              style={{ backgroundColor: 'white', display: 'inline-block' }}
            >
              <img src={qrCodeUrl} alt="QR Code" className="mx-auto" />
            </div>
            <button
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:shadow-lg transition"
              onClick={downloadQRCode}
            >
              Download
            </button>
          </div>
        )}
        {toastVisible && (
          <div className="fixed bottom-4 bg-green-500 text-white py-2 px-4 rounded shadow-lg transition-opacity duration-300">
            Successfully Generated!!!
          </div>
        )}
        <p className="mt-4 text-gray-500 text-center">Developed By Sridhar</p>
      </div>
    </div>
  );
}

export default App;
