import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import Sidebar from "./Siderbar";
import { createProduct, clearErrors } from "../../actions/productAction";
import { useHistory } from "react-router-dom";
import { NEW_PRODUCT_RESET } from "../../constants/productsConstatns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import InputAdornment from "@material-ui/core/InputAdornment";
import Box from "@material-ui/core/Box";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CollectionsIcon from "@mui/icons-material/Collections";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InfoIcon from "@mui/icons-material/Info";

import Navbar from "./Navbar";

import useStyles from "../User/LoginFromStyle";
import {
  Avatar,
  TextField,
  Typography,
  FormControl,
  Button,
} from "@material-ui/core";
import { API_URL } from "../Cart/Cart";
import ProductCard from "../Home/ProductCard";
import ProductInfoCard from "./ProductInfoCard";
import { DataGrid } from "@material-ui/data-grid";
import { CardMedia } from "@mui/material";
import { fireStoreDb } from "../../firebase";

function NewProduct() {
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();

  const { loading, error, success } = useSelector(
    (state) => state.addNewProduct
  );
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [Stock, setStock] = useState(0);
  const [products, setProducts] = useState([]);
  const [info, setInfo] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [detailedProduct, setDetailedProduct] = useState(undefined);
  const [isCategory, setIsCategory] = useState(false);
  const fileInputRef = useRef();
  const [toggle, setToggle] = useState(false);

  const classes = useStyles();
  // togle handler =>
  const toggleHandler = () => {
    console.log("toggle");
    setToggle(!toggle);
  };

  const getProducts = async () => {
    try {
      fetch(`${API_URL}/products`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data.result);
        });
    } catch (error) {}
  };

  const searchProduct = async (id) => {
    try {
      fetch(`${API_URL}/productsInfo?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setDetailedProduct(data.result);
        });
    } catch (error) {}
  };

  const addToShop = async (product) => {
    try {
      await addDoc(collection(fireStoreDb, "activeProducts"), {
        ...product,
        active: true,
        productDescription: detailedProduct?.product?.description,
      });
      alert.success("Product added to shop");
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    {
      field: "image",
      headerName: "Preview",
      minWidth: 200,
      height: "300px",
      minHeight: 300,
      flex: 0.5,
      headerClassName: "column-header hide-on-mobile",
      renderCell: (params) => {
        return (
          <>
            <CardMedia
              style={{ width: "200px", height: "200px" }}
              image={params.getValue(params.id, "image")}
            />
          </>
        );
      },
    },
    {
      field: "id",
      headerName: "Product ID",
      minWidth: 50,
      flex: 0.1,
      headerClassName: "column-header",
    },
    {
      field: "title",
      headerName: "Name",
      minWidth: 150,
      flex: 0.5,
      magin: "0 auto",
      headerClassName: "column-header hide-on-mobile",
    },
    {
      field: "description",
      headerName: "Details",
      minWidth: 300,
      flex: 2,
      headerClassName: "column-header hide-on-mobile",
      renderCell: (params) => {
        return (
          <>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{
                width: "100%",
                height: "200px",
                whiteSpace: "normal",
                padding: "20px",
              }}
            >
              {params.getValue(params.id, "description")}
            </Typography>
          </>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      minWidth: 230,
      headerClassName: "column-header1",
      renderCell: (params) => {
        return (
          <>
            <div
              onClick={() => searchProduct(params.getValue(params.id, "id"))}
            >
              <Button variant="contained" className={classes.button}>
                Add Product
              </Button>
            </div>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getProducts();
  }, []);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setIsCategory(true);
  };

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };
  const categories = [
    "Cricket Kits",
    "Batting Gloves",
    "Batting Pads",
    "Bats",
    "Bags",
    "Helmets",
    "Balls",
    "Stumps",
    "Shoes",
    "Clothing",
    "Accessories",
  ];
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Product Created Successfully");
      history.push("/admin/dashboard");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, history, success]);

  const createProductSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("Stock", Stock);
    myForm.set("info", info);
    images.forEach((currImg) => {
      myForm.append("images", currImg);
    });

    dispatch(createProduct(myForm));
  };

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={"New Product"} />
          <div className={classes.updateProduct}>
            <div
              className={
                !toggle ? `${classes.firstBox1}` : `${classes.toggleBox1}`
              }
            >
              <Sidebar />
            </div>

            <div className={classes.secondBox1}>
              <div className={classes.navBar1}>
                <Navbar toggleHandler={toggleHandler} />
              </div>
              {detailedProduct && (
                <div
                  style={{
                    marginTop: "10px",
                    marginLeft: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <Typography>
                    <ArrowBackIcon
                      style={{
                        width: "25px",
                        height: "25px",
                        cursor: "pointer",
                      }}
                      onClick={() => setDetailedProduct()}
                    />
                  </Typography>
                  <Typography variant="h5">
                    Product Variants Available
                  </Typography>
                </div>
              )}
              {detailedProduct ? (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px",
                    marginTop: "10px",
                  }}
                >
                  {detailedProduct?.variants?.map((item) => {
                    return (
                      <ProductInfoCard
                        product={item}
                        productDescription={detailedProduct?.product}
                        searchProduct={addToShop}
                      />
                    );
                  })}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    overflow: "auto",
                  }}
                >
                  <DataGrid
                    rows={products}
                    columns={columns}
                    rowHeight={200}
                    pageSize={20}
                    disableSelectionOnClick
                    className="productListTable"
                    autoHeight
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
export default NewProduct;
