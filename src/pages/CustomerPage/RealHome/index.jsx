import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, Img, Text } from "../../../components/RHindex";
import Sidebar4 from "components/CoustomerRealHomePage/Sidebar4";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { CloseSVG } from "assets/CCimages";
import { signOut } from "firebase/auth";
import { auth } from "Server/FireBase/firebase";
import { Input } from "../../../components/Cindex";
import { loadStripe } from '@stripe/stripe-js';


const dropDownOptions = [
  { label: "Option1", value: "option1" },
  { label: "Option2", value: "option2" },
  { label: "Option3", value: "option3" },
];

export default function CustomerRealHome({ userProps }) {
  const [searchBarValue, setSearchBarValue] = React.useState("");
  const [reciveData, setReciveData] = useState({
    _id: "",
    imgSrc: "",
    prodName: "",
    quantity: "",
    garde: "",
    price: 35,
    desc: "",
  });
  const [show, setShow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [cartProduct, setCartProduct] = useState([]); // State to keep track of cart item count
  const nvigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_TEST_VAR}/${userProps.uid}/home`);

        // Check for successful response
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        setUsers(users);
        setSearchUsers(users); // Update searchUsers as well
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  const handleSignOut = () => {
    signOut(auth).then(() => {
      nvigate("/");
    }).catch((error) => {
      toast.error(error, {
        position: "top-right",
      });
    });
  }

  const handleSearchBar = (e) => {
    const searchQuery = e.toLowerCase();
    setSearchBarValue(searchQuery);
    if (searchQuery === '') {
      setSearchUsers(users);
    } else {
      const filteredUsers = users.filter(user =>
        user.foodname.toLowerCase().includes(searchQuery)
      );
      setSearchUsers(filteredUsers);
    }
  }

  const filterByAvailability = (availability) => {
    // Call the callback function passed from the sidebar
    onFilterByAvailability(availability);
  };

  const filterByCategory = (category) => {
    // Call the callback function passed from the sidebar
    onFilterByCategory(category);
  };

  const resetFilters = () => {
    // Call the callback function passed from the sidebar
    onResetFilters();
  };

  const sortByLowToHigh = () => {
    // Call the callback function passed from the sidebar
    onSortByLowToHigh();
  };

  const sortByHighToLow = () => {
    // Call the callback function passed from the sidebar
    onSortByHighToLow();
  };

  const makeCheckout = async () => {
    setLoading(true); // Set loading state to true when checkout process starts
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY);
    const body = {
      products: reciveData
    };
    try {
      const backendURL = `${import.meta.env.VITE_TEST_VAR}/${userProps.uid}/home`;

      const response = await fetch(backendURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (result.error) {
        throw new Error(result.error.message);
      } else {
        toast.success("ordered susccesfully", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error(error.message, {
        position: "top-right",
      });
    } finally {
      setLoading(false); // Reset loading state regardless of success or failure
    }
  }

  const fetcProducthData = async () => {

    try {
      const response = await fetch(`${import.meta.env.VITE_TEST_VAR}/${userProps.uid}/home/productDetails`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const productDetails = await response.json();
      setCartData(productDetails);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }

  const handleSendToDb = async () => {
    try {
      // Prepare data for POST request
      const data = {
        uid: userProps.uid,
        ProductUID: reciveData._id
      };

      // Send POST request to API
      const response = await fetch(`${import.meta.env.VITE_TEST_VAR}/${userProps.uid}/home/productDetails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Set appropriate headers for JSON data
        body: JSON.stringify(data),
      });

      // Check for successful response
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      toast.success("You added a product successfully");
      fetcProducthData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // call to update the cartData on screenload

  useEffect(() => {
    fetcProducthData();
  }, []);


  // Get cart products onLoad of screen
  // Inside your frontend code
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_TEST_VAR}/${userProps.uid}/home/productDetails/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productIds: cartData.map(product => product.ProductUID) }) // Send an array of product IDs
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const productDetails = await response.json();
        setCartProduct(productDetails);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [cartData]); // Run this effect whenever cartData changes


  return (
    <>
      <Helmet>
        <title>Home</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="flex flex-row justify-center w-full bg-white-A700">
        <ToastContainer />
        <div className="flex flex-row justify-center items-start w-full">
          <Sidebar4
            userProps={userProps}
            setUsers={setUsers}
            setSearchBarValue={setSearchBarValue}
            users={users}
            setSearchUsers={setSearchUsers}
            onFilterByAvailability={filterByAvailability}
            onFilterByCategory={filterByCategory}
            onResetFilters={resetFilters}
            onSortByLowToHigh={sortByLowToHigh}
            onSortByHighToLow={sortByHighToLow}
          />
          <div className="flex flex-col items-center justify-start w-[83%] gap-[38px]">
            <header>
              <div className="flex flex-row justify-between pt-3 items-center w-screen mx-auto max-w-[1128px]">
                <Input
                  name="search"
                  placeholder="Search here"
                  value={searchBarValue}
                  onChange={(e) => handleSearchBar(e)}
                  suffix={
                    searchBarValue?.length > 0 ? (
                      <CloseSVG onClick={() => setSearchBarValue("")} height={16} width={25} fillColor="#8c8787ff" />
                    ) : (
                      <Img src="/Cimages/img_frame_7.svg" alt="Frame 7" className="cursor-pointer" />
                    )
                  }
                  className="w-[29%] h-[3rem] !text-lg rare"
                />
                <div className="flex relative flex-row justify-between items-center w-auto gap-5">
                  <div className="flex flex-col px-2">
                    <span className="relative inline-block cursor-pointer" onClick={() => { isOpen ? setIsOpen(false) : setIsOpen(true) }}>
                      <svg className="w-6 h-6 text-gray-700 fill-current" viewBox="0 0 20 20"><path d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{cartData.length}</span>
                    </span>
                  </div>
                  <Img src={userProps.photoURL} alt="circleimage" className="h-10 w-10 rounded-[50%]" />
                  <Button onClick={handleSignOut} color="gray_50" size="lg" className=" h-20 w-40 flex items-center justify-center font-medium overflow-hidden ml-2 rounded-[50px] text-white-A700 bg-red-600 border px-5 py-6">
                    Signout
                  </Button>
                  {/* <Button color="gray_50" size="lg" className=" h-20 w-[13vw] flex items-center justify-center font-medium overflow-hidden ml-2 text-gray-900 border border-black px-10 py-6">
                    <Link to={`/${userProps.uid}/addproduct`}>
                      Register as a Farmer
                    </Link>
                  </Button> */}
                </div>
              </div>
            </header>
            <div style={isOpen ? { right: 0 } : { right: "-100%" }} className="block duration-700 ease-in-out absolute z-[999999] right-0 top-0 h-[90%] w-1/3 bg-white-A700">
              <div className="p-10 font-medium text-xl w-full h-auto flex items-center justify-between gap-5">
                <h1>Shoping Cart</h1>
                {
                  isOpen && (
                    <CloseSVG onClick={() => setIsOpen(false)} height={26} width={25} fillColor="#8c8787ff" className="cursor-pointer" />
                  )
                }
              </div>
              <div className="products w-full h-full p-10 flex flex-col gap-4">
                {cartProduct.map((item, index) => (
                  <div key={index} className="product1 flex w-full h-36 gap-5">
                    <div className="productImage w-1/3 h-full flex items-center">
                      <img src={item.fileurl} className="rounded-md" />
                    </div>
                    <div className="w-full h-full flex flex-col items-center">
                      <div className="w-full h-full flex justify-between">
                        <h1 className="text-xl p-5">{item.foodname}</h1>
                        <h1 className="text-xl p-5">&#8377;{item.foodprice}/Kg</h1>
                      </div>
                      <div className="w-full h-full flex justify-between">
                        <h1 className="text-base p-5">Qty {item.foodquantity}Kg</h1>
                        <button className="text-base text-blue-500 p-5">remove</button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="h-full w-full flex items-end">
                <button className="w-full h-auto p-5 capitalize bg-blue-500 text-white-A700 rounded-md">Check out</button>
                </div>
              </div>
            </div>
            <div style={show ? { display: "none" } : { display: "flex" }} className="flex flex-row justify-center w-[94%]">
              <div className="flex flex-col items-center justify-start w-full gap-[34px]">
                <div className="justify-center w-full gap-[30px] grid-cols-4 grid min-h-[auto]">
                  {searchUsers.map((item, index) => (
                    <div onClick={() => {
                      setShow(true);
                      setReciveData({
                        imgSrc: item.fileurl,
                        prodName: item.foodname,
                        quantity: item.foodquantity,
                        garde: item.grade,
                        price: item.foodprice,
                        desc: item.desc,
                        _id: item._id,
                      })
                    }} key={index} className="group cursor-pointer flex hover:scale-105 duration-300 ease-in-out flex-col justify-start w-full gap-[5px] p-4 bg-white-A700 shadow-md shadow-[#dfdfdf] rounded-[15px] relative overflow-hidden">
                      <Img
                        src={item.fileurl}
                        alt="pizza_for_kids"
                        className="w-full h-[20vh] object-cover object-center rounded-[10px] group-hover:scale-105 duration-150 ease-linear cursor-pointer"
                      />
                      <div className="flex flex-col items-start justify-start w-full gap-[13px] pt-2">
                        <div className="flex flex-row justify-between items-center w-full">
                          <Text as="p" className="!text-gray-700_01 !font-medium text-lg capitalize">
                            {item.foodname}
                          </Text>
                          <Text as="p" className="!text-gray-700_01 !font-medium capitalize">
                            Qty - {item.foodquantity}kg
                          </Text>
                        </div>
                        <div className="flex flex-row justify-between items-center gap-2.5 w-full">
                          <div className="flex items-center gap-2">
                            <Img src="/RHimages/img_group_18196.svg" alt="review_45_one" className="h-2.5" />
                            <Text size="md" as="p" className="!text-gray-700_01 !font-poppins text-center">
                              {item.foodrating}
                            </Text>
                          </div>
                          <Text as="p" className="!text-gray-700_01 !font-medium capitalize">
                            &#8377;{item.foodprice}/kg
                          </Text>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-row justify-between items-center w-full">
                  <Text size="md" as="p" className="!text-gray-700_01 !font-poppins text-center">
                    Displaying {searchUsers.length} Out of {users.length}
                  </Text>
                </div>
              </div>
            </div>
            <div className={show ? "flex flex-col items-center justify-start w-[94%] gap-9 absolute px-[125px] py-[100px]" : "hidden flex-col items-center justify-start w-[94%] gap-9"}>
              <div className="flex flex-row justify-between items-center w-full">
                <div className="flex flex-col items-start justify-start gap-1.5">
                  <button className="flex items-center justify-center text-gray-800 font-bold bg-transparent border-none focus:outline-none p-5 pl-0">
                    <svg
                      className="w-6 h-6 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M29 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <Link to={`/${userProps.uid}/home`} onClick={() => setShow(false)}>Go Back</Link>
                  </button>
                </div>
              </div>
              <div className="pb-14 w-[90%] pl-12 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
                <div className="flex flex-row gap-[11rem] xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                  <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                    <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full gap-10">
                      <div className="mt-4 md:mt-6 flex flex-row items-center md:flex-row justify-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                        <div className="pb-4 md:pb-8 w-full md:w-40 m-8 pr-10">
                          <img className="w-full md:hidden h-[25vh]" src={reciveData.imgSrc} alt="dress" />
                        </div>
                        <div className="md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                          <div className="w-full flex flex-col justify-start items-start space-y-8">
                            <h3 className="text-2xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">{reciveData.prodName}</h3>
                            <div className="flex justify-start items-start flex-col space-y-2">
                              <p className="text-xl dark:text-white leading-none text-gray-900"><span className="dark:text-gray-400 text-gray-500">Quantity: </span> {reciveData.quantity} Kg</p>
                              <p className="text-xl dark:text-white leading-none text-gray-900"><span className="dark:text-gray-400 text-gray-500">Grade: </span> {reciveData.garde}</p>
                              <p className="text-xl dark:text-white leading-none text-gray-900"><span className="dark:text-gray-400 text-gray-500">Price: </span> &#8377;{reciveData.price}/Kg</p>
                            </div>
                          </div>
                          <div className="flex justify-between space-x-8 items-start w-full">
                            <p className="text-lg dark:text-white xl:text-lg leading-6">Total Price :- <span className="font-bold">&#8377;{reciveData.price * reciveData.quantity} </span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center flex-row gap-4 md:flex-row items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                      <div className="w-full flex flex-col gap-5 items-center justify-center mt-14">
                        <input type="number" maxLength={3} placeholder="Quantity in KG" className="!outline-1 !outline-black !border-1 py-10 px-10" />
                        {!cartProduct.find(item => item._id === reciveData._id) ? (
                          <button onClick={handleSendToDb} className="px-24 py-5 bg-black text-white-A700 w-full capitalize rounded-tl-3xl rounded-br-3xl hover:bg-[#3c3c3c] font-medium">Add to cart</button>
                        ) : (
                          <button disabled className="px-24 py-5 bg-gray-400 text-white-A700 w-full capitalize rounded-tl-3xl rounded-br-3xl">Already in cart</button>
                        )}
                        <button
                          onClick={makeCheckout}
                          className={`px-24 py-5 bg-black text-white-A700 w-full capitaliz hover:bg-[#3c3c3c] font-medium`}
                          disabled={loading} // Disable the button if loading is true
                        >
                          {loading ? 'Processing...' : 'Buy Now'}
                        </button>                      </div>
                      <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                        <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Description</h3>
                        <div className="flex justify-between items-start w-full">
                          <div className="flex justify-center items-center space-x-4">
                            <div className="flex flex-col justify-start items-center w-full">
                              <h2 className="text-xl capitalize text-start">{reciveData.desc}</h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 w-1/2 xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
                    <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Farmer</h3>
                    <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
                      <div className="flex flex-col justify-start items-start flex-shrink-0">
                        <div className="flex justify-center w-full md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
                          <img src={userProps.photoURL} alt="avatar" />
                          <div className="flex justify-start items-start flex-col space-y-2">
                            <p className="text-base dark:text-white font-semibold leading-4 text-left text-gray-800">{userProps.displayName}</p>
                            <p className="text-sm dark:text-gray-300 leading-5 text-gray-600">10 Previous Orders</p>
                          </div>
                        </div>

                        <div className="flex justify-center text-gray-800 dark:text-white md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M29 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="cursor-pointer text-sm leading-5 ">{userProps.email}</p>
                        </div>
                      </div>
                      <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                        <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                          <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                            <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">Shipping Address</p>
                            <p className="w-48 lg:w-full dark:textahmenu-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">180 North King Street, Northhampton MA 1060</p>
                          </div>
                          <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4">
                            <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">Billing Address</p>
                            <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">180 North King Street, Northhampton MA 1060</p>
                          </div>
                        </div>
                        <div className="flex w-full justify-center items-center md:justify-start md:items-start">
                          <button className="mt-6 md:mt-0 dark:border-white dark:hover:bg-gray-900 dark:bg-transparent dark:text-white py-5 hover:bg-gray-200 bg-black text-white-A700 w-full capitalize border-black rounded-xl hover:text-black font-medium">Track Order</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
