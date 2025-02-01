import React, { useState } from "react";
import { BsSuitHeartFill } from "react-icons/bs";
import { GiReturnArrow } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import Image from "./designLayouts/Image";
import BadgeTC from "./BadgeTC";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/orebiSlice";
import { toast } from "react-toastify";

const ProductTC = (props) => {
  const dispatch = useDispatch();
  const _id = props.productName;
  const idString = (_id) => {
    return String(_id).toLowerCase().split(" ").join("");
  };
  const rootId = idString(_id);
  const [wishList, setWishList] = useState([]);
  const navigate = useNavigate();
  const productItem = props;


  const handleProductDetails = () => {

    navigate(`/articulo/${rootId}`, {
      state: {
        item: productItem,
      },
    });
  };

  const handleWishList = () => {
    toast.success("Product add to wish List");
    setWishList(wishList.push(props));
    console.log(wishList);
  };
  return (
    <div className="w-full relative group">
      <div className="max-w-80 max-h-80 relative overflow-y-hidden border-[1px] border-b-0">
        <div onClick={handleProductDetails} className="cursor-pointer">
          {/* <Image className="w-full h-full" imgSrc={props.img} /> */}
          <Image className="w-full h-full" imgSrc={`http://localhost:4000${props.imagen.replace(/ /g, "%20")}`} />
        </div>
        <div className="absolute top-6 left-8">
          {props.badge && <BadgeTC text="New" />}
        </div>
        <div className="w-full h-20 absolute bg-transparent -bottom-[130px] group-hover:bottom-0 duration-700">
          <ul className="w-full h-full flex text-center items-end justify-center gap-2 font-titleFont px-2 py-2 border-l border-r">
            {/* <li className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full">
              Compare
              <span>
                <GiReturnArrow />
              </span>
            </li> */}


            {/* <li
              onClick={() =>
                dispatch(
                  addToCart({
                    _id: props._id,
                    name: props.descripcion,
                    quantity: 1,
                    image: props.img,
                    badge: props.badge,
                    price: props.precio,
                    colors: props.color,
                  })
                )
              }
              className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
            >
              Agregar al carrito
              <span>
                <FaShoppingCart />
              </span>
            </li> */}

            <li
              onClick={() =>
                dispatch(
                  addToCart({
                    _id: props._id,
                    name: props.descripcion,
                    quantity: 1,
                    imagen: props.imagen,
                    badge: props.badge,
                    price: props.precio,
                    colors: props.color,
                  })
                )
              }
              className="w-[60px] h-[60px] bg-[#16a34a] text-[#fff] hover:text-[#facc15] cursor-pointer text-lg rounded-full flex justify-center items-center hover:bg-[#16a34a] duration-100 active:scale-90">
              <FaShoppingCart className="text-4xl" />
            </li>




            {/* <li
              onClick={handleProductDetails}
              className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
            >
              View Details
              <span className="text-lg">
                <MdOutlineLabelImportant />
              </span>
            </li>
            <li
              onClick={handleWishList}
              className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
            >
              Add to Wish List
              <span>
                <BsSuitHeartFill />
              </span>
            </li> */}
          </ul>
        </div>
      </div>
      <div className="max-w-80 py-6 flex flex-col gap-1 border-[1px] border-t-0 px-4">
        <div className="flex items-center justify-between font-titleFont">
          <h2 className="text-lg text-primeColor text-[25px]">
            {props.descripcion}
          </h2>
          {/* <p className="text-[#767676] text-[14px]">${props.precio}</p> */}
        </div>
        <div className="flex items-center justify-center font-bold">
          <p className="text-[#4a4949] text-[35px]">
            $ {props.precio.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductTC;
