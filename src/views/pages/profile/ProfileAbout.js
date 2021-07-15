import { Card, CardBody, CardText, CardHeader, CardTitle, Input, Col, Row, Button, FormGroup, CustomInput, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useState, useEffect } from 'react';
import { CheckCircle, X } from 'react-feather';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import { EditorState } from 'draft-js';
import useJwt from '@src/auth/jwt/useJwt';
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

  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
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
  const handleSubmit = () => {
    // if (value.getCurrentContent().getPlainText() === '') {
    //   setVisible(true);
    // } else {
    //   setVisible(false);
    // }
    // if (image === '') {
    //   setVisibleImageError(true);
    // } else {
    //   setVisibleImageError(false);
    //   // Update the formData object
    //   // formData.append('apiImage', image.name);
    // }

    const formData = new URLSearchParams();

    formData.append('name', full_name);
    formData.append('nice_name', nice_name);
    formData.append('dob', dob);
    formData.append('email', email);
    formData.append('description', description);
    formData.append('sex', sex);

    // formData.append('_method', 'PUT');
    axios
      .put(`https://amanacart.com/api/admin/update`, formData, auth)
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
  const handleSubmitAddress = (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append('address_type', 'أساسي');

    formData.append('address_line_1', address_line_1);
    formData.append('address_line_2', address_line_2);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('zip_code', zip_code);
    formData.append('country_id', country);
    formData.append('phone', phone);

    formData.append('_method', 'PUT');

    axios
      .post(`https://amanacart.com/api/admin/address/11`, formData, auth)
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
              {/* <Col className='mt-2' lg='6' md='6' sm='12'>
            <h5 className='mb-75'>نبذة عن تاريخ الميلاد:</h5>
            <Input type='text' id='dob_text' name='dob_text' value={data.dob_text} />
          </Col> */}
              <Col className='mt-2' lg='12' md='12' sm='12'>
                <h5 className='mb-75'>البريد الالكتروني:</h5>
                <Input type='email' id='email' name='email' onChange={(e) => setEmail(e.target.value)} value={email} />
              </Col>
              {/* <Col className='mt-2' lg='6' md='6' sm='12'>
            <h5 className='mb-75'>العنوان:</h5>
            <Input type='text' id='address' name='address' value={data.address} />
          </Col> */}
              <Col lg='12' md='12' sm='12' className='mt-2'>
                <h5 className='mb-75'>الوصف</h5>
                <Input type='textarea' id='bio' name='bio' value={description} onChange={(e) => setDescription(e.target.value)} />
                {/* <CardText>{data.description}</CardText> */}
              </Col>
              <Row>
                <Col lg='8' md='8' sm='8' className='mt-2'>
                  <FormGroup>
                    <Label for='image'>الصورة الشخصية </Label>
                    <CustomInput type='file' onChange={(e) => handleFileSelectedCover(e)} id='image' name='image' />
                  </FormGroup>
                </Col>
                <Col lg='4' md='4' sm='4' className='mt-3'>
                  <Button color='primary' type='submit' onClick={handleEditAvatar}>
                    تحديث الصورة
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col lg='4' md='4' sm='12' xs='12'>
              <Col className='mt-2'>
                <h5 className='mb-75'>العنوان</h5>

                <Button color='primary' type='submit' onClick={() => setBasicModal(!basicModal)}>
                  اضافة عنوان
                </Button>
              </Col>
              <Col className='mt-4'>
                <h3 className='mb-75'>تاجر</h3>
                <p>{data.shop_name}</p>
              </Col>
              <Col className='mt-2'>
                <h3 className='mb-75'>BRAND LOGO</h3>
                <img src={data.shop_logo ? data.shop_logo : ''} alt='not found' width='180' />
              </Col>
              <Col className='mt-2'>
                <h3 className='mb-75'>تم التحقق </h3>
                <p>{data && data.verified && data.verified.id ? <CheckCircle style={{ color: '#17881a' }} /> : <CheckCircle style={{ color: 'rgb(154 167 155)' }} />} تم التحقق من الهوية</p>
                <p>{data && data.verified && data.verified.phone ? <CheckCircle style={{ color: '#17881a' }} /> : <CheckCircle style={{ color: 'rgb(154 167 155)' }} />} تم التحقق من رقم الهاتف</p>
                <p>{data && data.verified && data.verified.address ? <CheckCircle style={{ color: '#17881a' }} /> : <CheckCircle style={{ color: 'rgb(154 167 155)' }} />} تم التحقق من العنوان</p>
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
      </Card>
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
    </>
  );
};

export default ProfileAbout;
