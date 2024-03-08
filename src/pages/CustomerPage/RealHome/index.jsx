import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, Img, Text } from "../../../components/RHindex";
import Sidebar4 from "components/CoustomerRealHomePage/Sidebar4";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { CloseSVG } from "assets/CCimages";
import { signOut } from "firebase/auth";
import { auth } from "Server/FireBase/firebase";
import { Input } from "../../../components/Cindex";

const dropDownOptions = [
  { label: "Option1", value: "option1" },
  { label: "Option2", value: "option2" },
  { label: "Option3", value: "option3" },
];

export default function CustomerRealHome({ userProps }) {
  const [searchBarValue, setSearchBarValue] = React.useState("");
  const [reciveData, setReciveData] = useState({
    imgSrc: "",
    prodName: "",
    quantity: "",
    garde: "",
    price: 35,
    desc: "",
  });
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);

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

  const nvigate = useNavigate();

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

  return (
    <>
      <Helmet>
        <title>Home</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="flex flex-row justify-center w-full bg-white-A700">
        <div className="flex flex-row justify-center items-start w-full">
          <Sidebar4 userProps={userProps} className="w-[252px] h-screen top-0 bg-white-A700 shadow-sm !sticky overflow-auto" />
          <div className="flex flex-col items-center justify-start w-[83%] gap-[38px]">
            <header>
              <ToastContainer />
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
                      <Img src="../../../../public/Cimages/img_frame_7.svg" alt="Frame 7" className="cursor-pointer" />
                    )
                  }
                  className="w-[29%] h-[3rem] !text-lg rare"
                />
                <div className="flex relative flex-row justify-between items-center w-auto gap-5">
                  <div className="flex flex-col">
                    <Button color="gray_50" size="lg" className="w-[35px] h-[35px] rounded-[17px]">
                      <Img src="/Cimages/img_group_259.svg" />
                    </Button>
                  </div>
                  <Img src={userProps.photoURL} alt="circleimage" className="h-10 w-10 rounded-[50%]" />
                  <Button onClick={handleSignOut} color="gray_50" size="lg" className=" h-20 w-1/2 flex items-center justify-center font-medium overflow-hidden ml-2 rounded-[50px] text-white-A700 bg-red-600 border px-5 py-6">
                    Signout
                  </Button>
                  <Button color="gray_50" size="lg" className=" h-20 w-[13vw] flex items-center justify-center font-medium overflow-hidden ml-2 text-gray-900 border border-black px-10 py-6">
                    <Link to={`/${userProps.uid}/addproduct`}>
                      Register as a Farmer
                    </Link>
                  </Button>
                </div>
              </div>
            </header>
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
                        desc: item.desc
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
              <div className="pb-14 pl-12 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
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
                        <button className="px-24 py-5 bg-black text-white-A700 w-full capitalize rounded-tl-3xl rounded-br-3xl hover:bg-[#3c3c3c] font-medium">Add to cart</button>
                        <button className="px-24 py-5 bg-black text-white-A700 w-full capitaliz hover:bg-[#3c3c3c] font-medium">Buy Now</button>
                      </div>
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
