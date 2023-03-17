import { useMemo, useState } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Avatar, Box, Button, Loader, Pagination } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import {
  useDeleteAllNotifications,
  useDeleteNotificationById,
  useFetchAllNotifications,
  useMarkAllNotifications,
  useMarkNotificationById,
} from '../hooks/notifications.hooks';

dayjs.extend(relativeTime);

const query = {
  'page': 1,
  'limit': 10,
  'sortBy': 'createdAt',
  'sortOrder': 'asc',
};
const Notifications = () => {
  const [searchParams, setSearchParams] = useSearchParams(query);
  const [activeButtonId, setActiveButtonId] = useState(-1);
  const {
    data,
    isLoading: isFetchAllNotificationsLoading,
    isSuccess,
  } = useFetchAllNotifications(searchParams.toString());
  const { mutate: readAll, isLoading: isReadAllNotificationsLoading } = useMarkAllNotifications();
  const { mutate: readById, isLoading: isReadNotificationByIdLoading } = useMarkNotificationById();
  const { mutate: deleteAll, isLoading: isDeleteAllNotificationsLoading } =
    useDeleteAllNotifications();
  const { mutate: deleteById, isLoading: isDeleteNotificationByIdLoading } =
    useDeleteNotificationById();

  const handleReadAll = () => {
    readAll();
  };
  const handleRead = messageId => {
    setActiveButtonId(messageId);
    readById(messageId);
  };
  const handleClearAll = () => {
    deleteAll();
  };
  const handleClear = messageId => {
    setActiveButtonId(messageId);
    deleteById(messageId);
  };

  const hasMarkedAllRead = useMemo(() => {
    const result = data?.docs?.every(item => item.isRead);
    return result;
  }, [data?.docs]);

  const replaceUrl = details => {
    const arr = details.split(' ').map(item => {
      if (item.startsWith('https://')) {
        return `<a href="${item.trim()}" target="_blank">${item.trim()}</a>`;
      }
      return item;
    });
    return arr.join(' ');
  };

  const handlePagination = (key, val) => {
    if (val !== '') searchParams.set(key, val);
    else searchParams.delete(key);
    setSearchParams(searchParams);
  };

  return (
    <div className="absolute top-0 w-screen">
      <Header title="Notification" />
      <div className="grid grid-cols-12 pr-5">
        <Sidebar />
        <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 flex flex-col justify-between">
          {data?.docs?.length ? (
            <div className="flex justify-end pr-7 pt-4 pb-2">
              <Button
                onClick={handleReadAll}
                className="primary-button mr-2"
                variant="filled"
                loading={isReadAllNotificationsLoading}
                disabled={hasMarkedAllRead || isReadAllNotificationsLoading}
              >
                {hasMarkedAllRead ? 'Marked all as read' : 'Mark all as read'}
              </Button>
              <Button
                onClick={handleClearAll}
                className="danger-button"
                variant="filled"
                loading={isDeleteAllNotificationsLoading}
                disabled={isDeleteAllNotificationsLoading}
              >
                Clear all
              </Button>
            </div>
          ) : null}
          <section className="max-h-full overflow-y-auto">
            <div className="flex flex-col gap-4 pl-5 mt-4">
              {isFetchAllNotificationsLoading ? (
                <div className="flex justify-center mt-40">
                  <Loader />
                </div>
              ) : null}
              {!data?.docs?.length && !isFetchAllNotificationsLoading ? (
                <p className=" text-lg font-medium text-center mt-20">No new notifications found</p>
              ) : null}
              {isSuccess && data?.docs
                ? data.docs.map(messages => (
                    <Box
                      key={messages?._id}
                      className={classNames(
                        'border p-4',
                        !messages?.isRead ? 'text-purple-450 bg-[#4B0DAF1A]' : '',
                      )}
                    >
                      <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                          {messages?.userId?.image ? (
                            <Avatar src={messages?.userId?.image} alt="user" radius="xl" />
                          ) : (
                            <Avatar alt="placeholder" radius="xl" />
                          )}
                          <p className="font-bold">{messages?.userId?.name || 'NA'}</p>
                        </div>
                        <p className="text-slate-400 text-sm">
                          {dayjs(messages?.updatedAt).fromNow()}
                        </p>
                      </div>
                      <p
                        // TODO: description needs to be fromatted from backend
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{
                          __html: replaceUrl(messages?.description || ''),
                        }}
                        className="mt-2 text-sm"
                      />

                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleRead(messages?._id)}
                          className="primary-button mr-2"
                          loading={
                            (activeButtonId === messages?._id && isReadNotificationByIdLoading) ||
                            (activeButtonId === messages?._id && isReadAllNotificationsLoading)
                          }
                          disabled={
                            messages?.isRead ||
                            isReadNotificationByIdLoading ||
                            isReadAllNotificationsLoading ||
                            isDeleteAllNotificationsLoading
                          }
                        >
                          {messages?.isRead ? 'Marked as read' : 'Mark as read'}
                        </Button>
                        <Button
                          onClick={() => handleClear(messages?._id)}
                          className="danger-button"
                          loading={
                            (activeButtonId === messages?._id && isDeleteNotificationByIdLoading) ||
                            (activeButtonId === messages?._id && isDeleteAllNotificationsLoading)
                          }
                          disabled={
                            isDeleteNotificationByIdLoading ||
                            isDeleteAllNotificationsLoading ||
                            isReadAllNotificationsLoading
                          }
                        >
                          Clear
                        </Button>
                      </div>
                    </Box>
                  ))
                : null}
            </div>
          </section>
          {!isFetchAllNotificationsLoading || data?.docs?.length ? (
            <Pagination
              styles={theme => ({
                item: {
                  color: theme.colors.gray[9],
                  fontWeight: 100,
                  fontSize: '0.7em',
                },
              })}
              className="justify-end mt-5 mr-5"
              page={data?.page}
              onChange={currentPage => handlePagination('page', currentPage)}
              total={data?.totalPages}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
