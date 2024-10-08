import { useEffect, useReducer} from 'react';
import axios from 'axios';
// import data from '../data';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import MessageBox from '../components/MessageBox';

import LoadingBox from '../components/LoadingBox';

const reducer = (state, action) => {
    switch(action.type){
        case 'FETCH_REQUEST':
            return {...state, loading: true};
        case 'FETCH_SUCCESS':
            return{...state, products: action.payload, loading: false};
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};
        default:
            return state;
    }
};

function HomeScreen() {
  const [{loading, error, products}, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true, 
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({type: 'FETCH_REQUEST'});
      try {
        const result = await axios.get('/api/products');
        dispatch({type: 'FETCH_SUCCESS', payload: result.data});
      } catch (err) {
        dispatch({type: 'FETCH_FAIL', payload: err.message});
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Ethereal Ink Nexus</title>
      </Helmet>
      <div>
        <h1>Featured Products</h1>
        <div className="products">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Row>
              {products.map((product, index) => (
                <Col key={product.slug} sm={12} md={6} lg={4} className="mb-3">
                  <Product product={product}></Product>
                  {(index + 1) % 3 === 0 && <div className="w-100"></div>}
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;