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
  const [slug, setSlug] = useState(null);
  const [url, setUrl] = useState(null);
  const [description, setDescription] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [listing_count, setListing_count] = useState(null);
  const [image, setImage] = useState('');
  const [cover_image, setCover_image] = useState('');
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState(null);
  const [products_count, setProducts_count] = useState(null);
  const [active, setActive] = useState('1');
  const [visibleImageError, setVisibleImageError] = useState('');
  const [value, setValue] = useState(EditorState.createEmpty());
  const [basicModal, setBasicModal] = useState(false);

  const [visible, setVisible] = useState('');

  const {
    match: { params },
  } = props;
  //fetch data from api
  const [dataSelect, setdataSelect] = useState([]);
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
  useEffect(() => {
    axios
      .get('https://amanacart.com/api/admin/catalog/manufacturer/create', auth)
      .then((response) => {
        setdataSelect(response.data.countries);
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
        .get(`https://amanacart.com/api/admin/catalog/manufacturer/${params.id}`, auth)
        .then((response) => {
          console.log(response.data);
          setName(response.data.data.name);
          setSlug(response.data.data.slug);
          setUrl(response.data.data.url);
          setDescription(response.data.data.description);
          setOrigin(response.data.data.origin);
          setListing_count(response.data.data.listing_count);
          setCover_image(response.data.data.cover_image);
          setImage(response.data.data.image);
          setPhone(response.data.data.phone);
          setEmail(response.data.data.email);
          setProducts_count(response.data.data.products_count);

          console.log(response);

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
    if (value.getCurrentContent().getPlainText() === '') {
      setVisible(true);
    } else {
      setVisible(false);
    }
    const formData = new FormData();

    if (image === '' || cover_image === '') {
      setVisibleImageError(true);
    } else {
      setVisibleImageError(false);
      // Update the formData object
      formData.append('image', image);
      formData.append('cover_image', cover_image);
    }
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('url', url);
    formData.append('description', value.getCurrentContent().getPlainText());
    formData.append('listing_count', listing_count);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('origin', origin);

    formData.append('active', active);
    formData.append('products_count', Number(products_count));
    formData.append('_method', 'PUT');
    if (params.id) {
      axios
        .post(`https://amanacart.com/api/admin/catalog/manufacturer/${params.id}`, formData, auth)
        .then((response) => {
          console.log(response);
          handleSuccess('ADD SUCCESS');
          setBasicModal(!basicModal);

          window.location.reload();

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
      title: 'عمل جيد !',
      text: 'تمت العملية بنجاح',
      icon: 'success',
      customClass: {
        confirmButton: 'btn btn-primary',
      },
      buttonsStyling: false,
    });
  };

  return (
    <div id='dashboard-analytics' className=' bg-white'>
      <Row style={{ padding: '10px 20px' }}>
        <Col className='mb-1' lg='8' md='8' xs='12'>
          <Label for='name'>الاسم*</Label>
          <Input type='text' name='name' onChange={(e) => setName(e.target.value)} id='name' placeholder='ادخل اسم الشركة المصنعة' value={name} required />
        </Col>
        <Col className='mb-1' lg='4' md='4' xs='12'>
          <Label for='status'>الحالة *</Label>
          <Input type='select' name='active' id='active' onChange={(e) => setActive(e.target.value)} value={active} required>
            <option>حدد</option>
            <option value={1}>Active</option>
            <option value={0}>InActive</option>
          </Input>
        </Col>
        <Col className='mb-1' lg='6' md='6' xs='12'>
          <Label for='url'>عنوان الويب*</Label>
          <Input type='text' name='url' onChange={(e) => setUrl(e.target.value)} value={url} id='url' placeholder='ادخل عنوان ويب صالحا' required />
        </Col>
        <Col className='mb-1' lg='6' md='6' xs='12'>
          <Label for='origin'>البلد*</Label>
          {/* <Input type='email' id='basicInput' placeholder='COUNTRY ' /> */}
          <Input type='select' name='origin' onChange={(e) => setOrigin(e.target.value)} value={origin} id='origin'>
            <option>حدد البلد</option>
            {dataSelect.map((e) => {
              return <option key={e.id}>{e.name}</option>;
            })}
          </Input>
        </Col>
        <Col className='mb-1' lg='6' md='6' xs='12'>
          <Label for='email'>عنوان البريد الالطتروني*</Label>
          <Input type='email' name='email' onChange={(e) => setEmail(e.target.value)} value={email} id='email' required />
        </Col>
        <Col className='mb-1' lg='6' md='6' xs='12'>
          <Label for='phone'>رقم الهاتف*</Label>
          <Input type='text' name='phone' onChange={(e) => setPhone(e.target.value)} value={phone} id='phone' required />
        </Col>
        <Col className='mb-1' lg='6' md='6' xs='12'>
          <Label for='listing_count'>عدد القوائم*</Label>
          <Input type='number' name='listing_count' onChange={(e) => setListing_count(e.target.value)} value={listing_count} id='listing_count' required />
        </Col>
        <Col className='mb-1' lg='6' md='6' xs='12'>
          <Label for='products_count'>عدد المنتجات*</Label>
          <Input type='number' name='products_count' onChange={(e) => setProducts_count(e.target.value)} value={products_count} id='products_count' required />
        </Col>
        <Col className='mb-1' md='12'>
          <Label>الوصف*</Label>
          <Input type='textarea' type='text' name='description' onChange={(e) => setDescription(e.target.value)} value={description} id='description' required />
        </Col>
        <Col md='6' sm='12'>
          <FormGroup>
            <Label for='cover_image'>COVER IMAGE </Label>
            <CustomInput type='file' onChange={(e) => handleFileSelectedCover(e)} id='cover_image' name='cover_image' />
          </FormGroup>
        </Col>
        <Col md='6' sm='12'>
          <FormGroup>
            <Label for='image'>شعار العلامة التجارية </Label>
            <CustomInput type='file' onChange={(e) => handleFileSelected(e)} id='image' name='image' />
          </FormGroup>
        </Col>

        <Col className='mb-1 d-flex justify-content-end' xs='12'>
          <Button onClick={handleSubmit} color='primary' type='submit'>
            تحديث
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Catalog;
