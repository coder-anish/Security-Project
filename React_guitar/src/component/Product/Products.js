import React, { useState } from 'react';
import './Products.css';
import { useSelector,useDispatch } from 'react-redux';
import { clearErrors,getProduct } from '../../actions/productAction';
import Loader from '../layout/Loading/loading';
import { useEffect } from 'react';
import { Fragment } from 'react';
import ProductCard from '../Home/ProductCard';
import Pagination from 'react-js-pagination';
import Slider from '@material-ui/core/Slider';
import Typography  from '@material-ui/core/Typography';
import MetaData from '../layout/MetaData';
import { useParams } from 'react-router-dom';


const categories = [
  "Acoustic guitar",
  "Classical guitar",
  "Electric guitar",
  "Bass guitar",
];


const Products = () => {
    const {keyword} = useParams();
    console.log(keyword)
    const dispatch = useDispatch();
    const [currentPage,setCurrentPage] = useState(1);
    const [price,setPrice] = useState([0,250000]);
    const [category,setCategory] = useState("");
    const [ratings,setRatings] = useState(0)
    const {products,loading,error,productCount,resultPerPage,filterProductsCount} = useSelector((state)=>state.products);
    const setCurrentPageNo = (e) => {
            setCurrentPage (e)
    }
    const priceHandler = (event,newPrice) => {
        setPrice(newPrice);
    }

    useEffect(()=>{
        dispatch(getProduct(keyword,currentPage, price, category, ratings));
    },[dispatch,keyword, currentPage, price,category,ratings])

    let count = filterProductsCount;
  return (
    <Fragment>
        {loading? (
            <Loader/>
        ):(
            <Fragment>
                <MetaData title="Melody"></MetaData>
                <div className='filterBox'>
                    <div className='price'>Price</div>
                    <Slider
                        value={price}
                        onChange={priceHandler}
                        valueLabelDisplay="auto"
                        aria-labelledby='range-slider'
                        min={0}
                        max={250000}
                    />
                <div className='categoryoption'>Categories</div>
                        <ul className='categoryBox'>
                            {categories.map((category)=>(
                                <li
                                className='category-link'
                                key={category}
                                onClick={()=>setCategory(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>
                        <div >
                            
                            <div className='ratingabove'> Ratings Above</div>
                            <Slider
                            value={ratings}
                            onChange={(e,newRating)=>{
                                setRatings(newRating);
                            }}
                            aria-labelledby = "continuous-slider"
                            valueLabelDisplay='auto'
                            min={0}
                            max={5}
                            >
                            </Slider>
                        </div>
                </div>
                <h2 className='productsHeading'>Products</h2>
                <div className='containerparent'>
                <div className='container'>
                {products &&
                        products.map(product=>(
                            <ProductCard key={product._id} product={product}/>
                        ))}
                </div>
                </div>
                

           
                {resultPerPage<count &&(
                <div className="paginationBox">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultPerPage}
                  totalItemsCount={productCount}
                  onChange={setCurrentPageNo}
                  nextPageText="Next"
                  prevPageText="Prev"
                  firstPageText="1st"
                  lastPageText="Last"
                  itemClass="page-item"
                  linkClass="page-link"
                  activeClass="pageItemActive"
                  activeLinkClass="pageLinkActive"
                />
              </div>
              )}
               
            </Fragment>
        )}
    </Fragment>
  )
}



export default Products
