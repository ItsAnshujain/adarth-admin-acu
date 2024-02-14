import dummy from '../../../assets/dummy3.png';
import ImageCard from './ImageCard';

const images = [
  {
    link: dummy,
  },
  {
    link: dummy,
  },
];

const ImagesList = () => (
  <div className="grid grid-cols-5 gap-2">
    {images.map(image => (
      <ImageCard image={image} />
    ))}
  </div>
);

export default ImagesList;
