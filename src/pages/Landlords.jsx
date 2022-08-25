import Header from '../components/Header';

const Landlords = () => (
  <div className="absolute top-0 w-screen ">
    <Header title="Landlords" />
    <div className="grid grid-cols-12">
      <div aria-hidden className="col-span-2 bg-red-100 -z-50 invisible h-0">
        Invisible
      </div>
      <div className="col-span-10 border-gray-450 border-l">body</div>
    </div>
  </div>
);

export default Landlords;
