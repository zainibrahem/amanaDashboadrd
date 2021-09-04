import { useSkin } from '@hooks/useSkin';
import { useState } from 'react';

import { Link } from 'react-router-dom';
import { Facebook, Twitter, Mail, GitHub } from 'react-feather';
import InputPasswordToggle from '@components/input-password-toggle';
import { Row, Col, CardTitle, CardText, Form, FormGroup, Label, Input, CustomInput, Button } from 'reactstrap';
import '@styles/base/pages/page-auth.scss';
import './style.css';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { EditorState } from 'draft-js';

const LoginV2 = () => {
  const [skin, setSkin] = useSkin();

  const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
    source = require(`@src/assets/images/pages/login image 1.jpg`).default;
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [value, setValue] = useState(EditorState.createEmpty());
  const [visible, setVisible] = useState('');
  const MySwal = withReactContent(Swal);
  let history = useHistory();
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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.getCurrentContent().getPlainText() === '') {
      setVisible(true);
    } else {
      setVisible(false);
    }
    // if (image === '') {
    //   setVisibleImageError(true);
    // } else {
    //   setVisibleImageError(false);
    //   // Update the formData object
    //   // formData.append('apiImage', image.name);
    // }

    const formData = new FormData();

    formData.append('email', email);
    formData.append('password', password);

    // formData.append('_method', 'PUT');
    axios
      .post(`https://amanacart.com/api/admin/auth/login`, formData)
      .then((response) => {
        console.log(response.data);
        localStorage.setItem('token', response.data.api_token);
        history.push('/dashboard/ecommerce');
        handleSuccess('تمت العملية بنجاح');
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
  return (
    <div className='auth-wrapper auth-v2'>
      <Row className='auth-inner m-0' style={{ direction: 'rtl' }}>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12' style={{ textAlign: '-webkit-center' }}>
            <svg className='s_show' style={{ position: 'relative', top: '-91px' }} xmlns='http://www.w3.org/2000/svg' width='180.261' height='43' viewBox='0 0 180.261 43'>
              <g id='Group_12' data-name='Group 12' transform='translate(0)'>
                <g id='Group_10' data-name='Group 10' transform='translate(46.227 11.086)'>
                  <g id='Group_9' data-name='Group 9' transform='translate(0 0)'>
                    <g id='Group_8' data-name='Group 8'>
                      <g id='Group_5' data-name='Group 5' transform='translate(0 0.27)'>
                        <g id='Group_4' data-name='Group 4'>
                          <path
                            id='Path_5'
                            data-name='Path 5'
                            d='M-3960.62,856.149a.575.575,0,0,1-.575-.576v-9.935a7.655,7.655,0,0,0-1.87-5.363,6.268,6.268,0,0,0-4.857-2.053,6.375,6.375,0,0,0-4.869,2.031,7.351,7.351,0,0,0-1.9,5.234,7.507,7.507,0,0,0,1.956,5.352,6.537,6.537,0,0,0,4.986,2.085,7.774,7.774,0,0,0,2.676-.473,9.267,9.267,0,0,0,1.739-.86.575.575,0,0,1,.873.493v2.626a.571.571,0,0,1-.3.506,10.725,10.725,0,0,1-2.419.922,12.417,12.417,0,0,1-3,.355,10,10,0,0,1-2.988-.462,9.73,9.73,0,0,1-2.687-1.3,10.547,10.547,0,0,1-3.482-3.923,11.324,11.324,0,0,1-1.2-5.234,10.773,10.773,0,0,1,2.988-7.813,10.112,10.112,0,0,1,7.588-3.084,10.486,10.486,0,0,1,5.546,1.526,10.213,10.213,0,0,1,3.869,4.192,9.532,9.532,0,0,1,.892,2.633,24.956,24.956,0,0,1,.269,4.267v8.28a.576.576,0,0,1-.576.576Z'
                            transform='translate(3978.542 -834.676)'
                            fill='#191919'
                          />
                          <path
                            id='Path_6'
                            data-name='Path 6'
                            d='M-3705.708,856.149a.653.653,0,0,1-.653-.652V843.962a9.745,9.745,0,0,1,2.257-6.793,7.8,7.8,0,0,1,6.083-2.493,7.962,7.962,0,0,1,3.611.828,7.931,7.931,0,0,1,2.38,1.835.648.648,0,0,0,.963,0,8.1,8.1,0,0,1,2.4-1.849,7.912,7.912,0,0,1,3.59-.817,7.766,7.766,0,0,1,6.051,2.5,9.723,9.723,0,0,1,2.268,6.782V855.5a.652.652,0,0,1-.653.652h-2.435a.652.652,0,0,1-.652-.652V843.252a5.01,5.01,0,0,0-1.268-3.568,4.327,4.327,0,0,0-3.31-1.354,4.326,4.326,0,0,0-3.31,1.354,5.007,5.007,0,0,0-1.268,3.568V855.5a.653.653,0,0,1-.653.652h-2.435a.653.653,0,0,1-.653-.652V843.252a4.959,4.959,0,0,0-1.29-3.568,4.4,4.4,0,0,0-3.332-1.354,4.318,4.318,0,0,0-3.321,1.354,5.035,5.035,0,0,0-1.257,3.568V855.5a.652.652,0,0,1-.652.652Z'
                            transform='translate(3732.025 -834.676)'
                            fill='#191919'
                          />
                          <path
                            id='Path_7'
                            data-name='Path 7'
                            d='M-3335.563,856.149a.576.576,0,0,1-.576-.576v-9.935a7.655,7.655,0,0,0-1.87-5.363,6.269,6.269,0,0,0-4.858-2.053,6.376,6.376,0,0,0-4.869,2.031,7.351,7.351,0,0,0-1.9,5.234,7.508,7.508,0,0,0,1.956,5.352,6.537,6.537,0,0,0,4.987,2.085,7.773,7.773,0,0,0,2.676-.473,9.44,9.44,0,0,0,1.937-.987.436.436,0,0,1,.675.366v2.962a.437.437,0,0,1-.227.385,10.731,10.731,0,0,1-2.491.96,12.416,12.416,0,0,1-3,.355,10,10,0,0,1-2.988-.462,9.731,9.731,0,0,1-2.687-1.3,10.542,10.542,0,0,1-3.482-3.923,11.321,11.321,0,0,1-1.2-5.234,10.773,10.773,0,0,1,2.988-7.813,10.113,10.113,0,0,1,7.588-3.084,10.487,10.487,0,0,1,5.546,1.526,10.212,10.212,0,0,1,3.869,4.192,9.532,9.532,0,0,1,.892,2.633,25.023,25.023,0,0,1,.268,4.267v8.419a.437.437,0,0,1-.437.437Z'
                            transform='translate(3412.424 -834.676)'
                            fill='#191919'
                          />
                          <path
                            id='Path_8'
                            data-name='Path 8'
                            d='M-3080.606,856.149a.7.7,0,0,1-.7-.7v-10.8a10.4,10.4,0,0,1,2.45-7.287,8.416,8.416,0,0,1,6.535-2.687,8.35,8.35,0,0,1,6.513,2.687,10.46,10.46,0,0,1,2.429,7.287v10.8a.7.7,0,0,1-.7.7h-2.346a.7.7,0,0,1-.7-.7v-11.49a5.748,5.748,0,0,0-1.451-4.063,4.877,4.877,0,0,0-3.751-1.569,4.919,4.919,0,0,0-3.751,1.569,5.7,5.7,0,0,0-1.472,4.063v11.49a.7.7,0,0,1-.7.7Z'
                            transform='translate(3165.907 -834.676)'
                            fill='#191919'
                          />
                          <path
                            id='Path_9'
                            data-name='Path 9'
                            d='M-2834.057,856.149a.576.576,0,0,1-.576-.576v-9.935a7.656,7.656,0,0,0-1.87-5.363,6.269,6.269,0,0,0-4.858-2.053,6.375,6.375,0,0,0-4.869,2.031,7.35,7.35,0,0,0-1.9,5.234,7.508,7.508,0,0,0,1.956,5.352,6.538,6.538,0,0,0,4.987,2.085,7.771,7.771,0,0,0,2.676-.473,9.269,9.269,0,0,0,1.739-.86.574.574,0,0,1,.873.493v2.626a.57.57,0,0,1-.3.506,10.721,10.721,0,0,1-2.418.922,12.417,12.417,0,0,1-3,.355,10,10,0,0,1-2.988-.462,9.728,9.728,0,0,1-2.687-1.3,10.541,10.541,0,0,1-3.482-3.923,11.321,11.321,0,0,1-1.2-5.234,10.773,10.773,0,0,1,2.988-7.813,10.113,10.113,0,0,1,7.588-3.084,10.486,10.486,0,0,1,5.546,1.526,10.211,10.211,0,0,1,3.869,4.192,9.524,9.524,0,0,1,.892,2.633,25.017,25.017,0,0,1,.269,4.267v8.28a.576.576,0,0,1-.576.576Z'
                            transform='translate(2958.206 -834.676)'
                            fill='#191919'
                          />
                        </g>
                      </g>
                      <g id='Group_7' data-name='Group 7' transform='translate(130.115)'>
                        <g id='Group_6' data-name='Group 6'>
                          <path
                            id='Path_10'
                            data-name='Path 10'
                            d='M-2594.73,833.78a1.957,1.957,0,0,1-1.95,1.982,1.969,1.969,0,0,1-1.969-1.982,1.967,1.967,0,0,1,1.976-1.969A1.952,1.952,0,0,1-2594.73,833.78Zm-3.5.006a1.566,1.566,0,0,0,1.541,1.611,1.561,1.561,0,0,0,1.534-1.611,1.57,1.57,0,0,0-1.541-1.611A1.569,1.569,0,0,0-2598.228,833.787Zm2.308-.639a1.387,1.387,0,0,0-.607-.141.729.729,0,0,0-.793.793.755.755,0,0,0,.786.8,1.255,1.255,0,0,0,.639-.153l.1.326a1.455,1.455,0,0,1-.793.2,1.1,1.1,0,0,1-1.177-1.157,1.186,1.186,0,0,1,1.241-1.189,1.215,1.215,0,0,1,.7.179Z'
                            transform='translate(2598.65 -831.811)'
                            fill='#141414'
                          />
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
                <g id='Group_11' data-name='Group 11'>
                  <path
                    id='Path_11'
                    data-name='Path 11'
                    d='M-4353.608,780.454l-15.933-9.2a3.1,3.1,0,0,0-3.1,0l-15.933,9.2a3.1,3.1,0,0,0-1.551,2.686v18.4a3.1,3.1,0,0,0,1.551,2.686l15.933,9.2a3.1,3.1,0,0,0,3.1,0l15.933-9.2a3.1,3.1,0,0,0,1.551-2.686v-18.4A3.1,3.1,0,0,0-4353.608,780.454Zm-6.419,22.938a3.981,3.981,0,0,1-3.981-3.98V792.4a8.009,8.009,0,0,0-1.956-5.611,6.559,6.559,0,0,0-5.083-2.148,6.672,6.672,0,0,0-5.094,2.125,7.691,7.691,0,0,0-1.99,5.475,7.856,7.856,0,0,0,2.046,5.6,6.839,6.839,0,0,0,5.218,2.182,8.139,8.139,0,0,0,2.8-.495,10.57,10.57,0,0,0,2.732-1.529V799.7a3.769,3.769,0,0,1-2.815,3.672l-.03.008a12.983,12.983,0,0,1-3.136.371,10.451,10.451,0,0,1-3.126-.484,10.192,10.192,0,0,1-2.811-1.36,11.041,11.041,0,0,1-3.644-4.1,11.851,11.851,0,0,1-1.259-5.476,11.272,11.272,0,0,1,3.125-8.174,10.58,10.58,0,0,1,7.939-3.227,10.97,10.97,0,0,1,5.8,1.6,10.687,10.687,0,0,1,4.048,4.385,9.962,9.962,0,0,1,.933,2.755,26.191,26.191,0,0,1,.281,4.464Z'
                    transform='translate(4390.127 -770.839)'
                    fill='#ffbc00'
                  />
                  <path
                    id='Path_12'
                    data-name='Path 12'
                    d='M-4335.935,1041.305a.146.146,0,0,0-.136-.258c-5.6,2.711-15.209,5.578-17.506,5.578-2.363,0-10.987-2.735-15.983-5.087a.127.127,0,0,0-.118.225l14.456,8.535a3.723,3.723,0,0,0,3.723,0Z'
                    transform='translate(4372.25 -1007.797)'
                    fill='#f39c12'
                  />
                </g>
              </g>
            </svg>
            <div style={{ position: 'relative', top: '-50px' }}>
              <CardTitle tag='h5' style={{ textAlign: 'center' }} className='font-weight-bold mb-1' className='s_show'>
                قسم البائع
              </CardTitle>
            </div>

            <CardText className='mb-2' style={{ textAlign: 'center', position: 'relative', top: '-23px' }}>
              الرجاء تسجيل الدخول إلى حسابك وبدء المغامرة
            </CardText>
            <Form className='auth-login-form mt-2' onSubmit={(e) => e.preventDefault()}>
              <FormGroup>
                <Input type='email' id='login-email' name='login-email' onChange={(e) => setEmail(e.target.value)} placeholder='البريد الالكتروني' autoFocus require />
              </FormGroup>
              <FormGroup>
                <Input type='text' id='login-password' name='login-password' onChange={(e) => setPassword(e.target.value)} placeholder=' كلمة السر' autoFocus require />
              </FormGroup>
              {/* <FormGroup>
                <CustomInput type='checkbox' className='custom-control-Primary' id='remember-me' label='Remember Me' />
              </FormGroup> */}
              <Button.Ripple onClick={handleSubmit} type='submit' color='primary' className='mt-2' block>
                تسجيل الدخول
              </Button.Ripple>
            </Form>
            {/* <p className='text-center mt-2'>
              <span className='mr-25'>New on our platform?</span>
              <Link to='/pages/register-v2'>
                <span>Create an account</span>
              </Link>
            </p> */}
            {/* <div className='divider my-2'>
              <div className='divider-text'>or</div>
            </div>
            <div className='auth-footer-btn d-flex justify-content-center'>
              <Button.Ripple color='facebook'>
                <Facebook size={14} />
              </Button.Ripple>
              <Button.Ripple color='twitter'>
                <Twitter size={14} />
              </Button.Ripple>
              <Button.Ripple color='google'>
                <Mail size={14} />
              </Button.Ripple>
              <Button.Ripple className='mr-0' color='github'>
                <GitHub size={14} />
              </Button.Ripple>
            </div> */}
          </Col>
        </Col>
        <Col className='back d-none d-lg-flex '>
          <div className='opacity'> </div>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative', left: '-114px' }}>
            <Col style={{ textAlign: 'start' }}>
              <CardTitle tag='h1' className='font-weight-bold mb-1' className='b_show'>
                مرحبا بكم في أمانة
              </CardTitle>
              <CardTitle tag='h3' className='font-weight-bold mb-1' className='b_show'>
                قسم البائع
              </CardTitle>
            </Col>
          </div>

          <Col className='' to='/' onClick={(e) => e.preventDefault()}>
            <svg
              style={{ width: '35%', zIndex: '99999', height: '10vh', marginTop: '9px' }}
              id='Group_12'
              data-name='Group 12'
              xmlns='http://www.w3.org/2000/svg'
              width='786.922'
              height='187.715'
              viewBox='0 0 786.922 187.715'
            >
              <g id='Group_10' data-name='Group 10' transform='translate(201.801 48.395)'>
                <g id='Group_9' data-name='Group 9' transform='translate(0 0)'>
                  <g id='Group_8' data-name='Group 8'>
                    <g id='Group_5' data-name='Group 5' transform='translate(0 1.179)'>
                      <g id='Group_4' data-name='Group 4'>
                        <path
                          id='Path_5'
                          data-name='Path 5'
                          d='M-3900.3,928.417a2.513,2.513,0,0,1-2.513-2.513V882.532q0-14.449-8.163-23.413t-21.205-8.961q-12.954,0-21.256,8.867t-8.3,22.849q0,14.264,8.537,23.365t21.768,9.1a33.933,33.933,0,0,0,11.684-2.064,40.485,40.485,0,0,0,7.592-3.753,2.508,2.508,0,0,1,3.811,2.152v11.463a2.49,2.49,0,0,1-1.312,2.208,46.724,46.724,0,0,1-10.559,4.023,54.211,54.211,0,0,1-13.092,1.548,43.66,43.66,0,0,1-13.043-2.017,42.486,42.486,0,0,1-11.728-5.677,46.053,46.053,0,0,1-15.2-17.125,49.437,49.437,0,0,1-5.254-22.848q0-20.643,13.043-34.109t33.123-13.465a45.778,45.778,0,0,1,24.21,6.662,44.575,44.575,0,0,1,16.891,18.3,41.529,41.529,0,0,1,3.893,11.495q1.175,6.241,1.176,18.626V925.9a2.514,2.514,0,0,1-2.515,2.513Z'
                          transform='translate(3978.542 -834.676)'
                          fill='#fff'
                        />
                        <path
                          id='Path_6'
                          data-name='Path 6'
                          d='M-3703.511,928.417a2.849,2.849,0,0,1-2.85-2.848V875.213q0-18.767,9.852-29.653t26.556-10.884a34.758,34.758,0,0,1,15.764,3.613,34.624,34.624,0,0,1,10.39,8.012,2.831,2.831,0,0,0,4.2.013,35.377,35.377,0,0,1,10.46-8.073,34.546,34.546,0,0,1,15.672-3.566q16.513,0,26.415,10.932t9.9,29.6v50.356a2.847,2.847,0,0,1-2.848,2.848h-10.631a2.847,2.847,0,0,1-2.848-2.848V872.116q0-9.663-5.536-15.576t-14.451-5.912q-8.915,0-14.451,5.912t-5.535,15.576v53.453a2.85,2.85,0,0,1-2.85,2.848h-10.631a2.848,2.848,0,0,1-2.848-2.848V872.116q0-9.663-5.629-15.576a19.191,19.191,0,0,0-14.546-5.912q-9.007,0-14.5,5.912t-5.49,15.576v53.453a2.847,2.847,0,0,1-2.847,2.848Z'
                          transform='translate(3818.4 -834.676)'
                          fill='#fff'
                        />
                        <path
                          id='Path_7'
                          data-name='Path 7'
                          d='M-3275.249,928.417a2.512,2.512,0,0,1-2.512-2.513V882.532q0-14.449-8.164-23.413t-21.208-8.961q-12.948,0-21.254,8.867t-8.3,22.849q0,14.264,8.54,23.365t21.769,9.1a33.922,33.922,0,0,0,11.682-2.064,41.154,41.154,0,0,0,8.457-4.307,1.905,1.905,0,0,1,2.945,1.6V922.5a1.907,1.907,0,0,1-.993,1.681,46.857,46.857,0,0,1-10.876,4.191,54.208,54.208,0,0,1-13.091,1.548A43.657,43.657,0,0,1-3321.3,927.9a42.478,42.478,0,0,1-11.729-5.677,46.025,46.025,0,0,1-15.2-17.125,49.437,49.437,0,0,1-5.253-22.848q0-20.643,13.041-34.109t33.125-13.465a45.777,45.777,0,0,1,24.209,6.662,44.579,44.579,0,0,1,16.89,18.3,41.562,41.562,0,0,1,3.894,11.495q1.173,6.241,1.172,18.626v36.751a1.908,1.908,0,0,1-1.908,1.909Z'
                          transform='translate(3610.781 -834.676)'
                          fill='#fff'
                        />
                        <path
                          id='Path_8'
                          data-name='Path 8'
                          d='M-3078.262,928.417a3.042,3.042,0,0,1-3.041-3.043V878.215q0-20.078,10.7-31.81t28.526-11.729q17.827,0,28.432,11.729t10.6,31.81v47.159a3.042,3.042,0,0,1-3.041,3.043h-10.244a3.042,3.042,0,0,1-3.041-3.043V875.213q0-10.884-6.335-17.735t-16.374-6.85a21.47,21.47,0,0,0-16.374,6.85q-6.429,6.85-6.429,17.735v50.161a3.042,3.042,0,0,1-3.044,3.043Z'
                          transform='translate(3450.638 -834.676)'
                          fill='#fff'
                        />
                        <path
                          id='Path_9'
                          data-name='Path 9'
                          d='M-2773.741,928.417a2.513,2.513,0,0,1-2.514-2.513V882.532q0-14.449-8.164-23.413t-21.205-8.961q-12.949,0-21.256,8.867t-8.3,22.849q0,14.264,8.538,23.365t21.771,9.1a33.933,33.933,0,0,0,11.684-2.064,40.4,40.4,0,0,0,7.589-3.753,2.507,2.507,0,0,1,3.811,2.152v11.463a2.488,2.488,0,0,1-1.31,2.208,46.787,46.787,0,0,1-10.558,4.023,54.2,54.2,0,0,1-13.092,1.548,43.656,43.656,0,0,1-13.043-2.017,42.451,42.451,0,0,1-11.729-5.677,46,46,0,0,1-15.2-17.125,49.4,49.4,0,0,1-5.256-22.848q0-20.643,13.042-34.109t33.125-13.465a45.775,45.775,0,0,1,24.209,6.662,44.567,44.567,0,0,1,16.89,18.3,41.564,41.564,0,0,1,3.895,11.495q1.172,6.241,1.175,18.626V925.9a2.514,2.514,0,0,1-2.514,2.513Z'
                          transform='translate(3315.711 -834.676)'
                          fill='#fff'
                        />
                      </g>
                    </g>
                    <g id='Group_7' data-name='Group 7' transform='translate(568.013)'>
                      <g id='Group_6' data-name='Group 6'>
                        <path
                          id='Path_10'
                          data-name='Path 10'
                          d='M-2581.542,840.408a8.541,8.541,0,0,1-8.513,8.654,8.593,8.593,0,0,1-8.595-8.654,8.587,8.587,0,0,1,8.624-8.6A8.522,8.522,0,0,1-2581.542,840.408Zm-15.266.028a6.838,6.838,0,0,0,6.728,7.034,6.814,6.814,0,0,0,6.7-7.034,6.854,6.854,0,0,0-6.727-7.034A6.85,6.85,0,0,0-2596.808,840.436Zm10.076-2.791a6.053,6.053,0,0,0-2.649-.614,3.184,3.184,0,0,0-3.462,3.461,3.3,3.3,0,0,0,3.433,3.489,5.472,5.472,0,0,0,2.789-.669l.42,1.423a6.351,6.351,0,0,1-3.461.894,4.811,4.811,0,0,1-5.136-5.053,5.179,5.179,0,0,1,5.417-5.192,5.3,5.3,0,0,1,3.067.781Z'
                          transform='translate(2598.649 -831.811)'
                          fill='#fff'
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </g>
              <g id='Group_11' data-name='Group 11'>
                <path
                  id='Path_11'
                  data-name='Path 11'
                  d='M-4230.7,812.812l-69.557-40.158a13.54,13.54,0,0,0-13.54,0l-69.557,40.158a13.541,13.541,0,0,0-6.769,11.727v80.317a13.541,13.541,0,0,0,6.769,11.726l69.557,40.158a13.536,13.536,0,0,0,13.54,0l69.557-40.158a13.537,13.537,0,0,0,6.769-11.726V824.538A13.537,13.537,0,0,0-4230.7,812.812Zm-28.024,100.136a17.377,17.377,0,0,1-17.38-17.376v-30.63q0-15.118-8.54-24.494t-22.187-9.375q-13.544,0-22.237,9.278t-8.686,23.9q0,14.925,8.935,24.445t22.774,9.524a35.53,35.53,0,0,0,12.223-2.16,46.135,46.135,0,0,0,11.928-6.676v7.45a16.455,16.455,0,0,1-12.288,16.029l-.134.033a56.687,56.687,0,0,1-13.69,1.62,45.64,45.64,0,0,1-13.647-2.111,44.51,44.51,0,0,1-12.27-5.938,48.184,48.184,0,0,1-15.906-17.918,51.725,51.725,0,0,1-5.5-23.906q0-21.6,13.642-35.685t34.658-14.087a47.88,47.88,0,0,1,25.325,6.97,46.637,46.637,0,0,1,17.676,19.144,43.57,43.57,0,0,1,4.073,12.025q1.222,6.53,1.227,19.487Z'
                  transform='translate(4390.126 -770.839)'
                  fill='#ffbc00'
                />
                <path
                  id='Path_12'
                  data-name='Path 12'
                  d='M-4222.156,1042.229a.637.637,0,0,0-.595-1.126c-24.448,11.836-66.394,24.348-76.422,24.348-10.316,0-47.962-11.938-69.773-22.207a.556.556,0,0,0-.515.984l63.106,37.261a16.257,16.257,0,0,0,16.254,0Z'
                  transform='translate(4380.689 -895.951)'
                  fill='#f39c12'
                />
              </g>
            </svg>
            {/* <h2 className='brand-text ml-1'>amana</h2> */}
          </Col>

          {/* <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
            <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
              <img className='img-fluid' src={source} alt='Login V2' />
            </div>
          </Col> */}
        </Col>
      </Row>
    </div>
  );
};

export default LoginV2;
