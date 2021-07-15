import { useContext, useState, useEffect } from 'react';
import { List, Plus, ChevronDown, ChevronUp, Trash2 } from 'react-feather';
import { CustomInput, FormGroup, Card, CardHeader, CardTitle, Button, Input, Label, Badge, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TableWithButtons from '../tables/data-tables/basic/TableWithButtons';
import NumberInput from '@components/number-input';
import { EditorState } from 'draft-js';

// ** Table Data & Columns
import { Columns, ColumnsTrash } from '../tables/data-tables/disputesData';
import '@styles/react/libs/charts/apex-charts.scss';

//api
import axios from 'axios';

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';

//alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation-safe';

const Catalog = (props) => {
  const [basicModal, setBasicModal] = useState(false);
  const [basicModals, setBasicModals] = useState(false);
  const [status, setStatus] = useState({ status: [] });
  const [trashData, setTrashData] = useState([]);
  const {
    match: { params },
  } = props;
  //init alert
  const MySwal = withReactContent(Swal);

  // init headers auth
  const config = useJwt.jwtConfig;
  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };
  const [data, setdata] = useState([]);

  const [visibleImageError, setVisibleImageError] = useState('');
  const [visible, setVisible] = useState('');

  //init input value
  // const [image, setImage] = useState('');

  //init input value
  const [name, setName] = useState(null);
  const [legal_name, setLegal_name] = useState(null);
  const [email, setEmail] = useState(null);
  const [external_url, setExternal_url] = useState(null);

  const [timezone_id, setTimezone_id] = useState('');
  const [description, setDescription] = useState(null);

  //    const [active, setActive] = useState(null);

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
    // console.log(Object.keys(errMsg).length);
    //let errData = {err};
    //console.log(errData);
    if (Object.keys(errMsg || {}).length) {
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

  //handle empty trash
  const handleTrash = () => {
    axios
      .delete('https://amanacart.com/api/admin/admin/user/emptyTrash', auth)
      .then((response) => {
        console.log(response);
        handleSuccess('EMPTY TRASH SUCCESS');
        window.location.reload();
      })
      .catch((error) => {
        console.error(error.response);
        handleError(error.response.data.error.name);
      });
  };
  const [shoping_id, setShoping_id] = useState(null);
  const [generalInfo, setGeneralInfo] = useState(null);
  useEffect(() => {
    axios
      .get(`https://amanacart.com/api/admin/setting/general`, auth)
      .then((response) => {
        console.log(response);
        setGeneralInfo(response.data.timezone);
        setShoping_id(response.data.config.shop_id);
        setdata(response.data.address);
        setName(response.data.name);
        setDescription(response.data.description);
        setLegal_name(response.data.legal_name);
        setEmail(response.data.email);
        setExternal_url(response.data.external_url);
        setTimezone_id(response.data.timezone_id);
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
  }, []);
  console.log(generalInfo ? generalInfo.text : 'ddd');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(shoping_id);

    const formData = new URLSearchParams();

    formData.append('name', name);
    formData.append('legal_name', legal_name);
    formData.append('email', email);
    formData.append('external_url', external_url);
    formData.append('timezone_id', timezone_id);
    formData.append('description', description);
    console.log(formData);
    // formData.append('_method', 'PUT');

    axios
      .put(`https://amanacart.com/api/admin/setting/config/updateBasicConfig/${shoping_id}`, formData, auth)
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

    console.log(formData['name']);
  };
  const handleFileSelected = (e) => {
    setImage(e.target.files[0]);
  };
  const handleFileSelectedCover = (e) => {
    setCover_image(e.target.files[0]);
  };

  return (
    <Row>
      <Col>
        <div id='dashboard-analytics' className=' bg-white'>
          <Row className='card' style={{ flexDirection: 'row', padding: '15px' }}>
            <Col lg='8'>
              <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                <Label sm='3' for='name'>
                  اسم المحل*
                </Label>
                <Input sm='9' type='text' name='name' onChange={(e) => setName(e.target.value)} id='name' value={name} />
              </Col>
              <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                <Label sm='3' for='active'>
                  عنوان الويب للمحل *
                </Label>
                <p>https://zcart.incevio.com/shop/big-shop</p>
              </Col>
              <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                <Label sm='3' for='legal_name'>
                  اللسم النظامي*
                </Label>
                <Input sm='9' type='text' name='legal_name' onChange={(e) => setLegal_name(e.target.value)} value={legal_name} id='legal_name' />
              </Col>
              <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                <Label sm='3' for='email'>
                  العنوان الاكتروني*
                </Label>
                <Input sm='9' placeholder='w@w.com' type='email' name='email' onChange={(e) => setEmail(e.target.value)} value={email} id='email' />
              </Col>
              <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                <Label sm='3' for='external_url'>
                  عنوان ويب خارجي*
                </Label>
                <Input
                  sm='9'
                  placeholder='https://zcart.incevio.com/shop/big-shop'
                  value={external_url}
                  type='text'
                  name='external_url'
                  onChange={(e) => setExternal_url(e.target.value)}
                  id='external_url'
                />
              </Col>

              <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                <Label sm='3' for='timezone_id'>
                  وحدة زمنية*
                </Label>
                <Input sm='9' type='text' name='timezone_id' value={generalInfo ? generalInfo.text : ''} onChange={(e) => setTimezone_id(e.target.value)} id='timezone_id' readOnly />
              </Col>

              <Col className='mb-1 d-flex' lg='12' md='6' xs='12'>
                <Label sm='3' for='description'>
                  الوصف*
                </Label>
                <Input sm='9' type='text' name='description' onChange={(e) => setDescription(e.target.value)} id='description' value={description} />
              </Col>
              <Col className='mb-1 d-flex' lg='12' md='12' sm='12'>
                {/* onChange={(e) => handleFileSelected(e)}  */}
                <Label sm='3' for='image'>
                  لوغو العلامة التجارية
                </Label>
                <CustomInput type='file' id='image' name='image' />
              </Col>
              <Col className='mb-1 d-flex' lg='12' md='12' sm='12'>
                <Label sm='3' for='image'>
                  صورة الغلاف
                </Label>
                <CustomInput type='file' id='image' name='image' />
              </Col>
            </Col>
            <Col lg='4' style={{ textAlign: 'center' }}>
              <div>
                <Label style={{ marginRight: '16px' }}>نمط الصيانة</Label>
                <CustomInput type='switch' label={<Label />} id='icon-primary' name='icon-primary' inline defaultChecked />
              </div>
              <div style={{ marginTop: '72px' }}>
                <Label style={{ marginTop: '15px' }}>عنوان المحل</Label>
                <p>{data ? data.address_line_1 : ''}</p>
                <p>
                  {data ? data.state : ''} <span>{data ? data.zip_code : ''}</span>
                </p>
                <p>{data ? data.country : ''}</p>
              </div>
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
      </Col>
    </Row>
  );
};

export default Catalog;
