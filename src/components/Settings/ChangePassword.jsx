const ChangePassword = () => (
  <div className="pl-5 pr-7 mt-4">
    <p className="font-bold text-xl">Change Password</p>
    <p className="font-medium text-slate-400 text-sm mt-1 mb-3">
      Lorem ipsum dolor sit inventore veritatis corrupti suscipit!
    </p>
    <div className="flex gap-4 flex-col">
      <div>
        <label htmlFor="current-password">
          <p className="text-[#969EA1] track-wide">Current Password</p>
          <input
            type="password"
            className="w-4/12  text-slate-400 p-5 py-5 h-8 border rounded-md"
          />
        </label>
      </div>
      <label htmlFor="current-password">
        <p className="text-[#969EA1] track-wide">New Password</p>
        <input type="password" className="w-4/12  text-slate-400 p-5 py-5 h-8  border rounded-md" />
      </label>
      <div>
        <label htmlFor="current-password">
          <p className="text-[#969EA1] track-wide">Confirm Password</p>
          <input
            type="password"
            className="w-4/12  text-slate-400 p-5 py-5 h-8  border rounded-md "
          />
        </label>
      </div>
    </div>
    <button type="button" className="py-2 px-8 rounded bg-purple-450 text-white mt-4">
      Save
    </button>
  </div>
);

export default ChangePassword;
