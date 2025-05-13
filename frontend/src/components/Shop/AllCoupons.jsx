import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { server } from "../../server"; // Ensure this has your server URL
import { toast } from "react-toastify";

const AllCoupons = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState(null);
  const [minAmount, setMinAmout] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState("");
  const [coupouns, setCoupouns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${server}/coupon/get-coupon/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLoading(false);
        setCoupouns(res.data.couponCodes);
      })
      .catch(() => setIsLoading(false));
  }, [dispatch, seller._id]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${server}/coupon/delete-coupon/${id}`, {
        withCredentials: true,
      });
      toast.success("Coupon code deleted successfully!");
      setCoupouns(coupouns.filter((item) => item._id !== id));
    } catch (error) {
      toast.error("Failed to delete coupon.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${server}/coupon/create-coupon-code`,
        {
          name,
          minAmount,
          maxAmount,
          selectedProducts,
          value,
          shopId: seller._id,
        },
        { withCredentials: true }
      );
      toast.success("Coupon code created successfully!");
      setOpen(false);
      setName("");
      setValue("");
      setMinAmout("");
      setMaxAmount("");
      setSelectedProducts("");
      // Reload the coupons list
      const res = await axios.get(`${server}/coupon/get-coupon/${seller._id}`, {
        withCredentials: true,
      });
      setCoupouns(res.data.couponCodes);
    } catch (error) {
      toast.error(error.response.data.message || "Failed to create coupon.");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Coupon Code", minWidth: 180, flex: 1.4 },
    { field: "price", headerName: "Value", minWidth: 100, flex: 0.6 },
    {
      field: "Delete",
      headerName: "",
      minWidth: 120,
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const rows = coupouns.map((item) => ({
    id: item._id,
    name: item.name,
    price: `${item.value}%`,
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className="w-full flex justify-end">
            <div
              className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
              onClick={() => setOpen(true)}
            >
              <span className="text-white">Create Coupon Code</span>
            </div>
          </div>
          <DataGrid rows={rows} columns={columns} pageSize={10} autoHeight />

          {open && (
            <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
              <div className="w-[90%] 800px:w-[40%] h-[80vh] bg-white rounded-md shadow p-4">
                <div className="w-full flex justify-end">
                  <RxCross1
                    size={30}
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <h5 className="text-[30px] font-Poppins text-center">
                  Create Coupon Code
                </h5>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label className="pb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      className="mt-2 block w-full px-3 h-[35px] border rounded-[3px]"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter coupon code name..."
                    />
                  </div>
                  <div>
                    <label className="pb-2">
                      Discount Percentage <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={value}
                      className="mt-2 block w-full px-3 h-[35px] border rounded-[3px]"
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Enter discount value..."
                    />
                  </div>
                  <div>
                    <label className="pb-2">Min Amount</label>
                    <input
                      type="number"
                      value={minAmount}
                      className="mt-2 block w-full px-3 h-[35px] border rounded-[3px]"
                      onChange={(e) => setMinAmout(e.target.value)}
                      placeholder="Enter minimum amount..."
                    />
                  </div>
                  <div>
                    <label className="pb-2">Max Amount</label>
                    <input
                      type="number"
                      value={maxAmount}
                      className="mt-2 block w-full px-3 h-[35px] border rounded-[3px]"
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder="Enter maximum amount..."
                    />
                  </div>
                  <div>
                    <label className="pb-2">Select Product</label>
                    <select
                      className="w-full mt-2 h-[35px] border rounded-[5px]"
                      value={selectedProducts}
                      onChange={(e) => setSelectedProducts(e.target.value)}
                    >
                      <option value="">Choose a product</option>
                      {products.map((product) => (
                        <option key={product._id} value={product.name}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="submit"
                      value="Create"
                      className="mt-2 block w-full px-3 h-[35px] border rounded-[3px] bg-blue-500 text-white"
                    />
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllCoupons;
