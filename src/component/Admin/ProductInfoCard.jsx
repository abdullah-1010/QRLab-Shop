import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { FitScreen } from "@mui/icons-material";
import { Link } from "react-router-dom";
import {
  dispalyMoney,
  generateDiscountedPrice,
} from "../DisplayMoney/DisplayMoney";
import { addItemToCart } from "../../actions/cartAction";
import { useDispatch } from "react-redux";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "280px",
    height: FitScreen,
    margin: theme.spacing(2),
    backgroundColor: "white",
    currsor: "pointer",
  },
  media: {
    height: 200,
    width: "90%",
    objectFit: "cover",
    margin: "1rem 1rem 0 1rem",
  },
  button: {
    backgroundColor: "black",
    color: "white",
    borderRadius: 4,
    fontWeight: "bold",
    width: "100%",
    height: 45,
    "&:hover": {
      backgroundColor: "#ed1c24",
      color: "black",
      fontWeight: "bold",
    },
  },
  oldPrice: {
    textDecoration: "line-through",
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.6)",
    marginRight: theme.spacing(1),
  },
  finalPrice: {
    fontWeight: "bold",
    fontSize: "1.2rem",
  },
  description: {
    fontSize: "0.8rem",
    fontWeight: 500,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: "-webkit-box",
    overflow: "hidden",
    textOverflow: "ellipsis",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
  },
}));

const ProductInfoCard = ({
  product = {},
  searchProduct,
  productDescription,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const addTocartHandler = (id, qty) => {
    dispatch(addItemToCart(id, qty));
  };

  return (
    <Card className={classes.root}>
      <Link
        className="productCard"
        to={`/product/${product._id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <CardActionArea>
          <CardMedia className={classes.media} image={product.image} />
          <CardContent>
            <Typography
              gutterBottom
              color="black"
              fontWeight="bold"
              style={{ fontWeight: "700" }}
            >
              {product.name}
            </Typography>
            <Box display="flex" alignItems="center">
              <Rating
                name="rating"
                value={product.ratings || 4}
                precision={0.1}
                readOnly
                size="small"
                style={{ color: "#ed1c24", marginRight: 8, fontWeight: "400" }}
              />
              <Typography variant="body2" color="textSecondary">
                ({product.numOfReviews || 3})
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography variant="body1" className={classes.finalPrice}>
                {product?.price}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Link>
      <Box display="flex" justifyContent="center" p={2}>
        <Button
          variant="contained"
          className={classes.button}
          onClick={() => searchProduct(product)}
        >
          Add to Shop
        </Button>
      </Box>
    </Card>
  );
};

export default ProductInfoCard;
