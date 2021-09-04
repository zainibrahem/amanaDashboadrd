import { useContext, useState, useEffect } from 'react';
import { List, Plus, ChevronDown, ChevronUp, Trash2, Search } from 'react-feather';
import Select from 'react-select';
import { selectThemeColors } from '@utils';
import './style.css';
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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
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

  const [activeNav, setActiveNav] = useState(localStorage.getItem('id'));

  const [customer_id, setCustomer_id] = useState(null);
  const [subject, setSubject] = useState(null);

  const [message, setMessage] = useState(null);
  const [image, setImage] = useState('');
  const [visibleImageError, setVisibleImageError] = useState('');

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
  useEffect(() => {
    if (localStorage.getItem('id')) {
      axios
        .get(`https://amanacart.com/api/admin/support/message/labelOf/${localStorage.getItem('id')}`, auth)
        .then((response) => {
          try {
            setdata(response.data.data);
          } catch (e) {
            console.log(response, e);
          }
          // return response;
        })
        .catch((error) => {
          console.log(error);
          handleError(` ${error}`);
        });
    }
  }, []);
  const Columns = [
    {
      selector: 'name',
      sortable: true,
      maxWidth: '5%',
      minWidth: '140px',
      cell: (row) => {
        return (
          <Link to={{ pathname: `/support/message/${row.id}`, id: row.id }} style={{ cursor: 'pointer' }}>
            <Badge color='secondary'>{row.customer.name}</Badge>
          </Link>
        );
      },
    },

    {
      selector: 'subject',
      sortable: true,
      maxWidth: '15%',
      minWidth: '91px',
    },
    {
      selector: 'message',
      sortable: true,
      minWidth: '250px',
      cell: (row) => {
        return (
          
            <Link to={{ pathname: `/support/message/${row.id}`, id: row.id }} style={{ cursor: 'pointer' , maxWidth:"100%"  }}>
              <Badge style={{maxWidth:"100%",paddingLeft:"30px",color:"black",overflow:"hidden"}} color='transparent' text="black">{row.message}</Badge>
            </Link>
          
        );
      },
    },
    {
      selector: 'order_number',
      sortable: true,
      maxWidth: '5%',
      minWidth: '181px',
      cell: (row) => {
        return (
          <Badge color='secondary' className='number'>
            #213123
          </Badge>
        );
      },
    },
    {
      selector: 'replies_count',
      sortable: true,
      maxWidth: '5%',
      minWidth: '137px',
      cell: (row) => {
        return (
          <Badge color='secondary' className='number'>
            {row.replies_count}
          </Badge>
        );
      },
    },
    {
      selector: 'replies_count',
      sortable: true,
      maxWidth: '5%',
      minWidth: '141px',
      cell: (row) => {
        return (
          <Badge color='secondary' className='number'>
            {row.created_at}
          </Badge>
        );
      },
    },
  ];

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
  const [customer, setCustomer] = useState([]);
  const [result, setResult] = useState([]);

  const hundelSearchCustomer = (e) => {
    if (e.target.value.length >= 3) {
      axios
        .get(`https://amanacart.com/api/admin/search/customer?q=${e.target.value}`, auth)
        .then((response) => {
          try {
            console.log(response.data);
            setCustomer(response.data);
            setResult(response.data);
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
              handleErrorNetwork(`${error.response.status} please search and select a customer`);
            } else {
              handleError(error.response.data.error);
            }
          } else {
            handleErrorNetwork(`${error}`);
          }
        });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (image === '') {
      setVisibleImageError(true);
    } else {
      setVisibleImageError(false);
      // Update the formData object
      formData.append('image', image);
    }
    formData.append('customer_id', customer_id);
    formData.append('subject', subject);
    formData.append('message', message);
    // formData.append('_method', 'PUT');

    axios
      .post('https://amanacart.com/api/admin/support/message', formData, auth)
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
            handleErrorNetwork(`${error.response.status} please search and select a customer`);
          } else {
            handleError(error.response.data.error);
          }
        } else {
          handleErrorNetwork(`${error}`);
        }
      });
  };
  console.log(result);

  return (
    <div id='dashboard-analytics'>
      <Row className='match-height mt-5'>
        <Col lg='3' md='4' sm='12'>
          <Button color='primary' type='submit' style={{ padding: '15px', marginBottom: '15px' }} onClick={() => setBasicModal(!basicModal)}>
            انشاء رسالة جديدة
          </Button>

          <Nav pills vertical style={{ boxShadow: '0 4px 24px 0 rgb(34 41 47 / 10%)' }}>
            <NavItem>
              <NavLink
                active={activeNav === '1'}
                onClick={() => {
                  toggle('1', 1);
                }}
              >
                الصندوق الوارد
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                active={activeNav === '2'}
                onClick={() => {
                  toggle('2', 2);
                }}
              >
                المرسلة
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeNav === '3'}
                onClick={() => {
                  toggle('3', 3);
                }}
              >
                مسودة
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeNav === '4'}
                onClick={() => {
                  toggle('4', 4);
                }}
              >
                البريد المزعج
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeNav === '5'}
                onClick={() => {
                  toggle('5', 5);
                }}
              >
                سلة المهملات
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
        <Col lg='9' md='8' sm='12'>
          <TabContent activeTab={activeNav}>
            <TabPane tabId={tabId}>
              <TableWithButtons columns={Columns} data={data} />
            </TabPane>
          </TabContent>
        </Col>
        <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-dialog-top modal-lg'>
          <ModalHeader toggle={() => setBasicModal(!basicModal)}>شكل</ModalHeader>
          <ModalBody>
            <Row>
              <Col className='mb-1' lg='12' md='12' sm='12'>
                <InputGroup className='mb-2'>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      <Search size={14} />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder='Search a customer by its name,nic name or email' name='search' onChange={(e) => hundelSearchCustomer(e)} />
                </InputGroup>
                <Input type='select' name='customer_id' id='customer_id' onChange={(e) => setCustomer_id(e.target.value)}>
                  <option>تحديد زبون</option>
                  {result && result.length > 0 ? (
                    result.map((e) => {
                      return <option value={e.id}>{e.text}</option>;
                    })
                  ) : (
                    <option>لم يتم العثور على بيانات ، يجب ألا يقل البحث عن 3 أحرف. ، إعادة البحث</option>
                  )}
                </Input>
              </Col>

              <Col className='mb-1' lg='12' md='12' xs='12'>
                <Label for='subject'>موضوعات*</Label>
                <Input type='text' name='subject' id='subject' onChange={(e) => setSubject(e.target.value)} />
              </Col>

              <Col className='mb-1' lg='12' md='12' xs='12'>
                <Label for='message'>الوصف*</Label>
                <Input type='text' name='message' id='message' onChange={(e) => setMessage(e.target.value)} />
              </Col>

              <Col lg='12' md='12' sm='12'>
                <FormGroup>
                  <CustomInput type='file' onChange={(e) => handleFileSelected(e)} id='image' name='image' placeholder='Upload attachment' />
                </FormGroup>
              </Col>
              <Col className='mb-1 d-flex justify-content-end' xs='12'>
                <Button color='primary' type='submit' onClick={handleSubmit}>
                  حفظ
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>

        {/* <Col md='9' sm='12'>
       
        </Col> */}
        {/* <Col md='12' xs='12'>
          <Card className='m-0'>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
              <CardTitle tag='h4'>COUPONS</CardTitle>
              <Button className='ml-2' color='primary' onClick={() => setBasicModal(!basicModal)}>
                <Plus size={15} />
                <span className='align-middle ml-50'>ADD COUPON </span>
              </Button>
            </CardHeader>
          </Card>
        </Col>
        <Col>
          <TableWithButtons columns={Columns} data={data} />
        </Col> */}
      </Row>
    </div>
  );
};

export default Catalog;
