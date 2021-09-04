import { useContext, useState, useEffect } from 'react';
import { List, Plus, ChevronDown, ChevronUp, Trash2, User, CornerUpLeft } from 'react-feather';
import CardAction from '@components/card-actions';

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
import TableWithButtons from '../tables/data-tables/basic/TableWithButtons';
import NumberInput from '@components/number-input';
import { EditorState } from 'draft-js';

// ** Table Data & Columns
import { Columns, ColumnsTrash } from '../tables/data-tables/messagesData';
import '@styles/react/libs/charts/apex-charts.scss';
import { Link } from 'react-router-dom';
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

  const [costomer, setCostomer] = useState([]);
  const [order, setOrder] = useState([]);
  const [reply, setReply] = useState(null);

  useEffect(() => {
    if (params.id) {
      axios
        .get(`https://amanacart.com/api/admin/support/message/${params.id}`, auth)
        .then((response) => {
          try {
            console.log(response.data);
            setdata(response.data);
            setCostomer(response.data.customer);
            setOrder(response.data.order);

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

  const hundelResponse = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('reply', reply);

    axios
      .post(`https://amanacart.com/api/admin/support/message/${params.id}/storeReply`, formData, auth)
      .then((response) => {
        console.log(response);
        handleSuccess('تمت العملية بنجاح');
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
    <div id='dashboard-analytics'>
      <Row className='match-height mt-5'>
        <Col lg='2' md='4' sm='12'>
          <Nav pills vertical>
            <a href='/supportDisk/messages'>
              <NavItem>
                <NavLink
                  active={activeNav === '1'}
                  onClick={() => {
                    toggle('1', 1);
                  }}
                >
                  صندوق الوارد
                </NavLink>
              </NavItem>
            </a>

            <NavItem>
              <a href='/supportDisk/messages'>
                <NavLink
                  active={activeNav === '2'}
                  onClick={() => {
                    toggle('2', 2);
                  }}
                >
                  المرسلة
                </NavLink>
              </a>
            </NavItem>
            <NavItem>
              <a href='/supportDisk/messages'>
                <NavLink
                  active={activeNav === '3'}
                  onClick={() => {
                    toggle('3', 3);
                  }}
                >
                  مسودة
                </NavLink>
              </a>
            </NavItem>
            <NavItem>
              <a href='/supportDisk/messages'>
                <NavLink
                  active={activeNav === '4'}
                  onClick={() => {
                    toggle('4', 4);
                  }}
                >
                  البريد المزعج
                </NavLink>
              </a>
            </NavItem>
            <NavItem>
              <a href='/supportDisk/messages'>
                <NavLink
                  active={activeNav === '5'}
                  onClick={() => {
                    toggle('5', 5);
                  }}
                >
                  سلة المهملات
                </NavLink>
              </a>
            </NavItem>
          </Nav>
        </Col>
        <Col lg='10' md='12' sm='12' className=''>
          <CardAction title='MESSAGE' actions='collapse' style={{ padding: '1rem !important' }}>
            <Col lg='8' style={{ minWidth: '100%', padding: '0px' }}>
              <Col lg='12'>
                <div className='d-flex'>
                  <User size={30} style={{ border: '1px solid', borderRadius: '20px', marginRight: '40px' }} />
                  <div className=''>
                    <h5>{data.subject ? data.subject : ''}</h5>

                    <p style={{ marginBottom: '0rem' ,display:"flex",justifyContent:"space-between",flexDirection:"row-reverse"}} dir="ltr">
                    :من {'   '}
                      <span style={{marginRight:"3px"}}>
                        {costomer.nice_name ? costomer.nice_name : ''} {'<'}
                        {costomer.email ? costomer.email : ''}
                        {'>'}
                      </span>
                    </p>
                    <p>رقم الطلب:{order ? order.order_number : ''}</p>
                  </div>
                </div>
              </Col>
              <hr />
              <Col lg='12'>
                <p>{data.message}</p>
              </Col>
              <Col>
                <Button color='primary' type='submit' onClick={() => setBasicModal(!basicModal)} style={{ marginTop: '15px', marginBottom: '15px' }}>
                  إرسال رد
                  <CornerUpLeft size={14} style={{ marginRight: '8px' }} />
                </Button>
              </Col>
            </Col>
          </CardAction>
        </Col>
        <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className=''>
          <ModalHeader toggle={() => setBasicModal(!basicModal)}>FORM</ModalHeader>
          <ModalBody>
            <Row>
              <Col className='mb-1' lg='12' md='12' xs='12'>
                <Label for='amount'>ارسال رد *</Label>
                <Input value={costomer.email} readOnly />
              </Col>

              <Col className='mb-1' lg='12' md='12' xs='12'>
                <Label for='reply'>رسسالة*</Label>
                <Input type='textarea' name='reply' id='reply' placeholder='Enter Reply' onChange={(e) => setReply(e.target.value)} />
              </Col>

              <Col className='mb-1 d-flex justify-content-end' xs='12'>
                <Button color='primary' type='submit' onClick={hundelResponse}>
                  ارسال رد
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </Row>
    </div>
  );
};

export default Catalog;
