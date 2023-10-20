import React, { useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ColorSwatch, Group, Popover } from '@mantine/core';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Link } from 'react-router-dom';
import { isArray } from 'lodash';
import { useCalendarEvents } from '../../../apis/queries/booking.queries';

dayjs.extend(customParseFormat);

const Calendar = () => {
  const [month, setMonth] = useState({
    startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
  });

  const calendarEvents = useCalendarEvents(month);

  const renderEventContent = eventInfo => {
    const {
      hasVacantSpace,
      hasBookingEnd,
      hasBookingStarted,
      bookingStarting,
      bookingEnding,
      inventoryVacancy,
    } = eventInfo.event.extendedProps;

    return (
      <Popover width={300}>
        <Popover.Target>
          <Group position="center" spacing="xs" className="cursor-pointer py-2">
            {hasVacantSpace ? <ColorSwatch color="#914EFB" size={10} /> : null}
            {hasBookingEnd ? <ColorSwatch color="#FD3434" size={10} /> : null}
            {hasBookingStarted ? <ColorSwatch color="#28B446" size={10} /> : null}
          </Group>
        </Popover.Target>

        <Popover.Dropdown className="z-[999] p-0">
          <article className="">
            <section className="bg-gray-100 px-2 py-1">
              <p className="text-black text-md font-bold">
                {dayjs(eventInfo.event.start).format('MMMM DD, YYYY')}
              </p>
            </section>
            <section className="p-3 bg-white">
              {isArray(inventoryVacancy)
                ? inventoryVacancy?.[0]?.inventory.map(item => (
                    <Group key={item?._id} className="flex gap-1">
                      <ColorSwatch color="#914EFB" size={10} mr={4} />
                      <Link to={`/inventory/view-details/${item?._id}`}>
                        <p className="text-black font-medium">
                          {item?.basicInformation?.spaceName}
                        </p>
                      </Link>
                      <p className="text-black">will be vacant</p>
                    </Group>
                  ))
                : null}

              {isArray(bookingStarting)
                ? bookingStarting?.map(item => (
                    <Group key={item?._id} className="flex gap-1">
                      <ColorSwatch color="#28B446" size={10} mr={4} />
                      <Link to={`/bookings/view-details/${item?._id}`}>
                        <p className="text-black font-medium">{item?.campaign?.name}</p>
                      </Link>
                      <p className="text-black">campaign starting</p>
                    </Group>
                  ))
                : null}

              {isArray(bookingEnding)
                ? bookingEnding?.map(item => (
                    <Group key={item?._id} className="flex gap-1">
                      <ColorSwatch color="#FD3434" size={10} mr={4} />
                      <Link to={`/bookings/view-details/${item?._id}`}>
                        <p className="text-black font-medium">{item?.campaign?.name}</p>
                      </Link>
                      <p className="text-black">campaign ending</p>
                    </Group>
                  ))
                : null}
            </section>
          </article>
        </Popover.Dropdown>
      </Popover>
    );
  };

  const renderDayCellContent = e => (
    <div className="w-full">
      <p className="text-md font-semibold text-center">{e.dayNumberText}</p>
    </div>
  );

  const handleCalendarData = useMemo(() => {
    const temp = [];
    if (!calendarEvents.data) return {};

    Object.keys(calendarEvents.data).forEach(key => {
      temp.push({
        id: key,
        start: dayjs(key, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        hasBookingStarted: !!calendarEvents.data[key]?.bookingStarting,
        hasBookingEnd: !!calendarEvents.data[key]?.bookingEnding,
        hasVacantSpace: !!calendarEvents.data[key]?.inventoryVacancy,
        bookingStarting: calendarEvents.data[key]?.bookingStarting || [],
        bookingEnding: calendarEvents.data[key]?.bookingEnding || [],
        inventoryVacancy: calendarEvents.data[key]?.inventoryVacancy || [],
      });
    });

    return temp;
  }, [calendarEvents.data]);

  return (
    <FullCalendar
      height="100%"
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      selectable
      events={handleCalendarData}
      eventContent={renderEventContent}
      dayCellClassNames={() => 'bg-white'}
      headerToolbar={{
        left: 'prev,title,next',
        center: '',
        right: '',
      }}
      datesSet={e => {
        setMonth({
          startDate: dayjs(e.startStr).format('YYYY-MM-DD'),
          endDate: dayjs(e.endStr).format('YYYY-MM-DD'),
        });
      }}
      viewClassNames={() => 'bg-white'}
      dayHeaderClassNames={() => 'bg-purple-50 text-md font-medium'}
      eventBackgroundColor="transparent"
      eventBorderColor="transparent"
      dayCellContent={e => renderDayCellContent(e)}
    />
  );
};

export default Calendar;
