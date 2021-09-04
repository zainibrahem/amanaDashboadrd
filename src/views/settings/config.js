import { useContext, useState, useEffect } from 'react';
import { List, Plus, ChevronDown, ChevronUp, Trash2, Home, Settings, EyeOff, User, Search } from 'react-feather';
import {
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
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import TableWithButtons from '../tables/data-tables/basic/TableWithButtons';
import NumberInput from '@components/number-input';
import { EditorState } from 'draft-js';
import './style.css';
// ** Table Data & Columns
import { Columns, ColumnsTrash } from '../tables/data-tables/disputesData';
import '@styles/react/libs/charts/apex-charts.scss';

//api
import axios from 'axios';

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';

//alert

import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation-safe';

const Catalog = (props) => {
  const [active, setActive] = useState('1');
  const confige = useJwt.jwtConfig;
  const auth = {
    headers: {
      Authorization: `${confige.tokenType} ${confige.storageTokenKeyName}`,
    },
  };
  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
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
  const MySwal = withReactContent(Swal);

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

  const [config, setConfig] = useState({});
  /**INVENTORE */
  const [alert_quantity, setAlert_quantity] = useState([]);
  const [default_supplier_id, setDfault_supplier_id] = useState([]);

  const [default_supplier_id_s, setDfault_supplier_id_s] = useState('');

  const [default_warehouse_id, setDefault_warehouse_id] = useState([]);
  const [default_warehouse_id_s, setDefault_warehouse_id_s] = useState('');

  const [default_packaging_ids, setDefault_packaging_ids] = useState([]);
  const [default_packaging_ids_s, setDefault_packaging_ids_s] = useState([]);

  const [shop_id, setShop_id] = useState('');
  /**ORDER */
  const [order_number_prefix, setOrder_number_prefix] = useState(null);
  const [order_number_suffix, setOrder_number_suffix] = useState(null);
  const [default_tax_id, setDefault_tax_id] = useState(null);
  const [default_tax_id_s, setDefault_tax_id_s] = useState(null);

  const [order_handling_cost, setOrder_handling_cost] = useState(null);

  const [auto_archive_order, setAuto_archive_order] = useState(null);
  const [default_payment_method_id, setDefault_payment_method_id] = useState(null);

  /**VIEWS */
  const [pagination, setPagination] = useState(null);
  const [show_shop_desc_with_listing, setShow_shop_desc_with_listing] = useState(null);
  const [show_refund_policy_with_listing, setShow_refund_policy_with_listing] = useState(null);

  /**SUPPORT */
  const [support_phone, setSupport_phone] = useState(null);
  const [support_phone_toll_free, setSupport_phone_toll_free] = useState(null);
  const [support_email, setSupport_email] = useState(null);
  const [support_agent, setSupport_agent] = useState(null);
  const [default_sender_email_address, setDefault_sender_email_address] = useState(null);
  const [default_email_sender_name, setDefault_email_sender_name] = useState(null);
  const [return_refund, setReturn_refund] = useState(null);

  useEffect(() => {
    axios
      .get('https://amanacart.com/api/admin/setting/config', auth)
      .then((response) => {
        console.log(response);
        setShop_id(response.data.config.shop_id);
        setConfig(response.data.config);
        setAlert_quantity(response.data.config.alert_quantity);
        setDfault_supplier_id(response.data.supplierrs);
        setDefault_warehouse_id(response.data.warehouses);
        setDefault_packaging_ids(response.data.packaging);
        /**order */
        setOrder_number_prefix(response.data.config.order_number_prefix);
        setOrder_number_suffix(response.data.config.order_number_suffix);
        setDefault_tax_id(response.data.config.default_tax_id);
        setOrder_handling_cost(response.data.config.order_handling_cost);
        setAuto_archive_order(response.data.config.auto_archive_order);
        setDefault_payment_method_id(response.data.config.default_payment_method_id);

        /**VIEWS */
        setPagination(response.data.config.pagination);
        setShow_shop_desc_with_listing(response.data.config.show_shop_desc_with_listing);
        setShow_refund_policy_with_listing(response.data.config.show_refund_policy_with_listing);

        /**SUPPORT */
        setSupport_phone(response.data.config.support_phone);
        setSupport_phone_toll_free(response.data.config.support_phone_toll_free);
        setSupport_email(response.data.config.support_email);
        setSupport_agent(response.data.config.support_agent);
        setDefault_sender_email_address(response.data.config.default_sender_email_address);
        setDefault_email_sender_name(response.data.config.default_email_sender_name);
        setReturn_refund(response.data.config.return_refund);
      })
      .catch((e) => {});
  }, []);
  const regex = /(<([^>]+)>)/gi;

  console.log(show_shop_desc_with_listing);
  console.log(show_refund_policy_with_listing);

  const hundelInventory = (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();

    formData.append('alert_quantity', alert_quantity);
    formData.append('default_supplier_id', default_supplier_id_s);
    formData.append('default_warehouse_id', default_warehouse_id_s);
    formData.append('default_packaging_ids', default_packaging_ids_s);

    //order
    formData.append('order_number_prefix', order_number_prefix);
    formData.append('order_number_suffix', order_number_suffix);
    formData.append('default_tax_id', default_tax_id);
    formData.append('order_handling_cost', order_handling_cost);
    formData.append('default_payment_method_id', default_payment_method_id);
    formData.append('auto_archive_order', auto_archive_order);

    formData.append('pagination', pagination);

    formData.append('support_phone', support_phone);
    formData.append('support_phone_toll_free', support_phone_toll_free);
    formData.append('support_email', support_email);
    formData.append('support_agent', support_agent);
    formData.append('default_sender_email_address', default_sender_email_address);
    formData.append('default_email_sender_name', default_email_sender_name);

    formData.append('return_refund', return_refund);

    // formData.append('timezone_id', timezone_id);
    // formData.append('description', description);
    console.log(formData);
    formData.append('_method', 'PUT');

    axios
      .post(`https://amanacart.com/api/admin/setting/config/updateConfig/${shop_id}`, formData, auth)
      .then((response) => {
        console.log(response);
        // window.location.reload();
        handleSuccess('تمت العملية بنجاح');

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
  const hundelNotification = (type) => {
    axios
      .put(`https://amanacart.com/api/admin/setting/config/notification/${type}/toggle`, auth)
      .then((response) => {
        console.log(response);
        // window.location.reload();
        handleSuccess('تمت العملية بنجاح');

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
  return (
    <div id='dashboard-analytics'>
      <Row className='match-height'>
        <Col md='12' xs='12' style={{ padding: '0px' }}>
          <Card className='m-0' style={{ borderRadius: '0px' }}>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start' style={{ padding: '0rem' }}>
              <Nav tabs style={{ marginBottom: '0rem', width: '100%' }}>
                <NavItem style={{ minWidth: '20%', maxWidth: '100%' }}>
                  <NavLink
                    active={active === '1'}
                    onClick={() => {
                      toggle('1');
                    }}
                    style={{ padding: '20px' }}
                  >
                    <Home size={14} />
                    <span className='align-middle'>المخزون</span>
                  </NavLink>
                </NavItem>
                <NavItem style={{ minWidth: '20%', maxWidth: '100%' }}>
                  <NavLink
                    active={active === '2'}
                    onClick={() => {
                      toggle('2');
                    }}
                    style={{ padding: '20px' }}
                  >
                    <Settings size={14} />
                    <span className='align-middle'>الطلب</span>
                  </NavLink>
                </NavItem>
                <NavItem style={{ minWidth: '20%', maxWidth: '100%' }}>
                  <NavLink
                    active={active === '3'}
                    onClick={() => {
                      toggle('3');
                    }}
                    style={{ padding: '20px' }}
                  >
                    <User size={14} />
                    <span className='align-middle'>الآراء</span>
                  </NavLink>
                </NavItem>
                <NavItem style={{ minWidth: '20%', maxWidth: '100%' }}>
                  <NavLink
                    active={active === '4'}
                    onClick={() => {
                      toggle('4');
                    }}
                    style={{ padding: '20px' }}
                  >
                    <User size={14} />
                    <span className='align-middle'>الدعم</span>
                  </NavLink>
                </NavItem>
                <NavItem style={{ minWidth: '20%', maxWidth: '100%' }}>
                  <NavLink
                    active={active === '5'}
                    onClick={() => {
                      toggle('5');
                    }}
                    style={{ padding: '20px' }}
                  >
                    <User size={14} />
                    <span className='align-middle'>الاشعارات</span>
                  </NavLink>
                </NavItem>
              </Nav>
            </CardHeader>
          </Card>
        </Col>
      </Row>
      <TabContent className='py-50' style={{ marginTop: '-7px' }} activeTab={active}>
        <TabPane tabId='1'>
          <Row className='match-height'>
            <Col>
              <div id='dashboard-analytics' className=''>
                <Row className='card' style={{ flexDirection: 'row', padding: '15px' }}>
                  <Col lg='12'>
                    <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                      <Label sm='3' for='alert_quantity'>
                        كمية التنبيه*
                      </Label>
                      <Input sm='9' type='number' name='alert_quantity' id='alert_quantity' value={alert_quantity ? alert_quantity : null} onChange={(e) => setAlert_quantity(e.target.value)} />
                    </Col>
                    <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                      <Label sm='3' for='default_supplier_id'>
                        المورد الافتراضي*
                      </Label>
                      <Input sm='9' type='select' name='default_supplier_id' id='default_supplier_id' onChange={(e) => setDfault_supplier_id_s(e.target.value)}>
                        {default_supplier_id
                          ? Object.keys(default_supplier_id || {}).map((e) => {
                              return <option value={e}>{default_supplier_id[e]}</option>;
                            })
                          : ''}
                      </Input>
                    </Col>
                    <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                      <Label sm='3' for='default_warehouse_id'>
                        المستودع الافتراضي*
                      </Label>
                      <Input sm='9' type='select' name='default_warehouse_id' id='default_warehouse_id' onChange={(e) => setDefault_warehouse_id_s(e.target.value)}>
                        {default_warehouse_id
                          ? Object.keys(default_warehouse_id || {}).map((e) => {
                              return <option value={e}>{default_warehouse_id[e]}</option>;
                            })
                          : ''}
                      </Input>
                    </Col>
                    <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                      <Label sm='3' for='default_packaging_ids'>
                        العبوات الافتراضية*
                      </Label>
                      <Input sm='9' type='select' name='default_packaging_ids' id='default_packaging_ids' onChange={(e) => setDefault_packaging_ids_s(e.target.value)}>
                        {default_packaging_ids
                          ? Object.keys(default_packaging_ids || {}).map((e) => {
                              return <option value={e}>{default_packaging_ids[e]}</option>;
                            })
                          : ''}
                      </Input>
                    </Col>
                  </Col>

                  <Col className='mb-1 d-flex justify-content-end' xs='12'>
                    <Button color='primary' type='submit' onClick={hundelInventory}>
                      حفظ
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId='2'>
          <Row className='match-height'>
            <Col>
              <div id='dashboard-analytics' className=''>
                <Row className='card' style={{ flexDirection: 'row', padding: '15px' }}>
                  <Col>
                    <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                      <Label sm='3' for='name'>
                        رقم الطلب المسبق*
                      </Label>
                      <Input sm='2' type='text' name='order_number_prefix' id='order_number_prefix' onChange={(e) => setOrder_number_prefix(e.target.value)} value={order_number_prefix} />
                    </Col>
                    <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                      <Label sm='3' for='order_number_suffix'>
                        AND SUFFIX *
                      </Label>
                      <Input sm='2' type='text' name='order_number_suffix' id='order_number_suffix' onChange={(e) => setOrder_number_suffix(e.target.value)} value={order_number_suffix} />
                    </Col>
                    <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                      <Label sm='3' for='default_payment_method_id'>
                        طريقه تسديدالافتراضية *
                      </Label>
                      <Input
                        sm='8'
                        type='select'
                        name='default_payment_method_id'
                        id='default_payment_method_id'
                        onChange={(e) => setDefault_payment_method_id(e.target.value)}
                        value={default_payment_method_id}
                      >
                        <option>تحديد</option>
                        <option value={1}>Cash On Delivery</option>
                        <option value={2}>Bank Wire Transfer</option>
                      </Input>
                    </Col>
                    <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                      <Label sm='3' for='default_tax_id'>
                        الضريبة الافتراضية*
                      </Label>
                      <Input sm='8' type='select' name='default_tax_id' id='default_tax_id' onChange={(e) => setDefault_tax_id(e.target.value)} value={default_tax_id}>
                        <option value={1}>-No tax-</option>
                        <option value={2}>est 7.96%</option>
                        <option value={3}>reiciendia 7%</option>
                      </Input>
                    </Col>
                    <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                      <Label sm='3' for='order_handling_cost'>
                        تكلفة معالجة الطلب*
                      </Label>
                      <Input
                        sm='8'
                        type='number'
                        name='order_handling_cost'
                        id='order_handling_cost'
                        onChange={(e) => setOrder_handling_cost(e.target.value)}
                        value={parseInt(order_handling_cost).toFixed(1)}
                      />
                    </Col>
                    <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                      <Label sm='3' for='auto_archive_order'>
                        أرشفة الطلب*
                      </Label>
                      <CustomInput
                        type='switch'
                        label={<Label />}
                        id='icon-primary'
                        name='auto_archive_order'
                        inline
                        defaultChecked={auto_archive_order}
                        onChange={(e) => hundelNotification('auto_archive_order')}
                      />
                    </Col>
                  </Col>

                  <Col className='mb-1 d-flex justify-content-end' xs='12'>
                    <Button color='primary' type='submit' onClick={hundelInventory}>
                      حفظ
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId='3'>
          <Row className='match-height'>
            <Col>
              <div id='dashboard-analytics' className=''>
                <Row className='card' style={{ flexDirection: 'row', padding: '15px' }}>
                  <Col lg='6' md='12' sm='12' xs='12'>
                    <div style={{ borderBottom: '1px solid #d2d1d1', textAlign: 'right', marginTop: '25px', marginBottom: '20px' }}>
                      <h5>مكتب خلفي</h5>
                    </div>
                    <Col className='mb-1' lg='12' md='12' xs='12'>
                      <Col className='d-flex' lg='12'>
                        <Label sm='4' for='name'>
                          ترقيم الصفحات*
                        </Label>
                        <Input type='number' name='pagination' id='pagination' onChange={(e) => setPagination(e.target.value)} value={pagination} />
                      </Col>
                      <Col>
                        <Button style={{ marginTop: '30px' }} color='primary' type='submit' onClick={hundelInventory}>
                          حفظ
                        </Button>
                      </Col>
                    </Col>
                  </Col>
                  <Col lg='6' md='12' sm='12' xs='12'>
                    <div style={{ borderBottom: '1px solid #d2d1d1', textAlign: 'right', marginTop: '25px', marginBottom: '20px' }}>
                      <h5>واجهة المتجر</h5>
                    </div>

                    <Col className='mb-1 d-flex' lg='12' md='12' xs='12' style={{ justifyContent: 'space-evenly' }}>
                      <Label sm='25' for='auto_archive_order'>
                        عرض وصف المتجر مع القائمة *
                      </Label>
                      <CustomInput
                        style={{ display: 'flex', alignItems: 'center' }}
                        type='switch'
                        label={<Label />}
                        id='show_shop_desc_with_listing'
                        name='show_shop_desc_with_listing'
                        inline
                        checked={show_shop_desc_with_listing}
                        onChange={(e) => hundelNotification('show_shop_desc_with_listing')}
                      />
                    </Col>
                    <Col className='mb-1 d-flex' lg='12' md='12' xs='12' style={{ justifyContent: 'space-evenly' }}>
                      <Label sm='25' for='auto_archive_order'>
                        إظهار سياسة الاسترداد مع القوائم*
                      </Label>
                      <CustomInput
                        style={{ display: 'flex', alignItems: 'center' }}
                        type='switch'
                        label={<Label />}
                        id='show_refund_policy_with_listing'
                        name='show_refund_policy_with_listing'
                        inline
                        // show_refund_policy_with_listing
                        defaultChecked={show_refund_policy_with_listing}
                        // defaultChecked={show_refund_policy_with_listing === '1' ? true : false}
                        onChange={(e) => hundelNotification('show_refund_policy_with_listing')}
                      />
                    </Col>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId='4'>
          <Row className='match-height'>
            <Col>
              <div id='dashboard-analytics' className=''>
                <Row className='card' style={{ flexDirection: 'row', padding: '15px' }}>
                  <Col lg='12'>
                    <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                      <Label sm='4' for='name'>
                        وكيل الدعم*
                      </Label>
                      <Input sm='9' type='select' name='support_agent' id='support_agent' onChange={(e) => setSupport_agent(e.target.value)} value={support_agent}>
                        <option value={1}>Dr.Lenore Qrtiz V</option>
                      </Input>
                    </Col>
                    <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                      <Label sm='4' for='active'>
                        هاتف الدعم*
                      </Label>
                      <Input sm='9' type='text' name='support_phone' id='support_phone' placeholder='Support Phone' onChange={(e) => setSupport_phone(e.target.value)} value={support_phone} />
                    </Col>
                    <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                      <Label sm='4' for='email'>
                        الرقم المجاني*
                      </Label>
                      <Input
                        sm='9'
                        type='text'
                        name='support_phone_toll_free'
                        id='support_phone_toll_free'
                        placeholder='Phone Toll Free'
                        onChange={(e) => setSupport_phone_toll_free(e.target.value)}
                        value={support_phone_toll_free}
                      />
                    </Col>
                    <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                      <Label sm='4' for='email'>
                        البريد الإلكتروني للدعم*
                      </Label>
                      <Input sm='9' type='email' name='support_email' id='support_email' onChange={(e) => setSupport_email(e.target.value)} value={support_email} />
                    </Col>
                    <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                      <Label sm='4' for='default_sender_email_address'>
                        عنوان البريد الإلكتروني للمرسل الافتراضي*
                      </Label>
                      <Input
                        sm='9'
                        type='email'
                        name='default_sender_email_address'
                        id='default_sender_email_address'
                        onChange={(e) => setDefault_sender_email_address(e.target.value)}
                        value={default_sender_email_address}
                      />
                    </Col>

                    <Col className='mb-1 d-flex' lg='12' md='12' xs='12'>
                      <Label sm='4' for='default_email_sender_name'>
                        الاسم الكامل للمرسل الافتراضي*
                      </Label>
                      <Input
                        sm='9'
                        type='text'
                        name='default_email_sender_name'
                        id='default_email_sender_name'
                        onChange={(e) => setDefault_email_sender_name(e.target.value)}
                        value={default_email_sender_name}
                      />
                    </Col>
                    <Col className='mb-1 d-flex' lg='12' md='6' xs='12'>
                      <Label sm='4' for='return_refund'>
                        سياسة الاسترجاع والاسترداد*
                      </Label>
                      <Input sm='9' type='textarea' name='return_refund' id='return_refund' onChange={(e) => setReturn_refund(e.target.value)} />
                    </Col>
                  </Col>

                  <Col className='mb-1 d-flex justify-content-end' xs='12'>
                    <Button color='primary' type='submit' onClick={hundelInventory}>
                      حفظ
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId='5'>
          <Row className='match-height'>
            <Col>
              <div id='dashboard-analytics' className=''>
                <Row className='card' style={{ flexDirection: 'row', padding: '15px' }}>
                  <Col lg='12' md='12' sm='12'>
                    <Row>
                      <Col lg='6' md='12' sm='12'>
                        <div style={{ borderBottom: '1px solid #d2d1d1', textAlign: 'right', marginTop: '25px', marginBottom: '20px' }}>
                          <h5>المخزون</h5>
                        </div>
                        <Col>
                          <Col className='d-flex' lg='12'>
                            <Label sm='7' for='name'>
                              تنبيه انخفاض المخزون*
                            </Label>
                            <CustomInput
                              style={{ display: 'flex', alignItems: 'center' }}
                              type='switch'
                              label={<Label />}
                              id='notify_alert_quantity'
                              name='notify_alert_quantity'
                              inline
                              checked={config.notify_alert_quantity}
                              onChange={(e) => hundelNotification('notify_alert_quantity')}
                            />{' '}
                          </Col>

                          <Col className='d-flex' lg='12'>
                            <Label sm='7' for='name'>
                              تنبيه المخزون*
                            </Label>
                            <CustomInput
                              style={{ display: 'flex', alignItems: 'center' }}
                              type='switch'
                              label={<Label />}
                              id='notify_inventory_out'
                              name='notify_inventory_out'
                              inline
                              defaultChecked={config.notify_inventory_out}
                              onChange={(e) => hundelNotification('notify_inventory_out')}
                            />{' '}
                          </Col>
                        </Col>
                      </Col>
                      <Col lg='6'>
                        <div style={{ borderBottom: '1px solid #d2d1d1', textAlign: 'right', marginTop: '25px', marginBottom: '20px' }}>
                          <h5>الطلب</h5>
                        </div>
                        <Col className='d-flex' lg='12'>
                          <Label sm='7' for='name'>
                            تنبيه طلب جديد*
                          </Label>
                          <CustomInput
                            style={{ display: 'flex', alignItems: 'center' }}
                            type='switch'
                            label={<Label />}
                            id='notify_new_order'
                            name='notify_new_order'
                            inline
                            defaultChecked={config.notify_new_order}
                            onChange={(e) => hundelNotification('notify_new_order')}
                          />{' '}
                        </Col>
                        <Col className='d-flex' lg='12'>
                          <Label sm='7' for='name'>
                            تم التخلي عن عملية الدفع*
                          </Label>
                          <CustomInput
                            style={{ display: 'flex', alignItems: 'center' }}
                            type='switch'
                            label={<Label />}
                            id='notify_abandoned_checkout'
                            name='notify_abandoned_checkout'
                            inline
                            checked={config.notify_abandoned_checkout}
                            onChange={(e) => hundelNotification('notify_abandoned_checkout')}
                          />{' '}
                        </Col>
                        <Col className='d-flex' lg='12'>
                          <Label sm='7' for='name'>
                            نزاع جديد*
                          </Label>
                          <CustomInput
                            style={{ display: 'flex', alignItems: 'center' }}
                            type='switch'
                            label={<Label />}
                            id='notify_new_disput'
                            name='notify_new_disput'
                            inline
                            defaultChecked={config.notify_new_disput}
                            onChange={(e) => hundelNotification('notify_new_disput')}
                          />{' '}
                        </Col>
                      </Col>
                    </Row>

                    <Col lg='6'>
                      <div style={{ borderBottom: '1px solid #d2d1d1', textAlign: 'right', marginTop: '25px', marginBottom: '20px' }}>
                        <h5>الدعم</h5>
                      </div>
                      <Col className='d-flex' lg='12'>
                        <Label sm='7' for='name'>
                          رسالة جديدة*
                        </Label>
                        <CustomInput
                          style={{ display: 'flex', alignItems: 'center' }}
                          type='switch'
                          label={<Label />}
                          id='notify_new_message'
                          name='notify_new_message'
                          inline
                          defaultChecked={config.notify_new_message}
                          onChange={(e) => hundelNotification('notify_new_message')}
                        />{' '}
                      </Col>
                      <Col className='d-flex' lg='12'>
                        <Label sm='7' for='name'>
                          اشعار رسالة محادثة جديدة*
                        </Label>
                        <CustomInput
                          style={{ display: 'flex', alignItems: 'center' }}
                          type='switch'
                          label={<Label />}
                          id='notify_new_chat'
                          name='notify_new_chat'
                          inline
                          defaultChecked={config.notify_new_chat}
                          onChange={(e) => hundelNotification('notify_new_chat')}
                        />{' '}
                      </Col>
                    </Col>
                  </Col>

                  {/* <Col md='6' sm='12'>
              <FormGroup>
                <Label for='image'>BRAND LOGO </Label>
                <CustomInput type='file' onChange={(e) => handleFileSelected(e)} id='image' name='image' />
              </FormGroup>
            </Col> */}

                  {/* <Col className='mb-1 d-flex justify-content-end' xs='12'>
                    <Button color='primary' type='submit' onClick={hundelInventory}>
                      حفظ
                    </Button>
                  </Col> */}
                </Row>
              </div>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default Catalog;
