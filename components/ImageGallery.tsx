import { useState, useEffect } from 'react';

interface Image {
  id: number;
  url: string;
}

const ImageGallery = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Récupérer les images
    const fetchImages = async () => {
      const response = await fetch('/api/upload');
      const data = await response.json();
      setImages(data);
    };

    fetchImages();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file.');
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
        setImages((prev) => [data, ...prev]);
        setMessage('Image uploaded successfully!');
      } else {
        setMessage(data.error || 'Upload failed.');
      }
    } catch (error) {
      setMessage('Something went wrong.');
    }
  };

  return (
    <div>
      <h1>Image Gallery</h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {images.map((image) => (
          <div
            key={image.id}
            style={{ border: '1px solid #ccc', padding: '10px' }}
          >
            <img
              src={image.url}
              alt="Uploaded"
              style={{ maxWidth: '150px', maxHeight: '150px' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;