import { Fragment, useState, useContext, useEffect } from 'react';
import { isObjEmpty } from '@utils';
import classnames from 'classnames';
import { useSkin } from '@hooks/useSkin';
import useJwt from '@src/auth/jwt/useJwt';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { handleLogin } from '@store/actions/auth';
import { Link, useHistory } from 'react-router-dom';
import { AbilityContext } from '@src/utility/context/Can';
import InputPasswordToggle from '@components/input-password-toggle';
import { Facebook, Twitter, Mail, GitHub } from 'react-feather';
import { Row, Col, CardTitle, CardText, FormGroup, Label, Button, Form, Input, CustomInput } from 'reactstrap';
import './style.css';
import '@styles/base/pages/page-auth.scss';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'axios';
const Register = () => {
  const MySwal = withReactContent(Swal);

  const ability = useContext(AbilityContext);

  const [skin, setSkin] = useSkin();

  const history = useHistory();

  const dispatch = useDispatch();

  const { register, errors, handleSubmit, trigger } = useForm();

  const [email, setEmail] = useState('');
  const [valErrors, setValErrors] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPassword_confirmation] = useState('');
  const [plans, setPlans] = useState(null);

  const [terms, setTerms] = useState(false);
  const [plan, setPlan] = useState('');
  const [shop_name, setShop_name] = useState('');
  const [agree, setAgree] = useState(1);

  const hudelCheckTeam = (e) => {
    if (!e.target.checked) {
      setAgree(1);
      console.log(agree);
    } else {
      setAgree(0);
      console.log(agree);
    }
  };

  useEffect(() => {
    axios
      .get('https://amanacart.com/api/admin/auth/register')
      .then((response) => {
        console.log(response.data);
        setPlans(response.data.plans);
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

  const illustration = skin === 'dark' ? 'register-v2-dark.svg' : 'register-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default;

  const Terms = () => {
    return <Fragment>أوافق على سياسة الخصوصية وشروطها</Fragment>;
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
  const onSubmit = () => {
    if (isObjEmpty(errors)) {
      useJwt
        .register({ plan, email, password, password_confirmation, shop_name, agree })
        .then((res) => {
          if (res.data.error) {
            const arr = {};
            // for (const property in res.data.error) {
            //   if (res.data.error[property] !== null) arr[property] = res.data.error[property];
            // }
            setValErrors(arr);
            if (res.data.error.email !== null) console.error(res.data.error.email);
            if (res.data.error.username !== null) console.error(res.data.error.username);
          } else {
            setValErrors({});
            // const data = { ...res.data.user, accessToken: res.data.accessToken };
            // ability.update(res.data.user.ability);
            // dispatch(handleLogin(data));
            history.push('/login');
          }
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
      // .catch((err) => console.log(err.response.data.error));
    }
  };

  const handleUsernameChange = (e) => {
    const errs = valErrors;
    if (errs.username) delete errs.username;
    setUsername(e.target.value);
    setValErrors(errs);
  };

  const handleEmailChange = (e) => {
    const errs = valErrors;
    if (errs.email) delete errs.email;
    setEmail(e.target.value);
    setValErrors(errs);
  };

  return (
    <div className='auth-wrapper auth-v2'>
      <Row className='auth-inner m-0' style={{ direction: 'ltr' }}>
        <Link className='brand-logo' to='/' onClick={(e) => e.preventDefault()}>
          <svg className='' style={{ position: 'relative', top: '-91px' }} xmlns='http://www.w3.org/2000/svg' width='180.261' height='43' viewBox='0 0 180.261 43'>
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
          {/* <h2 className='brand-text text-primary ml-1'>Vuexy</h2> */}
        </Link>
        <Col className='back d-none d-lg-flex '>
          <div className='opacity'> </div>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative', left: '500px' }}>
            <Col style={{ textAlign: 'end' }}>
              <CardTitle tag='h1' className='font-weight-bold mb-1' className='b_show'>
                مرحبا بكم في أمانة
              </CardTitle>
              <CardTitle tag='h3' className='font-weight-bold mb-1' className='b_show'>
                قسم البائع
              </CardTitle>
            </Col>
          </div>

          <Col className='' to='/' onClick={(e) => e.preventDefault()}>
            {/* <h2 className='brand-text ml-1'>amana</h2> */}
          </Col>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12' style={{ textAlign: '-webkit-auto', direction: 'rtl' }}>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <Form action='/' className='auth-register-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Input type='select' Change={(e) => setPlan(e.target.value)} name='plan'>
                  {plans && Object.keys(plans || {}).length > 0
                    ? Object.keys(plans || {}).map((e) => {
                        return <option value={e}>{plans[e]}</option>;
                      })
                    : ''}
                </Input>
              </FormGroup>
              <FormGroup>
                <Input
                  type='email'
                  value={email}
                  id='register-email'
                  name='register-email'
                  onChange={handleEmailChange}
                  placeholder='البريد الالكتروني'
                  className={classnames({ 'is-invalid': errors['register-email'] })}
                  innerRef={register({ required: true, validate: (value) => value !== '' })}
                />
                {Object.keys(valErrors).length && valErrors.email ? <small className='text-danger'>{valErrors.email}</small> : null}
              </FormGroup>
              <FormGroup className="sssss">
                <InputPasswordToggle
                  placeholder='كلمة السر'
                  id='register-password'
                  name='register-password'
                  className='input-group-merge'
                  onChange={(e) => setPassword(e.target.value)}
                  className={classnames({ 'is-invalid': errors['register-password'] })}
                  innerRef={register({ required: true, validate: (value) => value !== '' })}
                />
              </FormGroup>
              <FormGroup className="sssss">
                <InputPasswordToggle
                  placeholder='تاكيد كلمة السر'
                  id='password_confirmation'
                  name='password_confirmation'
                  className='input-group-merge'
                  onChange={(e) => setPassword_confirmation(e.target.value)}
                  className={classnames({ 'is-invalid': errors['register-password'] })}
                  innerRef={register({ required: true, validate: (value) => value !== '' && value === password })}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type='text'
                  id='shop_name'
                  name='shop_name'
                  onChange={(e) => setShop_name(e.target.value)}
                  placeholder='اسم المحل التجاري'
                  className={classnames({ 'is-invalid': errors['register-email'] })}
                  innerRef={register({ required: true, validate: (value) => value !== '' })}
                />
              </FormGroup>
              <FormGroup>
                <CustomInput
                  type='checkbox'
                  id='terms'
                  name='terms'
                  value='terms'
                  label={<Terms />}
                  className='custom-control-Primary'
                  innerRef={register({ required: true })}
                  onChange={(e) => hudelCheckTeam(e)}
                  // onChange={(e) => setTerms(e.target.checked)}
                  invalid={errors.terms && true}
                />
              </FormGroup>
              <Button.Ripple type='submit' block color='primary'>
                انشاء حساب
              </Button.Ripple>
            </Form>
            <p className='text-center mt-2'>
              <span className='mr-25'>هل تمتلك حساب؟</span>
              <Link to='/login'>
                <span>تسجيل الدخول بدلا من ذلك</span>
              </Link>
            </p>
            {/* <div className='divider my-2'>
              <div className='divider-text'>or</div>
            </div> */}
            {/* <div className='auth-footer-btn d-flex justify-content-center'>
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
      </Row>
    </div>
  );
};

export default Register;
