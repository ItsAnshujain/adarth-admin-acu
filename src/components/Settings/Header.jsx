import classNames from 'classnames';

const Header = ({ tabs, setTabs }) => (
  <div className="h-20 border-b border-gray-450 flex items-center">
    <div className="flex pl-5 gap-6 items-center">
      <button
        type="button"
        onClick={() => setTabs(0)}
        className={classNames(
          `${
            tabs === 0
              ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-8  after:bg-purple-450'
              : ''
          } font-medium tracking-wide`,
        )}
      >
        Notification Settings
      </button>
      <button
        onClick={() => setTabs(1)}
        className={classNames(
          `${
            tabs === 1
              ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-8  after:bg-purple-450'
              : ''
          } font-medium tracking-wide`,
        )}
        type="button"
      >
        Change Password
      </button>
      <button
        onClick={() => setTabs(2)}
        className={classNames(
          `${
            tabs === 2
              ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-8  after:bg-purple-450'
              : ''
          } font-medium tracking-wide`,
        )}
        type="button"
      >
        Delete Account
      </button>
    </div>
  </div>
);

export default Header;
