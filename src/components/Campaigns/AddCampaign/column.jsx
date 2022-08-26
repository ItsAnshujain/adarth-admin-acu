/* eslint-disable */
import Badge from '../../shared/Badge';

const COLUMNS = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'SPACE NAME & PHOTO',
    accessor: 'space_name_and_photo',
    Cell: tableProps => {
      const {
        row: {
          original: { status, photo, space_name },
        },
      } = tableProps;

      const color =
        status === 'Available' ? 'green' : status === 'Unavailable' ? 'orange' : 'primary';
      return (
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="bg-white border rounded-md">
            <img className="h-8 mx-auto" src={photo} alt="banner" />
          </div>
          <p className="flex-1">{space_name}</p>
          <div className="flex-1">
            <Badge radius="xl" text={status} color={color} variant="filled" size="sm" />
          </div>
        </div>
      );
    },
  },
  {
    Header: 'LANDLORD NAME',
    accessor: 'landlord_name',
    Cell: tableProps => {
      const {
        row: {
          original: { landlord_name },
        },
      } = tableProps;
      return <div className="w-fit">{landlord_name}</div>;
    },
  },
  {
    Header: 'SPACE TYPE',
    accessor: 'space_type',
  },
  {
    Header: 'DIMENSION',
    accessor: 'dimension',
  },
  {
    Header: 'IMPRESSION',
    accessor: 'impression',
  },
  {
    Header: 'HEALTH',
    accessor: 'health',
  },
  {
    Header: 'LOCATION',
    accessor: 'location',
  },
  {
    Header: 'MEDIA TYPE',
    accessor: 'media_type',
  },
  {
    Header: 'PRICING',
    accessor: 'pricing',
  },
];

export default COLUMNS;
