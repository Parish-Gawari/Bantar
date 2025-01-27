/* eslint-disable react/prop-types */
import { XMarkIcon } from "@heroicons/react/24/solid";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <span
      className="inline-flex items-center px-3 py-1 m-1 mb-2 text-sm font-medium text-white bg-purple-500 rounded-lg cursor-pointer hover:bg-purple-600"
      onClick={handleFunction}>
      {user?.name}
      {admin === user?._id && <span className="ml-1 text-xs">(Admin)</span>}
      <XMarkIcon className="w-4 h-4 ml-2" />
    </span>
  );
};

export default UserBadgeItem;
