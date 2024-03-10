import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, Img, Text } from "../../components/Findex";
import Header from "../../components/FarmerRegistration/Header";
import Sidebar4 from "../../components/FarmerRegistration/Sidebar4";
import { toast } from "react-toastify";
import { storage } from "Server/FireBase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as randomeCharecters } from "uuid";

const dropDownOptions = [
    { label: "Option1", value: "option1" },
    { label: "Option2", value: "option2" },
    { label: "Option3", value: "option3" },
];

export default function AddMenuPage({ userProps }) {
    const [foodnname, setFoodName] = useState('');
    const [imgFile, setImgFile] = useState('');
    const [Loader, setLoader] = useState(false);
    const [foodnprice, setFoodPricee] = useState('');
    const [foodquantity, setFoodQuantity] = useState(0);
    const [foodratng, setFoodrating] = useState(0);
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [imgUrl, setImgUrl] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImgUrl(event.target.result);
            };
            reader.readAsDataURL(file);
            setImgFile(file);
        }
    };

    function handleResetAll() {
        setFoodName('');
        setFoodPricee('');
        setFoodQuantity('');
        setCategory('');
        setLocation('');
        setImgUrl('');
    }

    const handleSendToDb = async () => {
        setLoader(true);

        try {
            // Upload image to Firebase Storage
            const imageRef = ref(storage, `farmerProductImage/${imgFile.name + randomeCharecters()}`);
            const uploadTask = await uploadBytes(imageRef, imgFile);
            const downloadURL = await getDownloadURL(uploadTask.ref);

            // Prepare data for POST request
            const data = {
                uid: userProps.uid,
                foodname: foodnname,
                foodprice: foodnprice,
                fileurl: downloadURL,
                foodrating: foodratng,
                foodquantity: foodquantity,
                category: category,
                location: location,
            };

            // Send POST request to API
            const response = await fetch(`${import.meta.env.VITE_TEST_VAR}/${userProps.uid}/addproduct`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // Set appropriate headers for JSON data
                body: JSON.stringify(data),
            });

            // Check for successful response
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            handleResetAll();
            setLoader(false);
            toast.success("You added a product successfully");
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>
            <Helmet>
                <title>Add Products</title>
                <meta name="description" content="Web site created using create-react-app" />
            </Helmet>
            <div className="flex flex-row justify-center items-start w-full bg-white-A700">
                <Sidebar4 userProps={userProps} className="w-[252px] h-screen top-0 bg-white-A700 shadow-sm !sticky overflow-auto" />
                <div className="flex flex-col items-center justify-start w-[83%] gap-[35px]">
                    <Header userdetails={userProps} className="flex justify-center items-center w-full p-5 bg-white-A700 shadow-xs " />
                    <div className="flex flex-col items-center justify-start w-[94%] gap-[35px]">
                        <div className="flex flex-row justify-between items-center w-full">
                            <div className="flex flex-col items-start justify-start gap-[7px]">
                                <Text size="xl" as="p" className="!text-gray-700_01">
                                    Add Products
                                </Text>
                                <Text as="p">Add Products / Products List / Categories</Text>
                            </div>

                        </div>
                        <div className="flex flex-col items-start justify-center w-full gap-[26px] p-5 bg-white-A700 shadow-md rounded-[15px]">
                            <Text as="p" className="mt-1.5 !text-gray-700_01 !font-medium">
                                Choose Better Products Type
                            </Text>
                            <div className="flex flex-col items-start justify-start w-full mb-1 gap-[25px]">
                                <div className="flex flex-row justify-start w-full">
                                    <div className="flex flex-col items-center justify-start w-full gap-[18px]">
                                        <div className="flex flex-row justify-start w-full gap-[30px]">
                                            <div className="flex flex-col items-start justify-start w-[49%] gap-2">
                                                <Text as="p" className="!text-gray-700_01">
                                                    Food Name
                                                </Text>
                                                <input
                                                    color="gray_50_01"
                                                    type="text"
                                                    name="name"
                                                    placeholder="Enter Name "
                                                    className="w-full h-[60px] pl-4 pr-[35px] text-base border-gray-200 rounded-[5px]"
                                                    onChange={(e) => setFoodName(e.target.value)}
                                                    value={foodnname}
                                                />
                                            </div>
                                            <div className="flex flex-col items-start justify-start w-[49%] gap-2">
                                                <Text as="p" className="!text-gray-700_01">
                                                    Food Price / Kg
                                                </Text>
                                                <input
                                                    type="number"
                                                    color="gray_50_01"
                                                    name="price"
                                                    placeholder="Enter Price"
                                                    className="w-full h-[60px] pl-4 pr-[35px] text-base border-gray-200 rounded-[5px]"
                                                    onChange={(e) => setFoodPricee(e.target.value)}
                                                    value={foodnprice}
                                                />
                                            </div>
                                            <div className="flex flex-col items-start justify-start w-[49%] gap-2">
                                                <Text as="p" className="!text-gray-700_01">
                                                    Food Quantity ( In Kg  )
                                                </Text>
                                                <input
                                                    type="number"
                                                    color="gray_50_01"
                                                    name="price"
                                                    placeholder="Enter quantity"
                                                    className="w-full h-[60px] pl-4 pr-[35px] text-base border-gray-200 rounded-[5px]"
                                                    onChange={(e) => setFoodQuantity(e.target.value)}
                                                    value={foodquantity}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-start items-start w-full gap-[30px]">
                                            <div className="flex flex-col items-start justify-start w-[49%] gap-1.5">
                                                <Text as="p" className="!text-gray-700_01">
                                                    Upload
                                                </Text>
                                                <div className="flex flex-row justify-start w-full">
                                                    <div className="flex flex-row justify-center w-full p-[37px] border-gray-200 border border-dashed bg-gray-50_01 rounded-[5px]">
                                                        <div className="flex flex-col relative items-center justify-start w-[46%] gap-2.5 mx-[120px]">


                                                            {!imgUrl ? (
                                                                <>
                                                                    <Img src="/Fimages/img_frame_15.svg" alt="image_five" className="h-8 w-8" />
                                                                    <Text size="md" as="p">
                                                                        <span className="text-gray-700_01 font-medium">Drop your imges here</span>
                                                                        <span className="text-gray-700_01 font-medium">,</span>
                                                                        <span className="text-blue_gray-400"></span>
                                                                        <span className="text-blue-A200">or browes</span>
                                                                    </Text>
                                                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-blue-500 text-white-A700 py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 transition duration-300">
                                                                        <span>Choose a file</span>
                                                                        <input onChange={handleFileChange} id="file-upload" type="file" className="absolute inset-0 opacity-0 cursor-pointer h-full w-full" />
                                                                    </label>
                                                                </>

                                                            ) : (
                                                                <div className="flex flex-col gap-5">
                                                                    <img src={imgUrl} alt="Uploaded" className="mt-4 max-w-xs" />
                                                                    <label htmlFor="file-upload" className="relative flex flex-col cursor-pointer bg-blue-500 text-white-A700 py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 transition duration-300">
                                                                        <span className="text-center capitalize py-3">Choose another file</span>
                                                                        <input onChange={handleFileChange} id="file-upload" type="file" className="absolute inset-0 opacity-0 cursor-pointer h-full w-full" />
                                                                    </label>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-start justify-start w-[49%] gap-1.5">
                                                <Text as="p">Categories</Text>
                                                <select
                                                    placeholder="Select"
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    className="w-full gap-px h-14 pl-[21px] pr-[35px] flex items-center text-lg border-gray-200 border border-solid rounded-2xl"
                                                >
                                                    <option value="Select a Category" disabled selected className="h-20">Select a Category</option>
                                                    <option value="Fruits" className="h-20">Fruits</option>
                                                    <option value="Vegitables">Vegitables</option>
                                                    <option value="Pulses">Pulses</option>
                                                    <option value="Cereals">Cereals</option>
                                                    <option value="Spices">Spices</option>
                                                    <option value="Fish">Fish</option>
                                                    <option value="Dairy">Dairy</option>
                                                    <option value="Nuts">Nuts</option>
                                                </select>
                                                <div className="flex flex-col items-start justify-start w-[49%] gap-2">
                                                    <Text as="p" className="!text-gray-700_01">
                                                        Location
                                                    </Text>
                                                    <input
                                                        color="gray_50_01"
                                                        name="price"
                                                        placeholder="Enter Location"
                                                        className="w-full h-[60px] pl-4 pr-[35px] text-base border-gray-200 rounded-[5px]"
                                                        onChange={(e) => setLocation(e.target.value)}
                                                        value={location}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row justify-start gap-[21px]">
                                    <button disabled={Loader} onClick={() => handleSendToDb()} size="md" className="font-medium min-w-[112px] bg-black text-white-A700 disabled:bg-slate-700 disabled:text-zinc-300">
                                        Submit
                                    </button>
                                    <Button onClick={() => { handleResetAll() }} size="md" variant="outline" className="font-medium min-w-[112px]">
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
