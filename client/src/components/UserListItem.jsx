// import { useChatContext } from "../context/ChatProvider";

/* eslint-disable react/prop-types */
const UserListItem = ({ handleFunction, user }) => {
  // const { user } = useChatContext();
  console.log(user);
  return (
    <div
      onClick={handleFunction}
      className="flex items-center w-full cursor-pointer bg-gray-200 hover:bg-teal-500 hover:text-white text-black px-3 py-2 mb-2 rounded-lg">
      <img
        src={user.pic}
        alt={user.name}
        className="w-8 h-8 rounded-full mr-2"
      />
      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-xs">
          <b>Email: </b>
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;
