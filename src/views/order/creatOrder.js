import { useContext, useState, useEffect } from 'react';
import { List, Plus, ChevronDown, ChevronUp, Trash2, Home, Settings, EyeOff, User, Search, Edit } from 'react-feather';
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
  CutomInput,
} from 'reactstrap';
import { selectThemeColors } from '@utils';
import Select, { components } from 'react-select';

import { Link, useHistory } from 'react-router-dom';
import TableWithButtons from '../tables/data-tables/basic/TableWithButtons';
import NumberInput from '@components/number-input';
import { EditorState } from 'draft-js';
import './style.css';
import AsyncSelect from 'react-select/async';

// ** Table Data & Columns
import { Columns } from '../tables/data-tables/cartList';
import '@styles/react/libs/charts/apex-charts.scss';

//api
import axios from 'axios';

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';
import Total from './total';
//alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation-safe';
import CardBody from 'reactstrap/lib/CardBody';

const Catalog = (props) => {
  const [basicModal, setBasicModal] = useState(false);
  const [basicModals, setBasicModals] = useState(false);
  const [basicModalsAd, setBasicModalsAd] = useState(false);

  const [status, setStatus] = useState({ status: [] });
  const [trashData, setTrashData] = useState([]);
  const [activeTap, setActiveTap] = useState('1');
  const history = useHistory();
  /**shipping address */
  const [shipping_id, setShipping_id] = useState(null);
  const [billing_id, setBilling_id] = useState(null);
  const [address_title, setAddress_title] = useState(null);

  const [address_line_1, setAddress_line_1] = useState(null);
  const [address_line_2, setAddress_line_2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip_code, setZip_code] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [countries, setContries] = useState([]);
  const [address_type, setAddress_type] = useState(null);

  const [address_types, setAddress_types] = useState(null);

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
  const [data, setData] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [cartList, setCartList] = useState([]);
  const [payment_statuses, setPayment_statuses] = useState(null);
  const [payment_methods, setPayment_methods] = useState(null);
  const [products, setProducts] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [shipping_address, setShipping_address] = useState(null);
  const [billing_address, setBilling_address] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [price_total, setPrice_total] = useState(null);

  useEffect(() => {
    axios.get(`https://amanacart.com/api/admin/order/order/create?customer_id=${params.id}`, auth).then((response) => {
      setCustomer(response.data.data.customer);
      setCartList(response.data.data.cart_lists);
      setPayment_statuses(response.data.data.payment_statuses);
      setPayment_methods(response.data.data.payment_methods);
      // setProducts(response.data.data.products);
      setInventories(response.data.data.inventories);
      setShipping_address(response.data.data.primary_address);
      setBilling_address(response.data.data.billing_address);
      setShipping_id(response.data.data.primary_address ? response.data.data.primary_address.id : '');
      setBilling_id(response.data.data.billing_address ? response.data.data.billing_address.id : '');
      setData(response.data.data.cart_lists);
      const array = [];
      response.data.data.products
        ? Object.keys(response.data.data.products || {}).map((ele) => {
            array.push({ value: ele, label: response.data.data.products[ele] });
          })
        : '';
      setProducts(array);

      //   if (shipping_address) {
      //     setShipping_id(shipping_address.id);
      //     console.log(shipping_address.id);
      //   }
      //   if (billing_address) {
      //     setBilling_id(billing_address.id);
      //     console.log(billing_address.id);

      //   }
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
  const submitOrder = () => {
    console.log('asdasd')
  }
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

  const handleFileSelected = (e) => {
    setImage(e.target.files[0]);
  };
  const handleFileSelectedCover = (e) => {
    setCover_image(e.target.files[0]);
  };
  const [searchResult, setSearchResult] = useState([]);
  const [selected, setSelected] = useState(null);
  const hundelSearch = (e) => {
    console.log(e);
    axios
      .get(`https://amanacart.com/api/admin/search/customer?q=${e}`, auth)
      .then((response) => {
        console.log(response.data);
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
    // else {
    //   setSearchResult([]);
    // }
  };
  const colorOptions = [];
  searchResult && Object.keys(searchResult || {}).length > 0
    ? Object.keys(searchResult || {}).map((e) => colorOptions.push({ value: `${searchResult[e].id}`, label: `${searchResult[e].text}`, isFixed: true }))
    : '';

  const filterColors2 = (inputValue) => {
    return colorOptions.filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()));
  };
  const promiseOptions = (inputValue) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(filterColors2(inputValue));
      }, 2000);
    });
  };
  const hundelReload = (e) => {
    if (selected) {
      history.push(`/order/order/${selected ? selected.value : ''}`);
      window.location.reload();
    } else {
      return;
    }
  };
  const hundelGetAddress = (id) => {
    if (id) {
      axios
        .get(`https://amanacart.com/api/admin/address/${id}/edit`, auth)
        .then((response) => {
          if (response.data.address !== null) {
            //   setAddress_id(response.data.address.id);
            setAddress_title(response.data.address.address_title);
            setAddress_line_1(response.data.address.address_line_1);
            setAddress_line_2(response.data.address.address_line_2);
            setCity(response.data.address.city);
            setPhone(response.data.address.phone);
            setCountry(response.data.address.country);
            setZip_code(response.data.address.zip_code);
            setState(response.data.address.state);
            setContries(response.data.countries);
            setAddress_type(response.data.address.address_type);

            setAddress_types(response.data.address_types);
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
    }
  };
  const handleSubmitAddress = (id) => {
    console.log(id);
    const formData = new URLSearchParams();

    formData.append('address_title', address_title);

    formData.append('address_type', address_type);

    formData.append('address_line_1', address_line_1);
    formData.append('address_line_2', address_line_2);
    formData.append('city', city);
    formData.append('state_id', state);
    formData.append('zip_code', zip_code);
    formData.append('country_id', country);
    formData.append('phone', phone);

    formData.append('_method', 'PUT');
    if (id) {
      axios
        .post(`https://amanacart.com/api/admin/address/${id}`, formData, auth)
        .then((response) => {
          console.log(response);
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
    }
  };
  const hundelCancel = () => {
    history.push('/order/order');
  };
  const hundetAddToCart = (item) => {
    // const array = [];
    // array.push(item);

    setCart((arr) => [...arr, inventories[item.value]]);
    console.log(cart);
  };
  const [total_price_item, setTotal_price_item] = useState('');
  const hundel_total_price_item = (value, price) => {
    setTotal_price_item(value * price);
  };
  const hundelDeletFormCart = (id) => {
    console.log('clicked');
    let cartN = cart.filter((e) => e.id != id);
    setCart(cartN);
  };
  return (
    <div id='dashboard-analytics'>
      <Row className='match-height mt-5'>
        <Col md='12' xs='12'>
          <Card className='m-0'>
            {/* flex-md-row flex-column align-md-items-center align-items-start border-bottom */}
            <CardHeader className=''>
              <div>
                <Button className='ml-2' color='primary' onClick={() => setBasicModal(!basicModal)}>
                  اعادة البحث
                </Button>
                <Button className='ml-2' color='primary' onClick={hundelCancel}>
                  تراجع
                </Button>
              </div>
            </CardHeader>
          </Card>
        </Col>
      </Row>
      <Row className='match-height mt-5'>
        <Col md='12' xs='12'>
          <Card className='m-0'>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
              <CardTitle tag='h4'>قوائم سلة التسوق</CardTitle>
              {/* <Button className='ml-2' color='primary' onClick={() => setBasicModal(!basicModal)}>
                <Plus size={15} />
                اضافة طلب
              </Button> */}
            </CardHeader>
          </Card>
        </Col>
        <Col>
          <TableWithButtons columns={Columns} data={data} />
        </Col>
      </Row>
      <Row className='match-height'>
        <Col md='12' xs='12'>
          <Row>
            <Col lg='8' md='12' sm='12' xs='12'>
              <Card style={{ marginTop: '10px' }}>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start'>عربة التسوق</CardHeader>
                <CardBody>
                  <Row>
                    <Col lg='8' style={{ padding: '0px !important' }}>
                      <Select
                        isClearable={false}
                        theme={selectThemeColors}
                        defaultValue=''
                        name='tags'
                        options={products}
                        className='react-select'
                        classNamePrefix='select'
                        onChange={(e) => setSelectedItem(e)}
                      />
                    </Col>
                    <Col lg='4' style={{ padding: '0px !important' }}>
                      <Button color='primary' onClick={(e) => hundetAddToCart(selectedItem)}>
                        اضافة الى الكارد
                      </Button>
                    </Col>
                  </Row>
                  <div style={{ margin: '40px' }}>
                    {cart && cart.length > 0
                      ? cart.map((e) => {
                          return (
                            <>
                              <Total item={e} cart={cart} src={e.image ? `https://amanacart.com/image/${e.image} ` : ''} salePrice={e.salePrice ? e.salePrice : ''} />
                              <Trash2 size={15} onClick={() => hundelDeletFormCart(e.id)} style={{ cursor: 'pointer' }} />
                            </>
                          );
                        })
                      : ''}
                  </div>
                  <Button color='primary' onClick={submitOrder}>
                    معالجة الطلب
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col lg='4' md='12' sm='12' xs='12'>
              <Card style={{ marginTop: '10px' }}>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start'> الزبون</CardHeader>
                <CardBody>
                  <h5>الاسم:{customer ? customer.name : ''}</h5>
                  <p>البريد الالكتروني:{customer ? customer.email : ''}</p>
                </CardBody>
              </Card>
              <Card className='' style={{ marginTop: '10px' }}>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start'> العناوين</CardHeader>
                <CardBody>
                  {shipping_address ? (
                    <>
                      <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{shipping_address ? shipping_address.address_line_1 : ''}</span>
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setBasicModals(!basicModals);
                            hundelGetAddress(shipping_id);
                          }}
                        >
                          <Edit size={15} />
                          تعديل
                        </span>
                      </p>
                      <p>{shipping_address ? shipping_address.address_line_2 : ''}</p>
                      <p>{shipping_address ? shipping_address.city : ''}</p>
                      <p>{shipping_address ? shipping_address.zip_code : ''}</p>
                      <p>{shipping_address ? shipping_address.country : ''}</p>
                      <p>{shipping_address ? shipping_address.phone : ''}</p>
                    </>
                  ) : (
                    <p>لا يوجد عنوان شحن</p>
                  )}
                </CardBody>
              </Card>
              <Card className='' style={{ marginTop: '10px' }}>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start'> الدفع</CardHeader>
                <CardBody>
                  <h5>طريقة الدفع او السداد</h5>
                  <Input type='select'>
                    {payment_methods && Object.keys(payment_methods || {}).length > 0
                      ? Object.keys(payment_methods || {}).map((e) => {
                          return <option value={e}>{payment_methods[e]}</option>;
                        })
                      : ''}
                  </Input>
                </CardBody>
                <CardBody>
                  <h5>حالة السداد</h5>
                  <Input type='select'>
                    {payment_statuses && Object.keys(payment_statuses || {}).length > 0
                      ? Object.keys(payment_statuses || {}).map((e) => {
                          return <option value={e}>{payment_statuses[e]}</option>;
                        })
                      : ''}
                  </Input>
                </CardBody>
              </Card>
              <Card className='' style={{ marginTop: '10px' }}>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start'> فاتورة</CardHeader>
                <CardBody>
                  <h5>رسالة إلى العميل</h5>
                  <Input type='text' placeholder='ابدا من هنا' />
                  <CustomInput inline id='ch' type='checkbox' label={'أرسل الفاتورة'} style={{ marginTop: '15px !important' }} />
                </CardBody>
              </Card>
              <Card className='' style={{ marginTop: '10px' }}>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start'> ملاحظة</CardHeader>
                <CardBody>
                  <h5>ملاحظة المشرف</h5>
                  <Input type='text' placeholder='ابدا من هنا' />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      {/**search customer */}
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
              <Button color='primary' type='submit' onClick={(e) => hundelReload(e)}>
                معالجة الطلب
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      {/**address  */}
      <Modal isOpen={basicModals} className='modal-dialog-top modal-lg'>
        <ModalHeader toggle={() => setBasicModals(!basicModals)}>الشكل</ModalHeader>
        <ModalBody>
          <Row>
            <Col className='mb-1' lg='12' md='12' xs='12'>
              <Label for='address_title'> اسم العنوان*</Label>
              <Input type='text' name='address_title' onChange={(e) => setAddress_title(e.target.value)} value={address_title} id='address_title' placeholder='العنوان الاول' />
            </Col>
            {/* <Col className='mb-1' lg='12' md='12' xs='12'>
              <Label for='address_type'>نوع العنوان*</Label>
              <Input type='select' name='address_type' onChange={(e) => setAddress_type(e.target.value)} value={address_type} id='address_type'>
                {address_types
                  ? Object.keys(address_types || {}).map((e) => {
                      return <option value={e}>{address_types[e]}</option>;
                    })
                  : ''}
                <option>حدد </option>
              </Input>
            </Col> */}
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
              <Button onClick={() => handleSubmitAddress(shipping_id)} color='primary' type='submit'>
                حفظ
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      {/**BILLING ADDRESS */}

      <Modal isOpen={basicModalsAd} className='modal-dialog-top modal-lg'>
        <ModalHeader toggle={() => setBasicModalsAd(!basicModalsAd)}>الشكل</ModalHeader>
        <ModalBody>
          <Row>
            <Col className='mb-1' lg='12' md='12' xs='12'>
              <Label for='address_title'> اسم العنوان*</Label>
              <Input type='text' name='address_title' onChange={(e) => setAddress_title(e.target.value)} value={address_title} id='address_title' placeholder='العنوان الاول' />
            </Col>
            <Col className='mb-1' lg='12' md='12' xs='12'>
              <Label for='address_type'>نوع العنوان*</Label>
              <Input type='select' name='address_type' onChange={(e) => setAddress_type(e.target.value)} value={address_type} id='address_type'>
                {address_types
                  ? Object.keys(address_types || {}).map((e) => {
                      return <option value={e}>{address_types[e]}</option>;
                    })
                  : ''}
                <option>حدد </option>
              </Input>
            </Col>
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
              <Button onClick={() => handleSubmitAddress(billing_id)} color='primary' type='submit'>
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
