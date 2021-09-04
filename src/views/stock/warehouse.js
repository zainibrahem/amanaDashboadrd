import { useContext, useState, useEffect } from 'react';
import { List, Plus, ChevronDown, ChevronUp, Trash2 } from 'react-feather';
import { CustomInput, FormGroup, Card, CardHeader, CardTitle, Button, Input, Label, Badge, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledTooltip } from 'reactstrap';
import TableWithButtons from '../tables/data-tables/basic/TableWithButtons';
import NumberInput from '@components/number-input';
import { EditorState } from 'draft-js';

// ** Table Data & Columns
import { Columns, ColumnsTrash } from '../tables/data-tables/wharehouseData';
import '@styles/react/libs/charts/apex-charts.scss';

//api
import axios from 'axios';

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';

//alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation-safe';

const Catalog = () => {
  const [basicModal, setBasicModal] = useState(false);
  const [basicModals, setBasicModals] = useState(false);
  const [status, setStatus] = useState({ status: [] });
  const [trashData, setTrashData] = useState([]);

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
  useEffect(() => {
    axios
      .get('https://amanacart.com/api/admin/stock/warehouse', auth)
      .then((response) => {
        setdata(response.data.warehouses);
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
          handleErrorNetwork(`${error} Network Error`);
        }
      });
  }, []);
  const [dataSelect, setdataSelect] = useState([]);

  const [visibleImageError, setVisibleImageError] = useState('');
  const [value, setValue] = useState(EditorState.createEmpty());

  const [visible, setVisible] = useState('');

  //init input value
  const [active, setActive] = useState('1');

  const [image, setImage] = useState('');
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);

  const [incharge, setIncharge] = useState(null);
  const [address_line_1, setAddress_line_1] = useState(null);
  const [address_line_2, setAddress_line_2] = useState(null);
  const [city, setCity] = useState(null);
  const [zip_code, setZip_code] = useState(null);
  const [phone, setPhone] = useState(null);
  const [country_id, setCountry_id] = useState(null);
  const [state_id, setState_id] = useState(null);
  const [description, setDescription] = useState(null);
  // alert success
  const handleSuccess = (msg) => {
    return MySwal.fire({
      title: 'عمل جيد!',
      text: 'تمت العملية بنجاح',
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
    if (trashData.length > 0) {
      axios
        .delete('https://amanacart.com/api/admin/stock/warehouse/emptyTrash', auth)
        .then((response) => {
          console.log(response);
          handleSuccess('EMPTY TRASH SUCCESS');

          // setBasicModal(!basicModal);
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
            handleErrorNetwork(`${error} Network Error`);
          }
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.getCurrentContent().getPlainText() === '') {
      setVisible(true);
    } else {
      setVisible(false);
    }
    const formData = new FormData();

    if (image === '') {
      setVisibleImageError(true);
    } else {
      setVisibleImageError(false);
      // Update the formData object
      formData.append('image', image);
    }
    formData.append('name', name);
    formData.append('email', email);
    formData.append('incharge', incharge);

    formData.append('address_line_1', address_line_1);
    formData.append('address_line_2', address_line_2);
    formData.append('city', city);
    formData.append('zip_code', zip_code);
    formData.append('phone', phone);
    formData.append('country_id', 512);
    formData.append('state_id', state_id);
    formData.append('description', description);
    formData.append('active', active);

    axios
      .post('https://amanacart.com/api/admin/stock/warehouse', formData, auth)
      .then((response) => {
        console.log(response);
        handleSuccess('تمت العملية بنجاح');

        setBasicModal(!basicModal);
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
      });
  };
  const handleFileSelected = (e) => {
    setImage(e.target.files[0]);
  };
  const handleFileSelectedCover = (e) => {
    setCover_image(e.target.files[0]);
  };

  return (
    <div id='dashboard-analytics'>
      <Row className='match-height'>
        <Col md='12' xs='12'>
          {/* style={{ borderRadius: '0px', borderBottom: '1px solid blue' }} */}
          <Card className='m-0'>
            {/* style={{ padding: '10px' }} */}
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start'>
              {/* style={{ marginTop: '12px' }} */}
              <CardTitle tag='h4'>المستودعات</CardTitle>
              {/* style={{ borderRadius: '0rem' }} */}
              <Button className='ml-2' color='primary' onClick={() => setBasicModal(!basicModal)}>
                <Plus size={15} />
                اضافة مستودع
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
          {/* style={{ borderRadius: '0px', borderBottom: '1px solid blue' }} */}
          <Card className='m-0'>
            {/* style={{ padding: '10px' }} */}
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start'>
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
        <ModalHeader toggle={() => setBasicModal(!basicModal)}>شكل</ModalHeader>
        <ModalBody>
          <Row>
            <Col className='mb-1' lg='8' md='8' xs='12'>
              <Label for='name'>الاسم*</Label>
              <Input type='text' name='name' onChange={(e) => setName(e.target.value)} id='name' placeholder='اسم المستودع' required />
            </Col>
            <Col className='mb-1' lg='4' md='4' xs='12'>
              <Label for='status'>الحالة *</Label>
              <Input type='select' name='active' id='status' onChange={(e) => setActive(e.target.value)} required>
                <option>تحديد الحالة</option>
                <option value={1}>Active</option>
                <option value={0}>InActive</option>
              </Input>
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='email'>البريد الالكتروني*</Label>
              <Input type='email' name='email' onChange={(e) => setEmail(e.target.value)} id='email' placeholder='ادخل عنوان الكتروني صالح' required />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='incharge'>المسؤول*</Label>
              <Input type='select' name='incharge' onChange={(e) => setIncharge(e.target.value)} id='incharge'>
                <option>تجديد المسؤول</option>
                <option value={10}>dasdas</option>
                <option value={3}>Suzanne Farrell</option>
                <option value={12}>wadawd</option>
              </Input>
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='address_line_1'>اضافة عنوان رقم 1*</Label>
              {/* <Input type='email' id='basicInput' placeholder='COUNTRY ' /> */}
              <Input type='text' name='address_line_1' onChange={(e) => setAddress_line_1(e.target.value)} id='address_line_1' placeholder='اضافة عنوان رقم 1' />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='address_line_2'>اضافة عنوان رقم 2*</Label>
              {/* <Input type='email' id='basicInput' placeholder='COUNTRY ' /> */}
              <Input type='text' name='address_line_2' onChange={(e) => setAddress_line_2(e.target.value)} id='address_line_2' placeholder='اضافة عنوان رقم 1' />
            </Col>
            <Col className='mb-1' lg='4' md='4' xs='12'>
              <Label for='city'>المدينة*</Label>
              <Input type='text' name='city' onChange={(e) => setCity(e.target.value)} id='city' placeholder='ادخل اسم المدينة' />
            </Col>
            <Col className='mb-1' lg='4' md='4' xs='12'>
              <Label for='zip_code'>الرمز البريدي*</Label>
              <Input type='text' name='zip_code' onChange={(e) => setZip_code(e.target.value)} id='zip_code' placeholder='الرمز البريدي' />
            </Col>

            <Col className='mb-1' lg='4' md='4' xs='12'>
              <Label for='phone'>رقم الهاتف*</Label>
              <Input type='text' name='phone' onChange={(e) => setPhone(e.target.value)} id='phone' placeholder='رقم الهاتف' />
            </Col>
            <Col className='mb-1' lg='6' md='4' xs='12'>
              <Label for='country_id'>البلد *</Label>
              <Input type='select' name='country_id' onChange={(e) => setCountry_id(e.target.value)} id='country_id'>
                <option>تحديد البلد</option>
                <option value={1}>DAMAS</option>
                <option value={0}>ALEPO</option>
              </Input>
            </Col>

            <Col className='mb-1' lg='6' md='4' xs='12'>
              <Label for='state_id'>الولاية *</Label>
              <Input type='select' name='state_id' onChange={(e) => setState_id(e.target.value)} id='state_id'>
                <option>تحديد الولاية</option>
                <option value={1}>DAMAS</option>
                <option value={0}>ALEPO</option>
              </Input>
            </Col>
            <Col className='mb-1' lg='12' md='12' md='12'>
              <Label>الوصف*</Label>
              <Input type='textarea' type='text' name='description' onChange={(e) => setDescription(e.target.value)} id='description' placeholder='' />
            </Col>
            <Col lg='12' md='12' sm='12'>
              <FormGroup>
                <Label for='image'>شعار المستودع</Label>
                <CustomInput type='file' onChange={(e) => handleFileSelected(e)} id='image' name='image' />
              </FormGroup>
            </Col>

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
