import { useState, ChangeEvent, FormEvent } from 'react';

const UploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setMessage('Please select a file.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage('Only JPG, PNG, and GIF files are allowed.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage('File size must be under 5MB.');
      return;
    }

    setFile(selectedFile);
    setMessage('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setUploadedUrl(data.url);
        setMessage('Uploaded successfully!');
      } else {
        setMessage(data.error || 'Upload failed.');
      }
    } catch (error) {
      setMessage('Something went wrong.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
      {uploadedUrl && (
        <div>
          <p>Uploaded Image:</p>
          <img src={uploadedUrl} alt="Uploaded" style={{ maxWidth: '300px' }} />
        </div>
      )}
    </div>
  );
};

export default UploadForm;
