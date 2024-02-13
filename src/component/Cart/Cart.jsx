import React, { useState } from "react";
import "./Cart.css";
import TextField from "@material-ui/core/TextField";
import { useSelector, useDispatch } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../../actions/cartAction";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link } from "react-router-dom";
import MetaData from "../layouts/MataData/MataData";
// import { useNavigate } from "react-router-dom";
import { useHistory } from "react-router-dom";
import CartItem from "./CartItem";
import {
  dispalyMoney,
  generateDiscountedPrice,
} from "../DisplayMoney/DisplayMoney";
import CheckoutSteps from "./CheckoutSteps ";
import CricketBallLoader, { FixedLoader } from "../layouts/loader/Loader";
import { useAlert } from "react-alert";

export const API_URL = "https://qrlab-shop-0e4dcc9b118a.herokuapp.com";

const Cart = ({ setVariantId }) => {
  const history = useHistory();
  const alert = useAlert();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const [isLoading, setIsLoading] = useState(false);
  // new code
  const [couponCode, setCouponCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(true);

  // new code end

  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) {
      return;
    } else {
      dispatch(addItemToCart(id, newQty));
    }
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (1 >= quantity) {
      return;
    }

    dispatch(addItemToCart(id, newQty));
  };

  // new code
  const handleApplyCoupon = () => {
    // handle apply coupon logic
    setIsValid(false);
  };

  const handleFocus = (event) => {
    setIsFocused(event.target.value !== "");
  };

  const createProduct = async (cartItem) => {
    if (url === "") {
      alert.error("Upload your QRCode to be printed");
      return;
    }
    setIsLoading(true);
    await fetch(
      `${API_URL}/create-product?imageUrl=${url}&id=${cartItem?.id}&name=${cartItem?.name}`,
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setVariantId(data?.result?.sync_variants[0]?.id);
        history.push("/shipping");
      });
  };

  // new code end

  const deleteCartItems = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const checkoutHandler = () => {
    createProduct(cartItems[0]);
  };

  // claculte price after discount
  let totalPrice = cartItems.reduce((acc, item) => acc + item?.price * 1, 0);
  let discountedPrice = totalPrice;
  let totalDiscount = totalPrice + 2 - discountedPrice;
  let final = discountedPrice;
  final = dispalyMoney(final);
  totalDiscount = dispalyMoney(totalDiscount);
  totalPrice = dispalyMoney(totalPrice);

  console.log(cartItems);

  return (
    <>
      <FixedLoader active={isLoading}>
        <div className="cartPage">
          <MetaData title="Your Cart" />
          {cartItems.length && <CheckoutSteps activeStep={0} />}
          <div className="cart_HeaderTop">
            <div className="headerLeft">
              <Typography variant="h5" component="h1" className="cartHeading">
                Shopping Cart
              </Typography>
              <Typography variant="body2" className="cartText3">
                TOTAL ({cartItems.length} item) <b>{final}</b>
              </Typography>
            </div>
            <Typography
              variant="body2"
              className="cartText2"
              onClick={() => history.push("/products")}
            >
              Continue Shopping
            </Typography>
          </div>

          <div className="separator_cart2"></div>

          {cartItems.length === 0 ? (
            <div className="emptyCartContainer">
              <RemoveShoppingCartIcon className="cartIcon" />

              <Typography variant="h5" component="h1" className="cartHeading">
                Your Shopping Cart is Empty
              </Typography>
              <Typography variant="body" className="cartText">
                Nothin' to see here.
              </Typography>
              <Typography variant="body" className="cartText">
                Let's get shopping!
              </Typography>
              <Link to="/products">
                <Button className="shopNowButton">Shop Now</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="cart_content_wrapper">
                <div className="cart_left_container">
                  {cartItems &&
                    cartItems.map((item) => (
                      // <Link
                      //   to="#"
                      //   style={{ textDecoration: "none", color: "none" }}
                      // >
                      <CartItem
                        key={item.productId}
                        item={item}
                        deleteCartItems={deleteCartItems}
                        decreaseQuantity={decreaseQuantity}
                        increaseQuantity={increaseQuantity}
                        setIsLoading={setIsLoading}
                        length={cartItems.length}
                        setUrl={setUrl}
                        id={item.productId}
                      />
                      // </Link>
                    ))}
                </div>

                <div className="separator_cart3"></div>
                <div className="cart_right_container">
                  <div className="order_summary">
                    <h4>
                      Order Summary &nbsp; ( {cartItems.length}{" "}
                      {cartItems.length > 1 ? "items" : "item"} )
                    </h4>
                    <div className="order_summary_details">
                      <div className="price order_Summary_Item">
                        <span>Original Price</span>
                        {/* ORIGINAL PRICE TOATAL */}
                        <p>{totalPrice}</p>
                      </div>

                      <div className="discount order_Summary_Item">
                        <span>Discount</span>
                        <p>
                          <del>{totalDiscount}</del>
                        </p>
                      </div>

                      <div className="separator_cart"></div>
                      <div className="total_price order_Summary_Item">
                        <div>
                          <h4>Total Price</h4>

                          <p
                            style={{
                              fontSize: "14px",
                              marginTop: "-10px",
                              color: "#414141",
                            }}
                          >
                            (Inclusive of all taxes)
                          </p>
                        </div>
                        <p>
                          <b>{final}</b>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="separator"></div>

                  <div className="coupon-box-wrapper">
                    <div
                      className={`coupon-box-content ${
                        isFocused ? "focused" : ""
                      }`}
                    >
                      <TextField
                        label="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        onFocus={handleFocus}
                        onBlur={() => setIsFocused(false)}
                        error={!isValid}
                        helperText={!isValid && "Invalid coupon code"}
                        variant="outlined"
                        size="small"
                        style={{ width: "200px", marginRight: "1rem" }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        className="coupon-box-apply-btn"
                        onClick={handleApplyCoupon}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>

                  <Button
                    variant="contained"
                    className="btn-custom"
                    onClick={checkoutHandler}
                  >
                    Checkout
                  </Button>

                  <div className="paymentLogoImg">
                    <img
                      src={require("../../Image/cart/cart_img.png")}
                      alt="payemnt-icons"
                      className="paymentImg"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </FixedLoader>
    </>
  );
};

export default Cart;
