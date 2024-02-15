import ImageCard from './ImageCard';

const ImagesList = ({ imagesData, selectedImages, setSelectedImages }) => (
  <div className="grid grid-cols-5 gap-2">
    {imagesData.map(image => (
      <ImageCard
        image={image}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        checked={selectedImages.some(id => id === image.id)}
      />
    ))}
  </div>
);

export default ImagesList;
