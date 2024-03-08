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
  const [searchValue,setSearchValue] = useState('');


  return (
    <></>
  );
}
