import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';

// Social media icons (place the correct URLs or import your icons)
const socialMediaIcons = {
  facebook: 'https://www.facebook.com/favicon.ico',
  twitter: 'https://twitter.com/favicon.ico',
  linkedin: 'https://www.linkedin.com/favicon.ico',
};

function App() {
  const [inputValue, setInputValue] = useState('');
  const [phoneInputValue, setPhoneInputValue] = useState('');
  const [messageInputValue, setMessageInputValue] = useState('');
  const [emailInputValue, setEmailInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('url'); // default to URL
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const qrCodeContainerRef = useRef(null);

  const generateQRCode = () => {
    let data;
    let url;

    switch (selectedOption) {
      case 'phone':
        if (phoneInputValue.trim() && messageInputValue.trim()) {
          data = `tel:${phoneInputValue.trim()}?sms=${encodeURIComponent(messageInputValue.trim())}`;
        } else {
          alert('Please enter both phone number and message.');
          return;
        }
        break;
      case 'email':
        if (emailInputValue.trim() && messageInputValue.trim()) {
          data = `mailto:${emailInputValue.trim()}?subject=QR%20Code%20Subject&body=${encodeURIComponent(messageInputValue.trim())}`;
          // Open Gmail in a new tab with the email
          window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailInputValue.trim())}&su=QR%20Code%20Subject&body=${encodeURIComponent(messageInputValue.trim())}`, '_blank');
        } else {
          alert('Please enter both email and message.');
          return;
        }
        break;
      case 'social':
        if (inputValue.trim()) {
          data = inputValue.trim();
        } else {
          alert('Please enter a valid social media URL.');
          return;
        }
        break;
      case 'url':
      default:
        if (inputValue.trim()) {
          data = inputValue.trim();
        } else {
          alert('Please enter a URL.');
          return;
        }
        break;
    }

    url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;
    setQrCodeUrl(url);
    showToast();
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
      <h1 className="text-5xl text-white shadow-md mb-8 p-5">QR Code Generator</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <select
          className="w-full p-2 mb-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-orange-500"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="url">URL</option>
          <option value="phone">Phone Number</option>
          <option value="email">Email</option>
          <option value="social">Social Media</option>
        </select>

        {selectedOption === 'url' && (
          <input
            type="text"
            className="w-full p-2 mb-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-orange-500"
            placeholder="Enter URL Here"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}

        {selectedOption === 'phone' && (
          <>
            <input
              type="text"
              className="w-full p-2 mb-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-orange-500"
              placeholder="Enter Phone Number Here"
              value={phoneInputValue}
              onChange={(e) => setPhoneInputValue(e.target.value)}
            />
            <input
              type="text"
              className="w-full p-2 mb-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-orange-500"
              placeholder="Enter Message Here"
              value={messageInputValue}
              onChange={(e) => setMessageInputValue(e.target.value)}
            />
          </>
        )}

        {selectedOption === 'email' && (
          <>
            <input
              type="email"
              className="w-full p-2 mb-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-orange-500"
              placeholder="Enter Email Here"
              value={emailInputValue}
              onChange={(e) => setEmailInputValue(e.target.value)}
            />
            <input
              type="text"
              className="w-full p-2 mb-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-orange-500"
              placeholder="Enter Message Here"
              value={messageInputValue}
              onChange={(e) => setMessageInputValue(e.target.value)}
            />
          </>
        )}

        {selectedOption === 'social' && (
          <div>
            <input
              type="text"
              className="w-full p-2 mb-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-orange-500"
              placeholder="Enter Social Media URL Here"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="flex justify-center mb-4">
              {Object.keys(socialMediaIcons).map((key) => (
                <a
                  href={inputValue}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={key}
                  className="w-8 h-8 mx-2"
                >
                  <img src={socialMediaIcons[key]} alt={key} className="w-full h-full" />
                </a>
              ))}
            </div>
          </div>
        )}

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
