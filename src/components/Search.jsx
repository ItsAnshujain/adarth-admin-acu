import { TextInput } from '@mantine/core';
import icon from '../assets/icon.svg';

const Search = ({ state, setState }) => (
  <TextInput
    value={state}
    onChange={e => setState(e.target.value)}
    className="mr-7 w-3/12"
    placeholder="Search"
    icon={<img src={icon} alt="search-icon" className="h-4" />}
  />
);

export default Search;
