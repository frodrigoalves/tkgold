import React, { useState } from 'react';
import { User, FileText, Camera, CheckCircle, XCircle, Loader, ArrowLeft } from 'lucide-react';

// Define Gold DAO color palette
const colors = {
  darkBackground: '#0D0D0D',
  cardBackground: '#1A1A1A',
  goldPrimary: '#FFD700',
  whiteText: '#FFFFFF',
  lightGrey: '#B0B0B0',
  greenSuccess: '#28A745',
  redError: '#DC3545',
};

// Reusable Button component
const Button = ({ children, icon: Icon, onClick, className = '', type = 'button', disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 ease-in-out
                bg-gradient-to-r from-[${colors.goldPrimary}] to-yellow-600 text-black
                hover:from-yellow-600 hover:to-[${colors.goldPrimary}] hover:shadow-xl
                focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 w-full mb-2
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${className}`}
  >
    {Icon && <Icon size={20} className="mr-2" />}
    {children}
  </button>
);

export default function KycIndividualPage() {
  const [fullName, setFullName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [selfieFile, setSelfieFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle file input change for selfie
  const handleSelfieChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelfieFile(e.target.files[0]);
    }
  };

  // Handle file input change for document
  const handleDocumentChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  // Simulated KYC submission function
  const handleSubmitKyc = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!fullName || !documentNumber || !selfieFile || !documentFile) {
      setError('Please fill in all required fields and upload both files.');
      setLoading(false);
      return;
    }

    // In a real application, you would upload files to a storage service (e.g., Firebase Storage, S3)
    // and then send the URLs to your backend.
    // For this simulation, we'll just use placeholder URLs.
    const selfieURL = 'https://example.com/selfie_placeholder.jpg';
    const documentURL = 'https://example.com/document_placeholder.pdf';

    // TODO: Integrate with backend /api/kyc/pf
    // const payload = {
    //   fullName,
    //   documentType: 'ID', // Example: Could be dynamic based on user selection
    //   documentNumber,
    //   documentUrl: documentURL,
    //   selfieUrl: selfieURL,
    // };
    /*
    try {
      const response = await fetch('/api/kyc/pf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer YOUR_JWT_TOKEN` // Include auth token
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.success) {
        setSuccessMessage('KYC submitted successfully! Your verification is pending review.');
        // Optionally clear form or navigate
        // setFullName('');
        // setDocumentNumber('');
        // setSelfieFile(null);
        // setDocumentFile(null);
      } else {
        setError(result.error || 'KYC submission failed. Please try again.');
      }
    } catch (err) {
      console.error('KYC submission error:', err);
      setError('An unexpected error occurred during submission. Please try again.');
    } finally {
      setLoading(false);
    }
    */

    // Simulated success for demonstration
    setTimeout(() => {
      setSuccessMessage('KYC submitted successfully! Your verification is pending review.');
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: colors.darkBackground }}>
      <div className="w-full max-w-lg bg-[rgba(26,26,26,0.98)] p-8 rounded-xl shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => window.location.href = '/dashboard'} className="text-[${colors.lightGrey}] hover:text-[${colors.goldPrimary}] transition-colors duration-200">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-3xl font-bold text-center flex-grow" style={{ color: colors.goldPrimary }}>
            KYC Verification (Individual)
          </h2>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </div>

        {successMessage && (
          <div className="mb-6 p-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.greenSuccess, color: colors.whiteText }}>
            <CheckCircle size={24} className="mr-3" />
            <p className="text-lg">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.redError, color: colors.whiteText }}>
            <XCircle size={24} className="mr-3" />
            <p className="text-lg">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmitKyc}>
          <div className="mb-6">
            <label htmlFor="fullName" className="block mb-2 text-lg" style={{ color: colors.lightGrey }}>
              Full Name (as per ID)
            </label>
            <div className="flex items-center bg-[#181818] rounded-lg p-3">
              <User size={20} color={colors.goldPrimary} className="mr-3" />
              <input
                id="fullName"
                type="text"
                className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                placeholder="Your full legal name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="documentNumber" className="block mb-2 text-lg" style={{ color: colors.lightGrey }}>
              ID Document Number
            </label>
            <div className="flex items-center bg-[#181818] rounded-lg p-3">
              <FileText size={20} color={colors.goldPrimary} className="mr-3" />
              <input
                id="documentNumber"
                type="text"
                className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                placeholder="e.g., Passport, Driver's License ID"
                value={documentNumber}
                onChange={e => setDocumentNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="documentUpload" className="block mb-2 text-lg" style={{ color: colors.lightGrey }}>
              Upload ID Document (Front & Back)
            </label>
            <div className="flex items-center bg-[#181818] rounded-lg p-3 cursor-pointer">
              <FileText size={20} color={colors.goldPrimary} className="mr-3" />
              <input
                id="documentUpload"
                type="file"
                accept="image/*,.pdf"
                onChange={handleDocumentChange}
                className="hidden"
                required
              />
              <span className="text-white w-full">
                {documentFile ? documentFile.name : 'Choose file (Image or PDF)'}
              </span>
              <button
                type="button"
                onClick={() => document.getElementById('documentUpload').click()}
                className="ml-auto px-4 py-2 bg-yellow-600 text-black rounded-md hover:bg-yellow-700 transition-colors"
              >
                Browse
              </button>
            </div>
            <p className="text-sm mt-2" style={{ color: colors.lightGrey }}>
              Accepted formats: JPG, PNG, PDF. Max size: 5MB.
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="selfieUpload" className="block mb-2 text-lg" style={{ color: colors.lightGrey }}>
              Upload Selfie with ID
            </label>
            <div className="flex items-center bg-[#181818] rounded-lg p-3 cursor-pointer">
              <Camera size={20} color={colors.goldPrimary} className="mr-3" />
              <input
                id="selfieUpload"
                type="file"
                accept="image/*"
                onChange={handleSelfieChange}
                className="hidden"
                required
              />
              <span className="text-white w-full">
                {selfieFile ? selfieFile.name : 'Choose selfie file (Image)'}
              </span>
              <button
                type="button"
                onClick={() => document.getElementById('selfieUpload').click()}
                className="ml-auto px-4 py-2 bg-yellow-600 text-black rounded-md hover:bg-yellow-700 transition-colors"
              >
                Browse
              </button>
            </div>
            <p className="text-sm mt-2" style={{ color: colors.lightGrey }}>
              Ensure your face and ID are clear and visible.
            </p>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center">
                <Loader size={20} className="animate-spin mr-2" /> Submitting...
              </span>
            ) : (
              'Submit for Verification'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-base" style={{ color: colors.lightGrey }}>
            Need to verify as a Legal Entity?{' '}
            <a href="/kyc/pj" className="text-base font-medium hover:underline" style={{ color: colors.goldPrimary }}>
              Click here
            </a>
          </p>
        </div>
      </div>
      <script src="https://cdn.tailwindcss.com"></script>
      <script dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          theme: {
            extend: {
              fontFamily: {
                inter: ['Inter', 'sans-serif'],
              },
              colors: {
                darkBackground: '${colors.darkBackground}',
                cardBackground: '${colors.cardBackground}',
                goldPrimary: '${colors.goldPrimary}',
                blueAccent: '${colors.blueAccent}',
                whiteText: '${colors.whiteText}',
                lightGrey: '${colors.lightGrey}',
                greenSuccess: '${colors.greenSuccess}',
                redError: '${colors.redError}',
              }
            }
          }
        }
      `}} />
    </div>
  );
}
