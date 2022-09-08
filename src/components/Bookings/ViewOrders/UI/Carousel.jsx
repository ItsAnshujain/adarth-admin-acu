const Carousel = ({ photos }) => (
  <div
    aria-hidden
    onClick={e => e.stopPropagation()}
    className="fixed overflow-scroll 
    no-scrollbar 
    flex items-center
    gap-y-2 
  bg-white 
    top-1/2 
    left-1/2
    -translate-x-1/2
    -translate-y-1/2 
    w-[70%] h-[90%]
    z-50 
    shadow-2xl 
    rounded-md py-8"
  >
    <img className="object-contain w-full" src={photos} alt="photos" />
  </div>
);

export default Carousel;
