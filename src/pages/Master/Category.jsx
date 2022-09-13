import Categories from '../../components/Masters/Category';
import { useFetchMasters } from '../../hooks/masters.hooks';
import { serialize } from '../../utils';

const Category = () => {
  const { data } = useFetchMasters(serialize({ type: 'category' }));
  // console.log(data);
  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <Categories data={data?.docs} />
    </div>
  );
};

export default Category;
