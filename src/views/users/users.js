import { useContext, useState, useEffect } from 'react';
import { List, Plus, ChevronDown, ChevronUp, Trash2 } from 'react-feather';
import { CustomInput, FormGroup, Card, CardHeader, CardTitle, Button, Input, Label, Badge, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TableWithButtons from '../tables/data-tables/basic/TableWithButtons';
import NumberInput from '@components/number-input';
import { EditorState } from 'draft-js';

// ** Table Data & Columns
import { Columns, ColumnsTrash } from '../tables/data-tables/userData';
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

  // init headers auth
  const config = useJwt.jwtConfig;
  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };
  const [data, setdata] = useState([]);
  useEffect(() => {
    axios
      .get('https://amanacart.com/api/admin/admin/user', auth)
      .then((response) => {
        setdata(response.data.users);
        console.log(response.data);
        setTrashData(response.data.trashes);
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

  const [visibleImageError, setVisibleImageError] = useState('');
  const [value, setValue] = useState(EditorState.createEmpty());

  const [visible, setVisible] = useState('');

  //init input value
  // const [image, setImage] = useState('');

  const [name, setName] = useState(null);
  const [active, setActive] = useState('1');

  const [nice_name, setNice_name] = useState(null);
  const [email, setEmail] = useState(null);
  password_confirmation;
  const [password, setPassword] = useState(null);
  const [password_confirmation, setPassword_confirmation] = useState(null);
  const [sex, setSex] = useState(null);
  address_line_1;
  const [description, setDescription] = useState(null);
  const [address_line_1, setAddress_line_1] = useState(null);
  const [address_line_2, setAddress_line_2] = useState(null);
  const [city, setCity] = useState(null);
  const [zip_code, setZip_code] = useState(null);
  const [phone, setphone] = useState(null);

  // alert success
  const handleSuccess = ({ msg }) => {
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
  // `${errMsg['email']}`
  //alert error
  // let errMsg = {};
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
    } else {
      return 'no error';
    }
  };

  //handle empty trash
  const handleTrash = () => {
    trashData.length > 0
      ? axios
          .delete('https://amanacart.com/api/admin/admin/user/emptyTrash', auth)
          .then((response) => {
            console.log(response);
            // setBasicModal(!basicModal);

            handleSuccess('EMPTY TRASH SUCCESS');
            window.location.reload();
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
          })
      : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.getCurrentContent().getPlainText() === '') {
      setVisible(true);
    } else {
      setVisible(false);
    }

    const formData = new FormData();

    formData.append('name', name);
    formData.append('active', active);
    formData.append('nive_name', nice_name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password_confirmation', password);
    formData.append('role_id', 4);
    formData.append('dob', '2020-05-01 00:00:00');
    formData.append('sex', sex);
    formData.append('description', description);
    formData.append('address_line_1', address_line_1);
    formData.append('address_line_2', address_line_2);
    formData.append('zip_code', zip_code);
    formData.append('phone', phone);
    formData.append('country_id', 188);
    // formData.append('_method', 'PUT');
    axios
      .post(`https://amanacart.com/api/admin/admin/user`, formData, auth)
      .then((response) => {
        console.log(response);
        setBasicModal(!basicModal);
        handleSuccess('ADD SUCCESS');

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

    console.log(formData['name']);
  };
  const handleFileSelected = (e) => {
    setImage(e.target.files[0]);
  };
  const handleFileSelectedCover = (e) => {
    setCover_image(e.target.files[0]);
  };

  return (
    <div id='dashboard-analytics'>
      <Row className='match-height mt-5'>
        <Col md='12' xs='12'>
          <Card className='m-0'>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
              <CardTitle tag='h4'>USERS</CardTitle>
              <Button className='ml-2' color='primary' onClick={() => setBasicModal(!basicModal)}>
                <Plus size={15} />
                اضافة مستخدم
              </Button>
            </CardHeader>
          </Card>
        </Col>
        <Col>
          <TableWithButtons columns={Columns} data={data} />
        </Col>
      </Row>
      <Row className='match-height'>
        <Col md='12' xs='12'>
          <Card className='m-0'>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
              <CardTitle tag='h4'>سلة المهملات</CardTitle>
              <div>
                <Button className='ml-2' color='primary' onClick={() => handleTrash()}>
                  <Trash2 size={15} />
                  حذف سلة المهملات نهائيا
                </Button>
              </div>
            </CardHeader>
          </Card>
        </Col>
        <Col>
          <TableWithButtons columns={ColumnsTrash} data={trashData} />
        </Col>
      </Row>
      <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-dialog-centered modal-lg'>
        <ModalHeader toggle={() => setBasicModal(!basicModal)}>الشكل</ModalHeader>
        <ModalBody>
          <Row>
            <Col className='mb-1' lg='8' md='8' xs='12'>
              <Label for='name'>الاسم الكامل*</Label>
              <Input type='text' name='name' onChange={(e) => setName(e.target.value)} id='name' />
            </Col>
            <Col className='mb-1' lg='4' md='4' xs='12'>
              <Label for='status'>الحالة*</Label>
              <Input type='select' name='active' id='status' onChange={(e) => setActive(e.target.value)}>
                <option>تحديد</option>
                <option value={1}>Active</option>
                <option value={0}>InActive</option>
              </Input>
            </Col>
            <Col className='mb-1' lg='12' md='8' xs='12'>
              <Label for='nice_name'>الاسم المميز*</Label>
              <Input type='text' name='nice_name' onChange={(e) => setNice_name(e.target.value)} id='nice_name' />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='email'>البريد الالكتروني*</Label>
              <Input type='email' name='email' onChange={(e) => setEmail(e.target.value)} id='email' />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='password'>كلمة السر*</Label>
              <Input type='password' name='password' onChange={(e) => setPassword(e.target.value)} id='password' />
            </Col>{' '}
            {/* <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='password_confirmation'>CONFIRM PASSWORD*</Label>
              <Input type='password_confirmation' name='password_confirmation' onChange={(e) => setPassword_confirmation(e.target.value)} id='password_confirmation' />
            </Col> */}
            <Col className='mb-1' lg='6' md='4' xs='12'>
              <Label for='sex'>الجنس*</Label>
              <Input type='select' name='sex' id='sex' onChange={(e) => setSex(e.target.value)}>
                <option>تحديد الجنس</option>
                <option value={1}>male</option>
                <option value={0}>female</option>
              </Input>
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='description'>الوصف*</Label>
              <Input type='text' name='description' onChange={(e) => setDescription(e.target.value)} id='description' />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='address_line_1'>العنوان الاول*</Label>
              <Input type='text' name='address_line_1' onChange={(e) => setAddress_line_1(e.target.value)} id='address_line_1' />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='address_line_2'>العنوان الثاني*</Label>
              <Input type='text' name='address_line_2' onChange={(e) => setAddress_line_2(e.target.value)} id='address_line_2' />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='city'> المدينة*</Label>
              <Input type='text' name='city' onChange={(e) => setCity(e.target.value)} id='city' />
            </Col>
            <Col className='mb-1' lg='6' md='6' md='12'>
              <Label>الرمز البردي*</Label>
              <Input type='text' name='zip_code' onChange={(e) => setZip_code(e.target.value)} id='zip_code' />
            </Col>
            <Col className='mb-1' lg='6' md='6' md='12'>
              <Label>رقم الهاتف*</Label>
              <Input type='text' name='phone' onChange={(e) => setphone(e.target.value)} id='phone' />
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
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Catalog;
