import React, { useState, useEffect } from "react";
import "./ProductList.css";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  getAdminProducts,
  deleteProduct,
} from "../../actions/productAction";
import { Link, useHistory } from "react-router-dom";
import { useAlert } from "react-alert";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import Sidebar from "./Siderbar";
import Navbar from "./Navbar";
import { DELETE_PRODUCT_RESET } from "../../constants/productsConstatns";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { API_URL } from "../Cart/Cart";
import { fireStoreDb } from "../../firebase";
import UpdateProduct from "./UpdateProduct";

function ProductList() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const [products, setProducts] = useState([]);
  const history = useHistory();
  const [toggle, setToggle] = useState(false);
  const [updateProduct, setUpdateProduct] = useState();
  const { error, loading } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.deleteUpdateProduct
  );
  const getProducts = async () => {
    try {
      const q = query(
        collection(fireStoreDb, "activeProducts"),
        orderBy("name", "desc")
      );
      onSnapshot(q, (querySnapshot) => {
        setProducts(
          querySnapshot.docs.map((doc) => ({
            refId: doc.id,
            ...doc.data(),
          }))
        );
      });
    } catch (error) {}
  };
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Product Deleted Successfully");

      dispatch({ type: DELETE_PRODUCT_RESET });
    }
    // dispatch(getAdminProducts());
    getProducts();
  }, []);

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  const columns = [
    {
      field: "id",
      headerName: "Product ID",
      minWidth: 230,
      flex: 0.3,
      headerClassName: "column-header",
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.5,
      magin: "0 auto",
      headerClassName: "column-header hide-on-mobile",
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 100,
      flex: 0.5,
      headerClassName: "column-header hide-on-mobile",
    },
    {
      field: "active",
      headerName: "Active",
      type: "boolean",
      minWidth: 100,
      flex: 0.3,
      headerClassName: "column-header hide-on-mobile",
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      minWidth: 200,
      flex: 0.3,
      headerClassName: "column-header hide-on-mobile",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      sortable: false,
      minWidth: 130,
      headerClassName: "column-header1",
      renderCell: (params) => {
        return (
          <>
            <div
              onClick={() => {
                const id = params.getValue(params.id, "id");
                setUpdateProduct(products.filter((item) => item.id === id)[0]);
              }}
              style={{ marginLeft: "1rem" }}
            >
              <EditIcon className="icon-" />
            </div>

            <div
              onClick={() =>
                deleteProductHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon className="iconbtn" />
            </div>
          </>
        );
      },
    },
  ];

  const rows = [];

  // products &&
  //   products.forEach((item) => {
  //     rows.push({
  //       id: item._id,
  //       stock: item.Stock,
  //       price: item.price,
  //       name: item.name,
  //     });
  //   });

  // togle handler =>
  const toggleHandler = () => {
    setToggle(!toggle);
  };

  // to close the sidebar when the screen size is greater than 1000px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 999 && toggle) {
        setToggle(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [toggle]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`ALL PRODUCTS - Admin`} />

          <div className="product-list" style={{ marginTop: 0 }}>
            <div className={!toggle ? "listSidebar" : "toggleBox"}>
              <Sidebar />
            </div>

            <div className="list-table">
              <Navbar toggleHandler={toggleHandler} />
              <div className="productListContainer">
                <h4 id="productListHeading">ALL PRODUCTS</h4>

                {updateProduct ? (
                  <UpdateProduct
                    product={updateProduct}
                    onUpdate={() => {
                      getProducts();
                      setUpdateProduct();
                    }}
                  />
                ) : (
                  <DataGrid
                    rows={products}
                    columns={columns}
                    pageSize={10}
                    disableSelectionOnClick
                    className="productListTable"
                    autoHeight
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProductList;
