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
  const [value, setValue] = useState(EditorState.createEmpty());
  //init input value
  const [active, setActive] = useState('1');

  const [image, setImage] = useState('');
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [basicModal, setBasicModal] = useState(false);

  const [contact_person, setContactPerson] = useState(null);
  // const [address_line_1, setAddress_line_1] = useState(null);
  // const [address_line_2, setAddress_line_2] = useState(null);
  // const [city, setCity] = useState(null);
  // const [zip_code, setZip_code] = useState(null);
  const [phone, setPhone] = useState(null);
  // const [country_id, setCountry_id] = useState(null);
  // const [state_id, setState_id] = useState(null);
  const [description, setDescription] = useState(null);

  const [visible, setVisible] = useState('');

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
        .get(`https://amanacart.com/api/admin/stock/supplier/${params.id}`, auth)
        .then((response) => {
          try {
            console.log(response.data);
            setImage(response.data.image);

            setName(response.data.name);
            setEmail(response.data.email);
            setIncharge(response.data.contact_person);

            setActive(response.data.active);

            setDescription(response.data.description);

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
    if (value.getCurrentContent().getPlainText() === '') {
      setVisible(true);
    } else {
      setVisible(false);
    }
    const formData = new FormData();

    // if (image === '' || cover_image === '') {
    //   setVisibleImageError(true);
    // } else {
    //   setVisibleImageError(false);
    //   // Update the formData object
    //   // formData.append('image', image);
    //   // formData.append('cover_image', cover_image);
    // }
    formData.append('name', name);
    formData.append('description', value.getCurrentContent().getPlainText());
    formData.append('email', email);

    formData.append('active', active);
    formData.append('contact_person', contact_person);
    formData.append('_method', 'PUT');

    // formData.append('_method', 'PUT');
    if (params.id) {
      axios
        .post(`https://amanacart.com/api/admin/stock/supplier/${params.id}`, formData, auth)
        .then((response) => {
          console.log(response);
          // window.location.reload()
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
      <Row>
        <Col className='mb-1' lg='8' md='8' xs='12'>
          <Label for='name'>الاسم*</Label>
          <Input type='text' name='name' onChange={(e) => setName(e.target.value)} id='name' value={name} required />
        </Col>
        <Col className='mb-1' lg='4' md='4' xs='12'>
          <Label for='status'>الحالة *</Label>
          <Input type='select' name='active' id='status' onChange={(e) => setActive(e.target.value)} value={active} required>
            <option>Select Status</option>
            <option value={1}>Active</option>
            <option value={0}>InActive</option>
          </Input>
        </Col>
        <Col className='mb-1' lg='6' md='6' xs='12'>
          <Label for='email'>البريد الالكتروني*</Label>
          <Input type='email' name='email' onChange={(e) => setEmail(e.target.value)} id='email' value={email} required />
        </Col>
        <Col className='mb-1' lg='6' md='6' xs='12'>
          <Label for='contact_person'>اسم الشخص المراد التواصل معه*</Label>
          <Input type='text' name='contact_person' onChange={(e) => setContactPerson(e.target.value)} id='contact_person' value={contact_person} />
        </Col>

        <Col className='mb-1' lg='6' md='6' md='12'>
          <Label>الوصف*</Label>
          <Input type='textarea' type='text' name='description' onChange={(e) => setDescription(e.target.value)} id='description' value={description} />
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
