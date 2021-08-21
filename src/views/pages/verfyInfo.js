import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { List, Plus, ChevronDown, ChevronUp } from 'react-feather';
import { CustomInput, FormGroup, Card, CardHeader, CardTitle, CardBody, CardText, Button, Input, Label, Badge, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import NumberInput from '@components/number-input';
import { EditorState } from 'draft-js';
//alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
//api
import axios from 'axios';
import './profile/style.css';
// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';
import src from '../../assets/images/pages/v-2.png';
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
  const [basicModal, setBasicModal] = useState(false);
  /*Address */
  const [address_line_1, setAddress_line_1] = useState(null);
  const [address_line_2, setAddress_line_2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip_code, setZip_code] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [countries, setContries] = useState([]);
  const [data, setData] = useState([]);

  //init input value
  const [name, setName] = useState(null);
  const [slug, setSlug] = useState(null);
  const [url, setUrl] = useState(null);
  const [description, setDescription] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [listing_count, setListing_count] = useState(null);
  const [image, setImage] = useState('');
  const [cover_image, setCover_image] = useState('');
  const [email, setEmail] = useState(null);
  const [products_count, setProducts_count] = useState(null);
  const [active, setActive] = useState('1');
  const [visibleImageError, setVisibleImageError] = useState('');
  const [value, setValue] = useState(EditorState.createEmpty());
  const [success, setSuccess] = useState('');
  const [id_image, setId_image] = useState('');

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
  const handleFileSelected = (e) => {
    setImage(e.target.files[0]);
  };
  const handleFileSelected_id_image = (e) => {
    setId_image(e.target.files[0]);
  };

  useEffect(() => {
    axios
      .get('https://amanacart.com/api/admin/address/11/edit', auth)
      .then((response) => {
        setContries(response.data.countries);

        console.log(response.data);
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

  const [status, setStatus] = useState('');
  useEffect(() => {
    axios
      .get(`https://amanacart.com/api/admin/setting/verify`, auth)
      .then((response) => {
        console.log(response);
        setStatus(response.data.status);

        //   setSuccess(response.data.success);
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
  const handleSubmitAddress = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('address_type', 'أساسي');

    formData.append('address_line_1', address_line_1);
    formData.append('address_line_2', address_line_2);
    formData.append('city', city);
    formData.append('state_id', 2);

    // formData.append('state_id', state);
    formData.append('zip_code', zip_code);
    formData.append('country_id', country);
    formData.append('phone', phone);

    // formData.append('_method', 'PUT');

    axios
      .post(`https://amanacart.com/api/admin/address`, formData, auth)
      .then((response) => {
        console.log(response);
        handleSuccess('ADD SUCCESS');

        window.location.reload();

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.getCurrentContent().getPlainText() === '') {
      setVisible(true);
    } else {
      setVisible(false);
    }
    const formData = new FormData();

    if (image === '' || id_image === '') {
      setVisibleImageError(true);
    } else {
      setVisibleImageError(false);
      // Update the formData object
      formData.append('documents', image);
      formData.append('id_image', id_image);
    }

    // formData.append('_method', 'PUT');
    if (image && id_image) {
      axios
        .post(`https://amanacart.com/api/admin/setting/verify`, formData, auth)
        .then((response) => {
          console.log(response);

          //   setSuccess(response.data.success);
          handleSuccess('ADD SUCCESS');

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
    }

    console.log(formData['name']);
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
    <div id='dashboard-analytics' className=' '>
      {/* {JSON.parse(localStorage.getItem('status') || '{}') && localStorage.getItem('status') !== 'true' ? ( */}

      <Row style={{ padding: '10px 20px' }}>
        <Col lg='12'>
          <Card>
            <CardHeader>
              <CardTitle tag='h3'>تحقق </CardTitle>
            </CardHeader>
          </Card>

          {status === 0 || status === 1 || status === 3 ? (
            <Row>
              <Col sm='8'>
                <Card>
                  <CardHeader>
                    <CardTitle tag='h4'>كيف يساعد التحقق من الهوية </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <CardText>بمجرد التحقق من هويتك ، سنعرض الشارة التي تم التحقق منها على نشاطك التجاري وعلى صفحة ملف تعريف متجرك. يتيح ذلك لعملك بناء الثقة في السوق.</CardText>
                  </CardBody>

                  <CardHeader>
                    <CardTitle tag='h4'>سيظهر اسم عملك على النحو التالي: </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <CardText>شهادة شركة أمانة للتجارة الإلكترونية</CardText>
                  </CardBody>

                  <CardHeader>
                    <CardTitle tag='h4'>كيف تعمل العملية </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <ul>
                      <li>يمكنك التقاط صورة أو مسح بطاقة هويتك ضوئيًا (جواز السفر أو رخصة القيادة أو بطاقة الهوية الصادرة عن الحكومة) باستخدام كاميرا عالية الدقة وتحميلها</li>
                      <li>قم بتحميل إثبات عنوانك (رخصة القيادة ، إيصال ضريبة الممتلكات ، فاتورة المرافق أو عقد الإيجار)</li>
                      <li>يمكنك التقاط أو تحميل صورة لوجهك.</li>
                      <li>سوف نتحقق من أنها صور لنفس الشخص.</li>
                      <li>لا يمكنك استخدام نفس الوثائق (رخصة القيادة) للتحقق من الهوية والعنوان.</li>
                    </ul>
                  </CardBody>

                  <CardHeader>
                    <CardTitle tag='h4'>ما هي وثائق الهوية الرسمية التي أحتاجها؟ </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <ul>
                      <li>جواز سفرك</li>
                      <li>رخصة قيادتك</li>
                      <li>بطاقة هوية صادرة عن الحكومة.</li>
                      <li>إيصال ضريبة الأملاك</li>
                      <li>فاتورة خدمات</li>
                      <li>عقد الإيجار</li>
                    </ul>
                  </CardBody>
                  <CardHeader>
                    <CardTitle tag='h6'>يجب أن تكون رخص القيادة وبطاقات الهوية الصادرة من الحكومة مصنوعة من البلاستيك. يجب أن تكون جميع المعرفات صالحة.</CardTitle>
                  </CardHeader>
                </Card>
              </Col>

              <Col lg='4'>
                <Card>
                  <CardHeader>
                    <CardTitle tag='h6'>تحميل المستندات</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <FormGroup>
                      <Label for='image'> تحميل السجل التجاري </Label>
                      <CustomInput type='file' onChange={(e) => handleFileSelected(e)} id='image' name='image' />
                    </FormGroup>
                    <FormGroup>
                      <Label for='id_image'>تحميل صورة الهوية </Label>
                      <CustomInput type='file' onChange={(e) => handleFileSelected_id_image(e)} id='id_image' name='id_image' />
                    </FormGroup>
                    <Button color='primary' type='submit' onClick={handleSubmit}>
                      رفع السجل التجاري
                    </Button>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle tag='h6'> رفع عنوان جديد</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Button color='primary' onClick={(e) => setBasicModal(!basicModal)}>
                      اضافة عنوان
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          ) : (
            <Col sm='12' style={{ textAlign: 'center' }}>
              <Card style={{ padding: '60px 10px' }}>
                <CardTitle tag='h3'> توثيق تشاطك التجاري</CardTitle>
                <CardBody>
                  <img src={src} height='390' />
                </CardBody>
                <CardTitle tag='h3'> تم توثيق حسابك التجاري بنجاح</CardTitle>
              </Card>
              <div className='s' style={{ width: '100%' }}></div>
            </Col>
          )}
        </Col>
      </Row>
      {/**model address */}
      <Modal isOpen={basicModal} className='modal-dialog-centered modal-lg'>
        <ModalHeader toggle={() => setBasicModal(!basicModal)}>الشكل</ModalHeader>
        <ModalBody>
          <Row>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='address_line_1'>العنوان الاول*</Label>
              <Input type='text' name='address_line_1' onChange={(e) => setAddress_line_1(e.target.value)} id='address_line_1' placeholder='العنوان الاول' />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='address_line_2'>العنوان الثاني *</Label>
              <Input type='text' name='address_line_2' id='address_line_2' onChange={(e) => setAddress_line_2(e.target.value)} placeholder='العنوان الثاني' />
            </Col>
            <Col className='mb-1' lg='4' md='4' xs='12'>
              <Label for='city'>المدينة*</Label>
              <Input type='text' name='city' onChange={(e) => setCity(e.target.value)} id='city' placeholder=' اسم المدينة' />
            </Col>
            <Col className='mb-1' lg='4' md='4' xs='12'>
              <Label for='value'>الرمز البريدي*</Label>
              <Input type='text' name='zip_code' onChange={(e) => setZip_code(e.target.value)} id='zip_code' placeholder=' الرمز البريدي' />
            </Col>
            <Col className='mb-1' lg='4' md='4' xs='12'>
              <Label for='phone'>رقم الهاتف*</Label>
              <Input type='text' name='phone' onChange={(e) => setPhone(e.target.value)} id='phone' placeholder=' رقم الهاتف' />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='country'>البلد*</Label>
              <Input type='select' name='country' onChange={(e) => setCountry(e.target.value)} id='country'>
                {countries
                  ? Object.keys(countries || {}).map((e) => {
                      return <option value={e}>{countries[e].name}</option>;
                    })
                  : ''}
                <option>حدد البلد</option>
              </Input>
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='state'>الولاية*</Label>
              <Input type='select' name='state' onChange={(e) => setState(e.target.value)} id='state'>
                {countries[country] && Object.keys(countries[country].states || {}).length > 0 ? (
                  Object.keys(countries[country].states || {}).map((e) => {
                    return <option value={e}>{countries[country].states[e]}</option>;
                  })
                ) : (
                  <option>لايوجد ولايات لهذا البلد </option>
                )}
                {/* <option>حدد الولاية</option> */}
              </Input>
            </Col>

            <Col className='mb-1 d-flex justify-content-end' xs='12'>
              <Button onClick={handleSubmitAddress} color='primary' type='submit'>
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
