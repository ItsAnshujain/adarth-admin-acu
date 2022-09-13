import { TextInput } from '@mantine/core';
import icon from '../assets/icon.svg';

const Search = ({ search, setSearch = () => {} }) => (
  <TextInput
    defaultValue={search}
    onChange={e => setSearch(e.currentTarget.value)}
    className="w-3/12"
    placeholder="Search"
    icon={<img src={icon} alt="search-icon" className="h-4" />}
  />
);

export default Search;
