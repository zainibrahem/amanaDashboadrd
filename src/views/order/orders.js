import { useContext, useState, useEffect } from 'react';
import { List, Plus, ChevronDown, ChevronUp, Trash2, Home, Settings, EyeOff, User, Search } from 'react-feather';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  CustomInput,
  FormGroup,
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
import './style.css';
import AsyncSelect from 'react-select/async';
import { Link } from 'react-router-dom';
// ** Table Data & Columns
import { Columns, ColumnsTrash } from '../tables/data-tables/orderData';
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
  const [activeTap, setActiveTap] = useState('1');

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
  const [data, setdata] = useState([]);
  const [unpaid, setUnpaid] = useState([]);
  const [unfullfilled, setUnfullfilled] = useState([]);

  useEffect(() => {
    axios.get('https://amanacart.com/api/admin/order/order', auth).then((response) => {
      setdata(response.data.orders.all);
      setUnpaid(response.data.orders.unpaid);
      setUnfullfilled(response.data.orders.unfulfilled);
      setTrashData(response.data.trashes);
    });
  }, []);
  const [dataSelect, setdataSelect] = useState([]);

  const [visibleImageError, setVisibleImageError] = useState('');
  const [value, setValue] = useState(EditorState.createEmpty());

  const [visible, setVisible] = useState('');

  //init input value
  const [image, setImage] = useState('');

  const [name, setName] = useState(null);
  const [contact_person, setContactPerson] = useState(null);

  const [email, setEmail] = useState(null);
  const [active, setActive] = useState('1');
  const [description, setDescription] = useState(null);

  // alert success
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

  //alert error
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
  //handle empty trash
  const handleTrash = () => {
    if (trashData.length > 0) {
      axios
        .delete('https://amanacart.com/api/admin/order/order/emptyTrash', auth)
        .then((response) => {
          console.log(response);
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
        });
    }
  };
  const toggle = (tab) => {
    if (activeTap !== tab) {
      setActiveTap(tab);
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

    formData.append('name', name);
    formData.append('description', value.getCurrentContent().getPlainText());
    formData.append('email', email);

    formData.append('active', active);
    formData.append('contact_person', contact_person);

    // formData.append('_method', 'PUT');
    axios
      .post(`https://amanacart.com/api/admin/stock/supplier`, formData, auth)
      .then((response) => {
        console.log(response);
        window.location.reload();
        handleSuccess('ADD SUCCESS');

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
  const handleFileSelected = (e) => {
    setImage(e.target.files[0]);
  };
  const handleFileSelectedCover = (e) => {
    setCover_image(e.target.files[0]);
  };
  const [searchResult, setSearchResult] = useState([]);
  const [selected, setSelected] = useState(null);
  const hundelSearch = (e) => {
    // if (e.target.value.length >= 3) {
    console.log(e);
    axios
      .get(`https://amanacart.com/api/admin/search/customer?q=${e}`, auth)
      .then((response) => {
        console.log(response.data);
        setSearchResult(response.data);
        // setInactive_listings_data(response.data.inventories.inactive_listings);
        // setOut_of_stock_data(response.data.inventories.out_of_stock);
        // console.log(response.data);
        // setTrashData(response.data.trashes);
      })
      .catch((error) => {
        // console.log(error);
        if (error.response) {
          console.log(error.response.status);
          if (error.response.status === 500) {
            handleErrorNetwork(`${error.response.status} internal server error`);
            console.log(error.response.status);
          } else if (error.response.status === 404) {
            handleErrorNetwork(`${error.response.status} no product found`);
          } else {
            handleError(error.response.data.error);
          }
        } else {
          handleErrorNetwork(`${error}`);
        }
      });
    // else {
    //   setSearchResult([]);
    // }
  };
  console.log(searchResult);
  const colorOptions = [
    // { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
  ];
  searchResult && Object.keys(searchResult || {}).length > 0
    ? Object.keys(searchResult || {}).map((e) => colorOptions.push({ value: `${searchResult[e].id}`, label: `${searchResult[e].text}`, isFixed: true }))
    : '';

  const filterColors2 = (inputValue) => {
    return colorOptions.filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()));
  };
  const promiseOptions = (inputValue,callBack) => {
    
    if(!inputValue){
      callBack([]);
    }
    else{
      setTimeout(()=>{
        axios
        .get(`https://amanacart.com/api/admin/search/customer?q=${inputValue}`, auth)
        .then((response) => {
          const tempArray = [];
          response.data.forEach(element => {
            tempArray.push({label : `${element.text}`,value : element.id})
          });
          callBack(tempArray)
          setSearchResult(response.data);
        })
        .catch((error) => {
          // console.log(error);
          if (error.response) {
            console.log(error.response.status);
            if (error.response.status === 500) {
              handleErrorNetwork(`${error.response.status} internal server error`);
              console.log(error.response.status);
            } else if (error.response.status === 404) {
              handleErrorNetwork(`${error.response.status} no product found`);
            } else {
              handleError(error.response.data.error);
            }
          } else {
            handleErrorNetwork(`${error}`);
          }
        });
      })
    }
  
  };
  // console.log(selected);

  return (
    <div id='dashboard-analytics'>
      <Row className='match-height mt-5'>
        <Col md='12' xs='12'>
          <Card className='m-0'>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
              <CardTitle tag='h4'> الطلبات</CardTitle>
              <Button className='ml-2' color='primary' onClick={() => setBasicModal(!basicModal)}>
                <Plus size={15} />
                انشاء طلب
              </Button>
            </CardHeader>
          </Card>
        </Col>
      </Row>
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
                    جميع الطلبات
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
                    <span className='align-middle'>غير مدفوع</span>
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
                    <span className='align-middle'>غير مكتمل</span>
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
                      <span className='align-middle ml-50'>حذف سلة المهملات</span>
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </Col>
            <Col>
              <TableWithButtons columns={ColumnsTrash} data={trashData} />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId='2'>
          <Row className='match-height'>
            <Col>
              <TableWithButtons columns={Columns} data={unpaid} />
            </Col>
          </Row>
          <Row className='match-height'>
            <Col md='12' xs='12'>
              <Card className='m-0'>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                  <CardTitle tag='h4'>سلة المهملات</CardTitle>
                  <div>
                    <Button className='ml-2' color='primary'>
                      <Trash2 size={15} />
                      حذف سلة المهملات
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </Col>
            <Col>
              <TableWithButtons columns={ColumnsTrash} data={trashData} />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId='3'>
          <Row className='match-height'>
            <Col>
              <TableWithButtons columns={Columns} data={unfullfilled} />
            </Col>
          </Row>
          <Row className='match-height'>
            <Col md='12' xs='12'>
              <Card className='m-0'>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                  <CardTitle tag='h4'>سلة المهملات</CardTitle>
                  <div>
                    <Button className='ml-2' color='primary'>
                      <Trash2 size={15} />
                      <span className='align-middle ml-50'></span>حذف سلة المهملات
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </Col>
            <Col>
              <TableWithButtons columns={ColumnsTrash} data={trashData} />
            </Col>
          </Row>
        </TabPane>
      </TabContent>
      <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className=''>
        <ModalHeader toggle={() => setBasicModal(!basicModal)}> بحث</ModalHeader>
        <ModalBody>
          <Row>
            <Col className='mb-1' lg='12' md='12' xs='12'>
              <AsyncSelect
                onInputChange={(e) => {
                  hundelSearch(e);
                }}
                onChange={(e) => setSelected(e)}
                isClearable={false}
                className='react-select'
                classNamePrefix='select'
                loadOptions={promiseOptions}
                cacheOptions
                defaultOptions
              />
            </Col>

            <Col className='mb-1 d-flex justify-content-end' xs='12'>
              <Link
                to={{
                  pathname: `/order/order/${selected ? selected.value : ''}`,
                }}
              >
                <Button color='primary' type='submit'>
                  معالجة الطلب
                </Button>
              </Link>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Catalog;
