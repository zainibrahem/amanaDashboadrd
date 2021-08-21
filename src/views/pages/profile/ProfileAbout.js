import {
  Card,
  CardBody,
  CardText,
  CardHeader,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  CardTitle,
  Input,
  Col,
  Row,
  Button,
  FormGroup,
  CustomInput,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { useState, useEffect } from 'react';
import { CheckCircle, X, Home, Settings, User } from 'react-feather';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import { EditorState } from 'draft-js';
import useJwt from '@src/auth/jwt/useJwt';
import { Lock, MapPin } from 'react-feather';
import Billing from './billing';
import Tickets from './tickets';
const ProfileAbout = () => {
  /**profile Info */
  const [full_name, setFull_name] = useState(null);
  const [nice_name, setNice_name] = useState('');
  const [description, setDescription] = useState('');
  const [sex, setSex] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const config = useJwt.jwtConfig;
  const MySwal = withReactContent(Swal);
  const [image, setImage] = useState('');
  const [basicModal, setBasicModal] = useState(false);

  const [basicModals, setBasicModals] = useState(false);
  /*Address */
  const [address_id, setAddress_id] = useState(null);

  const [address_line_1, setAddress_line_1] = useState(null);
  const [address_line_2, setAddress_line_2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip_code, setZip_code] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [countries, setContries] = useState([]);
  const [data, setData] = useState([]);

  const [address, setAddress] = useState(null);

  const [addresType, setAddressType] = useState(null);

  /**password */
  const [current_password, setCurrent_password] = useState(null);
  const [password, setPassword] = useState(null);
  const [password_confirmation, setPassword_confirmation] = useState(null);

  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };
  const [activeTap, setActiveTap] = useState('1');

  const toggle = (tab) => {
    if (activeTap !== tab) {
      setActiveTap(tab);
    }
  };
  useEffect(() => {
    axios
      .get('https://amanacart.com/api/admin/address/11/edit', auth)
      .then((response) => {
        setContries(response.data.countries);

        console.log(response.data);
      })
      .catch((error) => {
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
    axios
      .get('https://amanacart.com/api/admin/profile', auth)
      .then((response) => {
        console.log(response.data.profile);
        setFull_name(response.data.profile.full_name);
        setNice_name(response.data.profile.nice_name);
        setDob(response.data.profile.dob);
        setEmail(response.data.profile.email);
        setDescription(response.data.profile.description);
        setSex(response.data.profile.sex);
        setData(response.data.profile);
        setAddress(response.data.profile.address);
        setAddressType(response.data.profile.address.address_type);

        if (response.data.profile.address !== null) {
          setAddress_id(response.data.profile.address.id);
          setAddress_line_1(response.data.profile.address.address_line_1);
          setAddress_line_2(response.data.profile.address.address_line_2);
          setCity(response.data.profile.address.city);
          setPhone(response.data.profile.address.phone);
          setCountry(response.data.profile.address.country);
          setZip_code(response.data.profile.address.zip_code);
          setState(response.data.profile.address.state);
        }

        // setdata(response.data.disputes);
        // console.log(response.data);
        // setTrashData(response.data.closed);
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
  const handleSubmit = () => {
    const formData = new URLSearchParams();
    formData.append('name', full_name);
    formData.append('nice_name', nice_name);
    formData.append('dob', dob);
    formData.append('email', email);
    formData.append('description', description);
    formData.append('sex', sex);
    axios
      .put(`https://amanacart.com/api/admin/update`, formData, auth)
      .then((response) => {
        handleSuccess(' SUCCESS');
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

    console.log(formData['name']);
  };
  const handleEditAvatar = () => {
    const formData = new FormData();

    formData.append('image', image);

    // formData.append('_method', 'PUT');
    axios
      .post(`https://amanacart.com/api/admin/updatePhoto`, formData, auth)
      .then((response) => {
        handleSuccess(' SUCCESS');
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
  const handleSubmitPassword = (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append('current_password', current_password);
    formData.append('password', password);
    formData.append('password_confirmation', password_confirmation);
    if (current_password && password && password_confirmation) {
      axios
        .post(`https://amanacart.com/api/admin/updatePassword`, formData, auth)
        .then((response) => {
          console.log(response);
          handleSuccess('ADD SUCCESS');

          // window.location.reload();

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
    } else {
      handleError('please filds req');
    }
  };
  const handleSubmitAddress = (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append('address_type', addresType);

    formData.append('address_line_1', address_line_1);
    formData.append('address_line_2', address_line_2);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('zip_code', zip_code);
    formData.append('country_id', country);
    formData.append('phone', phone);

    formData.append('_method', 'PUT');

    axios
      .post(`https://amanacart.com/api/admin/address/${address_id}`, formData, auth)
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
  const handleFileSelectedCover = (e) => {
    setImage(e.target.files[0]);
  };
  return (
    <>
      <Row className='match-height'>
        <Col md='12' xs='12'>
          <Card className='m-0' style={{ borderRadius: '0px' }}>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start' style={{ padding: '0rem' }}>
              <Nav tabs style={{ marginBottom: '0rem', width: '100%' }}>
                <NavItem style={{ width: '33.3333%' }}>
                  <NavLink
                    active={activeTap === '1'}
                    onClick={() => {
                      toggle('1');
                    }}
                    style={{ padding: '20px' }}
                  >
                    <Home size={14} />
                    الصفحة الشخصية
                  </NavLink>
                </NavItem>
                <NavItem style={{ width: '33.3333%' }}>
                  <NavLink
                    active={activeTap === '2'}
                    onClick={() => {
                      toggle('2');
                    }}
                    style={{ padding: '20px' }}
                  >
                    <Settings size={14} />
                    الفواتير
                  </NavLink>
                </NavItem>
                <NavItem style={{ width: '33.3333%' }}>
                  <NavLink
                    active={activeTap === '3'}
                    onClick={() => {
                      toggle('3');
                    }}
                    style={{ padding: '20px' }}
                  >
                    <User size={14} />
                    <span className='align-middle'>تذاكر الدعم الفني </span>
                  </NavLink>
                </NavItem>
              </Nav>
            </CardHeader>
          </Card>
        </Col>
      </Row>
      <TabContent activeTab={activeTap}>
        <TabPane tabId='1'>
          <Row className='match-height'>
            <Col>
              <Card>
                <CardBody>
                  <Row>
                    <Col lg='8' md='8' sm='12' xs='12'>
                      <Col className='mt-2' lg='12' md='12' sm='12'>
                        <h5 className='mb-75'>الاسم:</h5>
                        <Input type='text' id='nice_name' name='nice_name' onChange={(e) => setNice_name(e.target.value)} value={nice_name} />
                      </Col>

                      <Col className='mt-2' lg='12' md='12' sm='12'>
                        <h5 className='mb-75'>تاريخ الميلاد:</h5>
                        <Input type='text' id='dob' name='dob' onChange={(e) => setDob(e.target.value)} value={dob} />
                      </Col>

                      <Col className='mt-2' lg='12' md='12' sm='12'>
                        <h5 className='mb-75'>الجنس:</h5>
                        <Input type='text' id='sex' name='sex' onChange={(e) => setSex(e.target.value)} value={sex} />
                      </Col>

                      <Col className='mt-2' lg='12' md='12' sm='12'>
                        <h5 className='mb-75'>البريد الالكتروني:</h5>
                        <Input type='email' id='email' name='email' onChange={(e) => setEmail(e.target.value)} value={email} />
                      </Col>

                      <Col lg='12' md='12' sm='12' className='mt-2'>
                        <h5 className='mb-75'>الوصف</h5>
                        <Input type='textarea' id='bio' name='bio' value={description} onChange={(e) => setDescription(e.target.value)} />
                      </Col>
                      <Row>
                        <Col lg='8' md='8' sm='8' className='mt-2'>
                          <FormGroup>
                            <Label for='image'>الصورة الشخصية </Label>
                            <CustomInput type='file' onChange={(e) => handleFileSelectedCover(e)} id='image' name='image' />
                          </FormGroup>
                        </Col>
                        <Col lg='4' md='4' sm='4' className='mt-3'>
                          <Button onClick={(e) => setBasicModal(!basicModal)} color='primary' type='submit' onClick={handleEditAvatar}>
                            تحديث الصورة
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg='4' md='4' sm='12' xs='12'>
                      <Col className='mt-2'>
                        {address && address !== null ? (
                          <>
                            <h5 className='mb-75'>العنوان</h5>
                            <p>{address.address_line_1}</p>
                            <p>{address.address_line_2}</p>
                            <p>{address.city}</p>
                            <div className='d-flex'>
                              <p>{address.state}:</p>
                              <span className='number'>{address.zip_code}</span>
                            </div>

                            <p>{address.country}</p>
                            <p>
                              رقم الهاتف: <span className='number'>{address.phone}</span>
                            </p>
                            <Button color='primary' onClick={(e) => setBasicModal(!basicModal)}>
                              <MapPin size={20} />
                              تحديث العنوان
                            </Button>
                          </>
                        ) : (
                          ''
                        )}
                      </Col>
                      <Col className='mt-4'>
                        <Button color='primary' onClick={(e) => setBasicModals(!basicModals)}>
                          <Lock size={15} />
                          تغيير كلمة السر
                        </Button>
                      </Col>
                      <Col className='mt-4'>
                        <h3 className='mb-75'>تاجر</h3>
                        <p>{data.shop_name}</p>
                      </Col>
                      <Col className='mt-2'>
                        <h3 className='mb-75'>BRAND LOGO</h3>
                        <img src={data.shop_logo ? data.shop_logo : ''} alt='not found' width='180' height='50' />
                      </Col>
                      <Col className='mt-2'>
                        <h3 className='mb-75'>تم التحقق </h3>
                        <p>{data && data.verified && data.verified.id ? <CheckCircle style={{ color: '#17881a' }} /> : <CheckCircle style={{ color: 'rgb(154 167 155)' }} />} تم التحقق من الهوية</p>
                        <p>
                          {data && data.verified && data.verified.phone ? <CheckCircle style={{ color: '#17881a' }} /> : <CheckCircle style={{ color: 'rgb(154 167 155)' }} />} تم التحقق من رقم الهاتف
                        </p>
                        <p>
                          {data && data.verified && data.verified.address ? <CheckCircle style={{ color: '#17881a' }} /> : <CheckCircle style={{ color: 'rgb(154 167 155)' }} />} تم التحقق من العنوان
                        </p>
                        <Link
                          to={{
                            pathname: '/pages/verify_commercial_register',
                          }}
                        >
                          <Button color='primary' type='submit'>
                            توثيق السجل التجاري
                          </Button>
                        </Link>
                      </Col>
                    </Col>
                    <Col lg='12' md='12' sm='12' className='  d-flex justify-content-end'>
                      <Button color='primary' type='submit' onClick={handleSubmit}>
                        حفظ التعديلات
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>{' '}
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId='2'>
          <Row className='match-height'>
            <Col lg={12} style={{ textAlign: 'center' }}>
              <Card>
                <CardBody style={{ textAlign: '-webkit-center' }}>
                  <Billing />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId='3'>
          <Row className='match-height'>
            <Col>
              <Tickets />
            </Col>
          </Row>
        </TabPane>
      </TabContent>

      {/**model password */}
      <Modal isOpen={basicModals} className='modal-dialog-top modal-md'>
        <ModalHeader toggle={() => setBasicModals(!basicModals)}>الشكل</ModalHeader>
        <ModalBody>
          <Row>
            <Col className='mb-1' lg='12' md='12' xs='12'>
              <Label for='current_password'> كلمة السر الحالية*</Label>
              <Input type='password' name='current_password' onChange={(e) => setCurrent_password(e.target.value)} id='current_password' placeholder=' كلمة السر الحالية' />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='password'> كلمة السر الجديدة *</Label>
              <Input type='password' name='password' id='password' onChange={(e) => setPassword(e.target.value)} placeholder=' كلمة السر الجديدة' />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='password_confirmation'>تأكيد كلمة السر*</Label>
              <Input type='password' name='password_confirmation' onChange={(e) => setPassword_confirmation(e.target.value)} id='password_confirmation' placeholder='تاكيد كلمة السر' />
            </Col>
            <Col className='mb-1 d-flex justify-content-end' xs='12'>
              <Button onClick={handleSubmitPassword} color='primary' type='submit'>
                حفظ
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      {/**model address */}
      <Modal isOpen={basicModal} className='modal-dialog-centered modal-lg'>
        <ModalHeader toggle={() => setBasicModal(!basicModal)}>الشكل</ModalHeader>
        <ModalBody>
          <Row>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='address_line_1'>العنوان الاول*</Label>
              <Input type='text' name='address_line_1' onChange={(e) => setAddress_line_1(e.target.value)} value={address_line_1} id='address_line_1' placeholder='العنوان الاول' />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='address_line_2'>العنوان الثاني *</Label>
              <Input type='text' name='address_line_2' id='address_line_2' onChange={(e) => setAddress_line_2(e.target.value)} value={address_line_2} placeholder='العنوان الثاني' />
            </Col>
            <Col className='mb-1' lg='4' md='4' xs='12'>
              <Label for='city'>المدينة*</Label>
              <Input type='text' name='city' onChange={(e) => setCity(e.target.value)} id='city' value={city} placeholder=' اسم المدينة' />
            </Col>
            <Col className='mb-1' lg='4' md='4' xs='12'>
              <Label for='value'>الرمز البريدي*</Label>
              <Input type='text' name='zip_code' onChange={(e) => setZip_code(e.target.value)} id='zip_code' value={zip_code} placeholder=' الرمز البريدي' />
            </Col>
            <Col className='mb-1' lg='4' md='4' xs='12'>
              <Label for='phone'>رقم الهاتف*</Label>
              <Input type='text' name='phone' onChange={(e) => setPhone(e.target.value)} id='phone' value={phone} placeholder=' رقم الهاتف' />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='country'>البلد*</Label>
              <Input type='select' name='country' onChange={(e) => setCountry(e.target.value)} value={country} id='country'>
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
              <Input type='select' name='state' onChange={(e) => setState(e.target.value)} value={state} id='state'>
                {countries[country] && Object.keys(countries[country].states || {}).length > 0 ? (
                  Object.keys(countries[country].states || {}).map((e) => {
                    return <option value={e}>{countries[country].states[e]}</option>;
                  })
                ) : (
                  <option>لايوجد ولايات لهذا البلد </option>
                )}
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
    </>
  );
};

export default ProfileAbout;
