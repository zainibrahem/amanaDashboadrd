import { useContext, useState, useEffect } from 'react';
import { List, Plus, ChevronDown, ChevronUp, Trash2, User, CornerUpLeft } from 'react-feather';
import CardAction from '@components/card-actions';
import { useHistory, Link } from 'react-router-dom';
import {
  CustomInput,
  FormGroup,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Badge,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

// ** Table Data & Columns
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

  const {
    match: { params },
  } = props;
  //init alert
  const MySwal = withReactContent(Swal);
  const history = useHistory();

  // init headers auth
  const config = useJwt.jwtConfig;
  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };

  const [activeNav, setActiveNav] = useState(localStorage.getItem('id'));
  const toggle = (tab, id) => {
    localStorage.setItem('id', id);

    setActiveNav(localStorage.getItem('id'));
    window.location.reload();
  };
  const [data, setdata] = useState([]);
  let tabId = localStorage.getItem('id');

  const handleFooterAlert = () => {
    return MySwal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
      footer: '<a href="javascript:void(0);">Why do I have this issue?</a>',
      customClass: {
        confirmButton: 'btn btn-primary',
      },
      buttonsStyling: false,
    });
  };

  const [replies, setReplies] = useState([]);
  const [reply, setReply] = useState(null);
  const [image, setImage] = useState('');

  const handleFileSelected = (e) => {
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    if (params.id) {
      axios
        .get(`https://amanacart.com/api/admin/ticket/${params.id}`, auth)
        .then((response) => {
          try {
            console.log(response.data);
            setdata(response.data);
            setReplies(response.data.replies);

            console.log(data);
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

  //alert error
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

  const hundelDelete = (e) => {
    e.preventDefault();
    axios
      .delete(`https://amanacart.com/api/admin/ticket/${params.id}/archive`, auth)
      .then((response) => {
        console.log(response);
        handleSuccess('ADD SUCCESS');
        history.push('/tickets');
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

  const hundelResponse = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('reply', reply);
    formData.append('attachments', image);

    axios
      .post(`https://amanacart.com/api/admin/ticket/${params.id}/storeReply`, formData, auth)
      .then((response) => {
        console.log(response);
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
  };

  return (
    <Row className=' mt-5'>
      <Col>
        {/* <CardHeader>تذكرة</CardHeader> */}

        <Card style={{ padding: '15px' }}>
          <Row>
            <Col lg='3' md='3' sm='12' xs='12'>
              <h6>الفئة</h6>
              <p>{data.category ? data.category : ''}</p>
              <h6>PRIORITY</h6>
              <p>{data.priority ? data.priority : ''}</p>
              <h6>الحالة</h6>
              <p>{data.status ? data.status : ''}</p>
            </Col>
            <Col lg='6'>
              <h5>{data.name ? data.name : ''}</h5>
              <p style={{ marginTop: '35px', border: '1px solid #e4e4e4', padding: '10px', backgroundColor: '#e4e4e4', borderRadius: '5px' }}>{data.message ? data.message : ''}</p>
              <h6>المحادثات</h6>
              {data && replies.length > 0
                ? replies.map((e) => {
                    return (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'start' }}>
                          <div className='d-flex ml-10'>
                            <img src={e.user_image ? e.user_image : ''} alt='not loaded' height='50' style={{ borderRadius: '27px' }} />
                            <span style={{ fontSize: '9pt', whiteSpace: 'nowrap', marginTop: '20px' }}>{e.user_name ? e.user_name : ''}</span>
                          </div>
                          <div style={{ margin: '0px 10px' }}>
                            <p>{e.reply ? e.reply : ''}</p>
                            <h6>{e.updated_at ? e.updated_at : ''}</h6>
                          </div>
                        </div>
                      </>
                    );
                  })
                : 'لا يوجد رد'}
              <div style={{ marginTop: '20px' }}>
                <Button color='primary' style={{ margin: '0px 0px 0px 5px' }} onClick={(e) => setBasicModal(!basicModal)}>
                  اضافة رد
                </Button>
                <Button color='danger' onClick={(e) => setBasicModals(!basicModals)}>
                  حذف
                </Button>
              </div>
            </Col>
            <Col lg='3' md='3' sm='12' xs='12'>
              <h6>تم الانشاء </h6>
              <p>{data.created_at ? data.created_at : ''}</p>
              <h6> اخر تحديث </h6>
              <p>{data.updated_at ? data.updated_at : ''}</p>
            </Col>
          </Row>
        </Card>
      </Col>

      <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className=''>
        <ModalHeader toggle={() => setBasicModal(!basicModal)}>شكل</ModalHeader>
        <ModalBody>
          <Row>
            <Col className='mb-1' lg='12' md='12' xs='12'>
              <Label for='reply'>رسسالة*</Label>
              <Input type='text' name='reply' id='reply' placeholder='Enter Reply' onChange={(e) => setReply(e.target.value)} />
            </Col>
            <Col>
              <FormGroup>
                <CustomInput type='file' onChange={(e) => handleFileSelected(e)} id='image' name='image' />
              </FormGroup>
            </Col>

            <Col className='mb-1 d-flex justify-content-end' xs='12'>
              <Button color='primary' type='submit' onClick={hundelResponse}>
                ارسال رد
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <Modal isOpen={basicModals} className=''>
        <ModalHeader toggle={() => setBasicModals(!basicModals)}>شكل</ModalHeader>
        <ModalBody>
          <Row>
            <Col className='mb-1' lg='12' md='12' xs='12'>
              <p>هل انت متاكد من فعل ذلك ؟</p>
            </Col>

            <Col className='mb-1 d-flex justify-content-end' xs='12'>
              <Button color='danger' type='submit' onClick={(e) => hundelDelete(e)} style={{ margin: '0 10px 0px 10px' }}>
                حذف
              </Button>
              <Button color='primary' type='submit' onClick={() => setBasicModals(!basicModals)}>
                تراجع
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Row>
  );
};
export default Catalog;
