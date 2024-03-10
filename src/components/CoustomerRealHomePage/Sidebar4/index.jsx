import React, { useEffect, useState } from 'react';
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { Img, Text, Text2 } from '../../Cindex';
import { Link } from 'react-router-dom';

export default function Sidebar4({ userProps, setUsers, setSearchBarValue, users, setSearchUsers }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [usersFilter, setUsersFilter] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_TEST_VAR}/${userProps.uid}/home`);

        // Check for successful response
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const usersFilter = await response.json();
        setUsersFilter(usersFilter);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const sortByLowToHigh = () => {
    // Sorting logic for Low to High
    const sortedUsers = [...users].sort((a, b) => a.foodprice - b.foodprice);
    setUsers(sortedUsers);
    setSearchUsers(sortedUsers); // Update searchUsers as well if needed
  };

  const sortByHighToLow = () => {
    // Sorting logic for High to Low
    const sortedUsers = [...users].sort((a, b) => b.foodprice - a.foodprice);
    setUsers(sortedUsers);
    setSearchUsers(sortedUsers); // Update searchUsers as well if needed
  };

  const filterByCategory = (category) => {
    // Filtering logic by category

    const filteredUsers = category
      ? users.filter(user => user.category === category)
      : usersFilter; // If no category selected, reset to original list

    setUsers(usersFilter);
    setSearchUsers(filteredUsers); // Update searchUsers as well if needed

  };



  const resetFilters = () => {
    // Reset filters logic
    setSearchBarValue(""); // Clear search bar value
    setUsers(usersFilter); // Reset users list to its original state
    setSearchUsers(usersFilter); // Reset searchUsers list to its original state
  };


  return (
    <Sidebar
      width="252px !important"
      className="h-screen top-0 bg-white-A700 shadow-sm !sticky overflow-auto"
    >
      <Text2
        className="text-orange-A700 capitalize text-2xl w-auto self-center py-5"
        size="txtMarkoOneRegular20"
      >
        Krishi setu
      </Text2>
      <Menu
        menuItemStyles={{
          button: {
            padding: "10px 10px 10px 28px",
            textTransform: "capitalize",
            width: "100%",
            gap: "12px",
            [`&:hover, &.ps-active`]: {
              color: "#438ffe",
              fontWeight: "500 !important",
              backgroundColor: "#edf5ff !important",
            },
          },
        }}
        renderExpandIcon={() => (
          <Img
            src="/Cimages/img_arrow_right.svg"
            alt="arrowright_one"
            className="h-6 w-6 cursor-pointer"
          />
        )}
        className="flex flex-col items-center justify-start w-full mt-[65px]"
      >
        {/* Navigation Buttons */}
        <Link to={`/${userProps.uid}/home`} className='scale-110 capitalize'>
          <MenuItem
            className='text-[#6b57ff] text-lg capitalize font-semibold'
            icon={
              <Img
                src="/public/Cimages/img_frame_18.svg"
                alt="image_one"
                className="h-5 w-5"
              />
            }
          >
            Home
          </MenuItem>
        </Link>

        <Link to={`/${userProps.uid}/orderhistory`} className='scale-110 capitalize'>
          <MenuItem
            className='text-sm'
            icon={
              <Img
                src="/RHimages/img_group_257.svg"
                alt="image_one"
                className="h-5 w-5"
              />
            }
          >
            Orders
          </MenuItem>
        </Link>
        <Link to={`/${userProps.uid}/category`} className='scale-110 capitalize'>
          <MenuItem
            className='text-sm'
            icon={
              <Img
                src="/public/CCimages/img_frame_20.svg"
                alt="image_one"
                className="h-5 w-5 p-[.8px]"
              />
            }
          >
            Category
          </MenuItem>
        </Link>
        <Link to={`/${userProps.uid}/addproduct`} className='scale-110 capitalize'>
          <MenuItem
            className='text-sm'
            icon={
              <Img
                src="/public/Himages/img_frame_21.svg"
                alt="image_one"
                className="h-5 w-5"
              />
            }
          >
            Add Products
          </MenuItem>
        </Link>
        <Link to={`/${userProps.uid}/dashboard`} className='scale-110 capitalize'>
          <MenuItem
            className='text-sm'
            icon={
              <Img
                src="/Cimages/img_frame_17.svg"
                alt="image_one"
                className="h-5 w-5 p-[.8px]"
              />
            }
          >
            Dashboard
          </MenuItem>
        </Link>
        {/* End of Navigation Buttons */}

        {/* Filter Section */}
        <div>
          <Text className='!text-lg py-5 border-black' >
            Filtering options
          </Text>
          {/* <MenuItem className='text-sm' onClick={() => filterByAvailability('out_of_stock')}>
            Out of Stock Products
          </MenuItem> */}
          <MenuItem className='text-sm' onClick={() => filterByCategory('Fruits')}>
            Fruits
          </MenuItem>
          <MenuItem className='text-sm' onClick={() => filterByCategory('Vegitables')}>
            Vegetables
          </MenuItem>
          {/* Add more filter options as needed */}
          <MenuItem className='text-sm' onClick={resetFilters}>
            Reset Filters
          </MenuItem>
        </div>
        {/* End of Filter Section */}

        {/* Divider indicating the start of sorting options */}
        <Text className='!text-lg mt-5 py-5 pt-0 border-black'>
          Sorting Options
        </Text>
        {/* Sorting Section */}
        <div>
          <MenuItem className='text-md' onClick={sortByHighToLow}>
            Price: High to Low
          </MenuItem>
          <MenuItem className='text-sm' onClick={sortByLowToHigh}>
            Price: Low to High
          </MenuItem>
          {/* Add more sorting options as needed */}
        </div>
        {/* End of Sorting Section */}

      </Menu>
    </Sidebar>
  );
}
