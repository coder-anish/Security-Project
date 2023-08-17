import React, { Fragment, useEffect } from "react";
import { FaBeer } from "react-icons/fa";
import Carousel from "react-material-ui-carousel";
import "./Home.css";
import Product from "./ProductCard.js";
import MetaData from "../layout/MetaData";
import { getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loading/loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const dispatch = useDispatch();
  const { loading, error, products, productCount } = useSelector(
    (state) => state.products
  );
  useEffect(() => {
    if (error) {
      return toast.error(error, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    dispatch(getProduct());
  }, [dispatch, error]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Melody" />

          <Carousel showArrows={true} className="sliders">
            <div className="sliderimgs">
              <div className="linearbg"></div>
              <img
                className="CarouselImages"
                src="https://durbarmart.com/uploads/sliders/XVzkD0VIGkgqdiYvvFQnKqAjGnybmeLgZUzCBsqb.png"
                alt=""
              />
              <p className="legend">Your One-Stop Shop for Guitars</p>
              <p className="legendchild">
                Explore Our Wide Range of Guitars, Strings, Amps
              </p>
            </div>
            <div>
              <div className="linearbg"></div>
              <img
                className="CarouselImages"
                src="https://durbarmart.com/uploads/sliders/XVzkD0VIGkgqdiYvvFQnKqAjGnybmeLgZUzCBsqb.png"
                alt=""
              />
              <p className="legend">Your One-Stop Shop for Guitars</p>
              <p className="legendchild">
                Explore Our Wide Range of Guitars, Strings, Amps
              </p>
            </div>
            <div>
              <div className="linearbg"></div>
              <img
                className="CarouselImages"
                src="https://durbarmart.com/uploads/sliders/XVzkD0VIGkgqdiYvvFQnKqAjGnybmeLgZUzCBsqb.png"
                alt=""
              />
              <p className="legend">Your One-Stop Shop for Guitars</p>
              <p className="legendchild">
                Explore Our Wide Range of Guitars, Strings, Amps
              </p>
            </div>
          </Carousel>
          <h2 className="homeHeading">All Guitars</h2>
          <div className="container">
            {products &&
              products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
          </div>
        </Fragment>
      )}
      <ToastContainer />
    </Fragment>
  );
}

export default Home;
