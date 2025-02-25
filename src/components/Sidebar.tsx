import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className="block md:hidden btn btn-md w-[100px] p-4 bg-gray-800 text-white absolute top-0 left-0 z-50"
        onClick={toggleSidebar}
      >
        Menu
      </button>
      <div className={`fixed top-0 left-0 bg-gray-800 text-white w-full md:w-auto h-full ${isOpen ? 'block' : 'hidden'} md:block z-40`}>
        <div className="p-4">
          <h1 className="text-2xl font-bold">Navigation</h1>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="p-4 hover:bg-gray-700">
              <Link to="/" onClick={toggleSidebar}>Dashboard</Link>
            </li>
            <li className="p-4 hover:bg-gray-700">
              <Link to="/transactions" onClick={toggleSidebar}>Transactions</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
