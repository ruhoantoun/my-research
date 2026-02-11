import React from 'react';

const ExampleCarouselImage = ({ images, title }) => {
  return (
    <div className="example-carousel-image d-flex flex-wrap justify-content-center">
      {images.map((img, index) => (
        <img key={index} src={img} alt={title} className="img-fluid m-2" style={{ maxWidth: '150px' }} />
      ))}
      <div className="caption w-100 text-center">
        <h5 className="mt-2">{title}</h5>
      </div>
    </div>
  );
}

export default ExampleCarouselImage;
