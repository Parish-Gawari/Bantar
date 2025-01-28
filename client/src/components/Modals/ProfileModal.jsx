/* eslint-disable react/prop-types */
const ProfileModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-96 rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-bold">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900">
            &times;
          </button>
        </div>
        <div className="mt-4">
          <img
            className="rounded-full w-24 h-24 object-cover mx-auto"
            src={user?.pic}
            alt={user?.name}
          />
          <h3 className="text-center text-xl mt-2">{user?.name}</h3>
          <p className="text-center text-gray-500">{user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
