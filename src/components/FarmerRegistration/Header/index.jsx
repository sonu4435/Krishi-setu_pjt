import React, { useEffect, useState } from "react";
import { CloseSVG } from "../../../assets/image";
import { Img, Button, Input } from "../../Cindex";
import { signOut } from "firebase/auth";
import { auth } from "Server/FireBase/firebase";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getOrderId } from "components/SendGetData";
import { Link } from "react-router-dom";

export default function Header({ ...props }) {
  const [searchBarValue, setSearchBarValue] = React.useState("");
  const [hidden, setHidden] = React.useState(true);
  const [searchValue, setSearchValue] = useState('');

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
  return (
    <header {...props}>
      <ToastContainer />
      <div className="flex flex-row justify-around items-center w-full">
        <div />
        <div className="flex relative flex-row justify-between items-center w-auto gap-5">
          <div className="flex flex-col">
            <Button onClick={() => handleSignOut} color="gray_50" size="lg" className="w-[35px] h-[35px] rounded-[17px]">
              <Img src="/Cimages/img_group_259.svg" />
            </Button>
          </div>
          <div className="flex w-full h-auto items-center gap-5">
          <Img src={props.userdetails.photoURL} alt="circleimage" className="h-10 w-10 rounded-[50%]" />
          <Button onClick={handleSignOut} color="gray_50" size="lg" className=" h-20 w-40 flex items-center justify-center font-medium overflow-hidden ml-2 rounded-[50px] text-white-A700 bg-red-600 border px-5 py-6">
            Signout
          </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
