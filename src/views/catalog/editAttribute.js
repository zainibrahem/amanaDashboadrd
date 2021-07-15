import { ChevronDown, ChevronUp } from 'react-feather';
import { Button, Label, Row, Col, Input } from 'reactstrap';
import NumberInput from '@components/number-input';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

//api
import axios from 'axios';

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';

//alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

//validation input value
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation-safe';

const Catalog = (props) => {
  //get id from URL
  // const { id } = props.location;
  const [name, setName] = useState(null);
  const [type, setType] = useState('');
  const [order, setOrder] = useState(null);
  const [types, setTypes] = useState([]);

  //init alert
  const MySwal = withReactContent(Swal);
  const {
    match: { params },
  } = props;

  // init headers auth
  const config = useJwt.jwtConfig;
  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };

  // alert success
  const handleSuccess = (msg) => {
    return MySwal.fire({
      title: 'Good job!',
      text: msg,
      icon: 'success',
      customClass: {
        confirmButton: 'btn btn-primary',
      },
      buttonsStyling: false,
    });
  };

  //alert error
  const hundeErrorText = (errMsg) => {
    console.log(Object.keys(errMsg).length);
    //let errData = {err};
    //console.log(errData);
    if (Object.keys(errMsg).length) {
      return (
        <>
          <div style={{ color: 'red', display: 'inline-block', fontSize: '15px' }}>
            {Object.keys(errMsg).map((el, key) => {
              console.log(JSON.stringify(errMsg[el]));
              return (
                <>
                  <p>{errMsg[el]}</p>
                </>
              );
            })}
          </div>
        </>
      );
    }
  };

  const handleError = (errMsg) => {
    console.log(errMsg);
    return MySwal.fire({
      title: 'Error!',
      text: 'click Ok to show errors',
      icon: 'error',
      customClass: {
        confirmButton: 'btn btn-primary',
      },
      buttonsStyling: false,
    }).then(() => MySwal.fire(hundeErrorText(errMsg)));
  };
  const handleErrorNetwork = (errMsg) => {
    console.log(errMsg);
    return MySwal.fire({
      title: 'Error!',
      text: 'click Ok to show errors',
      text: `${errMsg}`,
      icon: 'error',
      customClass: {
        confirmButton: 'btn btn-primary',
      },
      buttonsStyling: false,
    });
  };

  //fetch data from api
  useEffect(() => {
    console.log(params);

    if (params.id) {
      axios
        .get(`https://amanacart.com/api/admin/catalog/attribute/${params.id}/edit`, auth)
        .then((response) => {
          console.log(response.data);
          setType(response.data.data.type);
          setName(response.data.data.name);
          setOrder(response.data.data.order);
          // console.log(response.data.data)
          // console.log(type)
          // console.log(name)
          // console.log(order)
        })
        .catch((error) => {
          // console.log(error);
          if (error.response) {
            console.log(error.response.status);
            if (error.response.status === 500) {
              handleErrorNetwork(`${error.response.status} internal server error`);
              console.log(error.response.status);
            } else if (error.response.status === 404) {
              handleErrorNetwork(`${error.response.status} page not found`);
            } else {
              handleError(error.response.data.error);
            }
          } else {
            handleErrorNetwork(`${error}`);
          }
        });
    }

    axios
      .get('https://amanacart.com/api/admin/catalog/attribute/create', auth)
      .then((response) => {
        setTypes(response.data.attribute_types);
      })
      .catch((error) => {
        // console.log(error);
        if (error.response) {
          console.log(error.response.status);
          if (error.response.status === 500) {
            handleErrorNetwork(`${error.response.status} internal server error`);
            console.log(error.response.status);
          } else if (error.response.status === 404) {
            handleErrorNetwork(`${error.response.status} page not found`);
          } else {
            handleError(error.response.data.error);
          }
        } else {
          handleErrorNetwork(`${error}`);
        }
      });
  }, []);

  //handle update attribute
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name);
    console.log(type);
    console.log(order);
    const formData = new URLSearchParams();

    formData.append('attribute_type_id', type);
    formData.append('name', name);

    formData.append('order', order);
    console.log(formData);
    if (params.id) {
      axios
        .put(`https://amanacart.com/api/admin/catalog/attribute/${params.id}`, formData, auth)
        .then((response) => {
          console.log(response);
          handleSuccess('UPDATE SUCCESS');

          window.location.reload();
        })
        .catch((error) => {
          // console.log(error);
          if (error.response) {
            console.log(formData);
            if (error.response.status === 500) {
              handleErrorNetwork(`changes Select and name value or Clike cancel button`);
              console.log(error.response.status);
            } else if (error.response.status === 404) {
              handleErrorNetwork(`${error.response.status} page not found`);
            } else {
              handleError(error.response.data.error);
            }
          } else {
            handleErrorNetwork(`${error}`);
          }
        });
    }
  };

  return (
    <div id='dashboard-analytics' className=' bg-white'>
      <AvForm onSubmit={handleSubmit}>
        <Row className='match-height w-75 mx-auto '>
          <Col xs='12' className='my-2'>
            <h4>شكل</h4>
          </Col>
          <Col className='mb-1' xs='12'>
            <AvGroup>
              <Label for='attribute_type_id'>نوع السمة*</Label>
              <Input type='select' name='attribute_type_id' onChange={(e) => setType(e.target.value)} value={type} id='attribute_type_id'>
                {types && types.length
                  ? types.map((item) => {
                      return (
                        <option value={item.id} selected>
                          {item.type}
                        </option>
                      );
                    })
                  : ''}
              </Input>
            </AvGroup>
          </Col>
          <Col className='mb-1' lg='6' md='6' xs='12'>
            <AvGroup>
              <Label for='name'>اسم السمة*</Label>
              <Input type='text' name='name' value={name} onChange={(e) => setName(e.target.value)} id='name' placeholder='ATTRIBUTE NAME' />
              {/* <AvFeedback>Please select a valid and Unique name!</AvFeedback> */}
            </AvGroup>
          </Col>
          <Col className='mb-1' lg='6' md='6' xs='12'>
            <Label for='order'>قائمة الطلب*</Label>
            <Input
              onChange={(e) => {
                setOrder(e.target.value);
              }}
              value={order}
              name='order'
              id='order'
              type='number'
            />
          </Col>

          <Col className='mb-1' xs='12'>
            <div className='d-flex justify-content-end'>
              <Button href='/catalog/attribute' color='dark' className='mr-1'>
                تراجع
              </Button>
              <Button color='primary'>تحديث</Button>
            </div>
          </Col>
        </Row>
      </AvForm>
    </div>
  );
};

export default Catalog;
