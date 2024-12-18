'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Image {
  id: number;
  url: string;
}

const Gallery = () => {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    // Récupérer les images depuis l'API
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/upload');
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error('Failed to fetch images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <h1>Gallery</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {images.length > 0 ? (
          images.map((image) => (
            <div
              key={image.id}
              style={{ border: '1px solid #ccc', padding: '10px' }}
            >
              <Image
                src={image.url}
                alt="Uploaded"
                style={{ maxWidth: '200px', maxHeight: '200px' }}
              />
            </div>
          ))
        ) : (
          <p>No images uploaded yet.</p>
        )}
      </div>
      <Link href={'/'}>
      Home
      </Link>
    </div>
  );
};

export default Gallery;
