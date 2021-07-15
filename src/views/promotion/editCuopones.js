import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { List, Plus, ChevronDown, ChevronUp } from 'react-feather';
import { CustomInput, FormGroup, Card, CardHeader, CardTitle, Button, Input, Label, Badge, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import NumberInput from '@components/number-input';
import { EditorState } from 'draft-js';
//alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
//api
import axios from 'axios';

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';
const Catalog = (props) => {
  //get id from URL
  // const { id } = props.location;

  //init alert
  const MySwal = withReactContent(Swal);
  // init headers auth
  const config = useJwt.jwtConfig;
  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };
  //init input value
  const [name, setName] = useState(null);
  const [code, setCode] = useState(null);
  const [value, setvalue] = useState(null);
  const [type, setType] = useState('percente');

  const [quantity, setQuantity] = useState(12);
  const [min_order_amount, setMin_order_amount] = useState(123);
  const [quantity_per_customer, setQuantity_per_customer] = useState(1);
  const [starting_time, setStarting_time] = useState('2021-06-28 01:11 am');
  const [ending_time, setEnding_time] = useState('2021-06-29 01:11 am');
  const [description, setDescription] = useState('TEST description');

  const [active, setActive] = useState('1');
  // const [address_line_1, setAddress_line_1] = useState(null);
  // const [address_line_2, setAddress_line_2] = useState(null);
  // const [city, setCity] = useState(null);
  // const [zip_code, setZip_code] = useState(null);
  // const [phone, setPhone] = useState(null);
  // // const [country_id, setCountry_id] = useState(null);
  // // const [state_id, setState_id] = useState(null);
  // const [description, setDescription] = useState(null);

  const [visible, setVisible] = useState('');
  const [visibleImageError, setVisibleImageError] = useState('');

  const {
    match: { params },
  } = props;
  //fetch data from api
  const [dataSelect, setdataSelect] = useState([]);

  useEffect(() => {
    // axios.get("https://zcart.test/api/admin/catalog/manufacturer/create", auth).then(response => {
    //     // console.log(response.data.categories)
    // }).catch(error => {
    //     console.log(error)
    //     handleError(` ${error} check internet connection `)
    // const {
    //   match: { params },
    // } = props;

    if (params.id) {
      console.log(params.id);
    }
    // })
    if (params.id) {
      axios
        .get(`https://amanacart.com/api/admin/promotion/coupon/${params.id}`, auth)
        .then((response) => {
          try {
            console.log(response.data);
            setName(response.data.data.name);
            setCode(response.data.data.code);
            setAmount(response.data.data.amount);
            setActive(response.data.data.active);
            console.log(response);
          } catch (e) {
            console.log(response, e);
          }
          // return response;
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
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    // if (value.getCurrentContent().getPlainText() === '') {
    //   setVisible(true);
    // } else {
    //   setVisible(false);
    // }
    const formData = new FormData();

    // if (avatar === '') {
    //   setVisibleImageError(true);
    // } else {
    //   setVisibleImageError(false);
    //   // Update the formData object
    //   formData.append('avatar', avatar);

    //   // formData.append('image', image);
    //   // formData.append('cover_image', cover_image);
    // }
    formData.append('name', name);
    formData.append('code', code);
    formData.append('value', 121);
    formData.append('type', type);
    formData.append('quantity', quantity);
    formData.append('min_order_amount', min_order_amount);
    formData.append('quantity_per_customer', quantity_per_customer);
    formData.append('starting_time', starting_time);
    formData.append('ending_time', ending_time);
    formData.append('description', description);

    formData.append('active', active);
    // formData.append('role_id', 4);
    // formData.append('_method', 'PUT');

    formData.append('_method', 'PUT');
    if (params.id) {
      axios
        .post(`https://amanacart.com/api/admin/promotion/coupon/${params.id}`, formData, auth)
        .then((response) => {
          console.log(response);
          window.location.reload();
          handleSuccess('ADD SUCCESS');

          // setBasicModal(!basicModal);
          // return response;
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
    console.log(formData['name']);
  };

  const handleFileSelected = (e) => {
    setImage(e.target.files[0]);
  };
  const handleFileSelectedCover = (e) => {
    setCover_image(e.target.files[0]);
  };

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
  //alert error
  const hundeErrorText = (errMsg) => {
    console.log(Object.keys(errMsg).length);
    //let errData = {err};
    //console.log(errData);
    if (Object.keys(errMsg).length) {
      return (
        <>
          <div style={{ color: 'red', display: 'inline-block', fontSize: '15px' }}>
            {Object.keys(errMsg || {}).map((el, key) => {
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
    }).then(() => MySwal.fire(hundeErrorText(errMsg || {})));
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

  return (
    <div id='dashboard-analytics' className=' bg-white'>
      <Row style={{ padding: '10px' }}>
        <Col className='mb-1' lg='10' md='8' xs='12'>
          <Label for='name'>الاسم*</Label>
          <Input type='text' name='name' onChange={(e) => setName(e.target.value)} id='name' value={name} />
        </Col>
        <Col className='mb-1' lg='2' md='4' xs='12'>
          <Label for='active'>الحالة *</Label>
          <Input type='select' name='active' id='active' onChange={(e) => setActive(e.target.value)} value={active}>
            <option>تحديد</option>
            <option value={1}>Active</option>
            <option value={0}>InActive</option>
          </Input>
        </Col>
        <Col className='mb-1' lg='6' md='6' xs='12'>
          <Label for='code'>الرمز*</Label>
          <Input type='text' name='code' onChange={(e) => setCode(e.target.value)} id='code' value={code} />
        </Col>
        <Col className='mb-1' lg='6' md='6' xs='12'>
          <Label for='value'>القيمة*</Label>
          <Input type='text' name='value' onChange={(e) => setvalue(e.target.value)} id='amount' value={value} />
        </Col>
        <Col className='mb-1' lg='4' md='6' xs='12'>
          <Label for='quantity'>الكمية*</Label>
          <Input type='text' name='quantity' onChange={(e) => setQuantity(e.target.value)} id='quantity' value={quantity} />
        </Col>

        <Col className='mb-1' lg='4' md='6' xs='12'>
          <Label for='min_order_amount'>الحد الادنى للطلب*</Label>
          <Input type='text' name='min_order_amount' onChange={(e) => setMin_order_amount(e.target.value)} id='min_order_amount' value={min_order_amount} />
        </Col>
        <Col className='mb-1' lg='4' md='6' xs='12'>
          <Label for='quantity_per_customer'>الكمية لكل زبون*</Label>
          <Input type='text' name='quantity_per_customer' onChange={(e) => setQuantity_per_customer(e.target.value)} id='quantity_per_customer' value={quantity_per_customer} />
        </Col>
        <Col className='mb-1' lg='12' md='6' xs='12'>
          <Label for='description'>الوصف*</Label>
          <Input type='text' name='description' onChange={(e) => setDescription(e.target.value)} id='description' value={description} />
        </Col>
        <Col className='mb-1' lg='6' md='6' xs='12'>
          <Label for='starting_time'>تاريخ البداية*</Label>
          <Input type='datetime' name='starting_time' onChange={(e) => setStarting_time(e.target.value)} id='starting_time' placeholder='2021-06-28 01:11 am' value={starting_time} />
        </Col>
        <Col className='mb-1' lg='6' md='6' xs='12'>
          <Label for='ending_time'>تاريخ الانتهاء*</Label>
          <Input type='datetime' name='ending_time' onChange={(e) => setEnding_time(e.target.value)} id='ending_time' placeholder='2021-07-28 01:11 pm' value={ending_time} />
        </Col>
        {/* <Col md='6' sm='12'>
              <FormGroup>
                <Label for='image'>BRAND LOGO </Label>
                <CustomInput type='file' onChange={(e) => handleFileSelected(e)} id='image' name='image' />
              </FormGroup>
            </Col> */}

        <Col className='mb-1 d-flex justify-content-end' xs='12'>
          <Button onClick={handleSubmit} color='primary' type='submit'>
            حفظ
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Catalog;
