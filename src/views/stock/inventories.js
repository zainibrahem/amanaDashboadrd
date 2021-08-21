import { useContext, useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Select, { components } from 'react-select';
import { selectThemeColors } from '@utils';
import { List, Plus, ChevronDown, ChevronUp, Trash2, Home, Settings, EyeOff, User, Search } from 'react-feather';
import {
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
  CardBody,
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
  Collapse,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import TableWithButtons from '../tables/data-tables/basic/TableWithButtons';
import AppCollapse from '@components/app-collapse';
import AutoComplete from '@components/autocomplete';

//validation input value
import NumberInput from '@components/number-input';
import { EditorState } from 'draft-js';

// ** Table Data & Columns
import { Columns, ColumnsTrash } from '../tables/data-tables/inventoryData';
import '@styles/react/libs/charts/apex-charts.scss';

//api
import axios from 'axios';

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';

//alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation-safe';
import './style.css';

const Catalog = () => {
  const [basicModal, setBasicModal] = useState(false);
  const [basicModals, setBasicModals] = useState(false);
  const [status, setStatus] = useState({ status: [] });
  const [trashData, setTrashData] = useState([]);
  const [activeTap, setActiveTap] = useState('1');
  const [isOpen_inven, setIsOpen_inven] = useState(false);

  const toggle = (tab) => {
    if (activeTap !== tab) {
      setActiveTap(tab);
    }
  };
  const toggleInven = () => setIsOpen_inven(!isOpen_inven);

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
  const [inactive_listings_data, setInactive_listings_data] = useState([]);
  const [out_of_stock_data, setOut_of_stock_data] = useState([]);
  const inactive = [];

  useEffect(() => {
    axios
      .get('https://amanacart.com/api/admin/stock/inventory', auth)
      .then((response) => {
        setdata(response.data.inventories.active);
        setInactive_listings_data(response.data.inventories.inactive_listings);
        setOut_of_stock_data(response.data.inventories.out_of_stock);

        // console.log(response.data);
        setTrashData(response.data.trashes);
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
  console.log(inactive);
  console.log(data);
  const [dataSelect, setdataSelect] = useState([]);
  const activeInventory = [];
  {
    data ? Object.keys(data || {}).map((e) => activeInventory.push(data[e])) : '';
  }

  {
    inactive_listings_data ? Object.keys(inactive_listings_data || {}).map((e) => inactive.push(inactive_listings_data[e])) : '';
  }

  // useEffect(() => {
  //   axios
  //     .get('https://amanacart.com/api/admin/catalog/manufacturer/create', auth)
  //     .then((response) => {
  //       setdataSelect(response.data.countries);
  //       setStatus({ status: response.data.statuses });
  //     })
  //     .catch((error) => {
  //       error.response ? handleError(error.response.data.error) : handleErrorNetwork(`${error}`);
  //     });
  // }, []);
  const [visibleImageError, setVisibleImageError] = useState('');
  const [value, setValue] = useState(EditorState.createEmpty());

  const [visible, setVisible] = useState('');
  const [active, setActive] = useState('');

  //init input value
  const [title, setTitle] = useState(null);

  const [sku, setSku] = useState(null);
  const [condition, setCondition] = useState('');
  const [condition_note, setCondition_note] = useState(null);
  const [description, setDescription] = useState(null);
  const [stock_quantity, setStock_quantity] = useState(null);
  const [min_order_quantity, setmMin_order_quantity] = useState(null);
  const [sale_price, setSale_price] = useState(null);
  const [offer_price, setOffer_price] = useState(null);
  const [offer_start, setOffer_start] = useState(null);
  const [offer_end, setOffer_end] = useState(null);
  const [linked_items, setLinked_items] = useState(null);
  const [slug, setSlug] = useState(null);
  const [tags, setTags] = useState({ tags: [] });
  const [tagsValue, setTagsValue] = useState([]);

  const [optionTags, setOptionTags] = useState({ optionTags: [] });

  // alert success
  const handleSuccess = (msg) => {
    return MySwal.fire({
      title: 'عمل جيد!',
      text: 'تمت العملية بنجاح',
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
        .delete('https://amanacart.com/api/admin/stock/inventory/emptyTrash', auth)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.getCurrentContent().getPlainText() === '') {
      setVisible(true);
    } else {
      setVisible(false);
    }
    const formData = new FormData();

    formData.append('title', title);
    formData.append('sku', sku);
    formData.append('condition', condition);

    formData.append('active', active);
    formData.append('condition_note', condition_note);
    formData.append('description', description);
    formData.append('stock_quantity', stock_quantity);
    formData.append('min_order_quantity', min_order_quantity);
    formData.append('sale_price', sale_price);
    formData.append('offer_price', offer_price);
    formData.append('offer_start', '2021-07-09 5:52:00');
    formData.append('offer_end', '2021-07-09 8:52:00');
    formData.append('linked_items', linked_items);
    formData.append('slug', slug);
    axios
      .post('https://amanacart.com/api/admin/stock/inventory/store', formData, auth)
      .then((response) => {
        console.log(response);
        handleSuccess('ADD SUCCESS');

        setBasicModal(!basicModal);
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
  const handleFileSelected = (e) => {
    setImage(e.target.files[0]);
  };
  const handleFileSelectedCover = (e) => {
    setCover_image(e.target.files[0]);
  };
  const [searchResult, setSearchResult] = useState([]);
  const hundelSearch = (e) => {
    if (e.target.value.length >= 3) {
      axios
        .get(`https://amanacart.com/api/admin/search/product?q=${e.target.value}`, auth)
        .then((response) => {
          console.log(response.data);
          setSearchResult(response.data.data);
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
    } else {
      setSearchResult([]);
    }
  };
  console.log(searchResult);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [sizNumber, setSizNumber] = useState([]);
  const [ahmad_aa, setAhmad_aa] = useState([]);
  const [ahmad_kassar, setAhmad_kassar] = useState([]);
  const [wadawd, setWadawd] = useState([]);

  const hundelVarient = (id) => {
    axios
      .get(`https://amanacart.com/api/admin/stock/inventory/setVariant/${id}`, auth)
      .then((response) => {
        console.log(response.data);
        const array = [];
        const arrayColor = [];
        const arraySiznumber = [];
        const arrayAhmad_aa = [];
        const arrayAhmad_kassar = [];
        const arrayWadawd = [];
        response.data.variants[0].attribute_values.map((ele) => {
          array.push({ value: ele.id, label: ele.value });
        });
        response.data.variants[1].attribute_values.map((ele) => {
          arrayColor.push({ value: ele.id, label: ele.value });
        });
        response.data.variants[2].attribute_values.map((ele) => {
          arraySiznumber.push({ value: ele.id, label: ele.value });
        });
        response.data.variants[3].attribute_values.map((ele) => {
          arrayAhmad_aa.push({ value: ele.id, label: ele.value });
        });
        response.data.variants[4].attribute_values.map((ele) => {
          arrayAhmad_kassar.push({ value: ele.id, label: ele.value });
        });
        response.data.variants[5].attribute_values.map((ele) => {
          arrayWadawd.push({ value: ele.id, label: ele.value });
        });
        setSize(array);
        setColor(arrayColor);
        setSizNumber(arraySiznumber);
        setAhmad_aa(arrayAhmad_aa);
        setAhmad_kassar(arrayAhmad_kassar);
        setWadawd(arrayWadawd);
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
  };
  return (
    <div id='dashboard-analytics'>
      <Row className='match-height mb-3'>
        <Col lg='12' md='12' xs='12'>
          <Card className='m-0'>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start'>
              <CardTitle tag='h4' style={{ marginBottom: '0rem', marginTop: '0.8rem' }}>
                المخزونات
              </CardTitle>
              {/* style={{ borderRadius: '0rem' }} */}
              <Button className='ml-2' color='primary' onClick={toggleInven}>
                <Plus size={15} />
                اضافة مخزون
              </Button>
            </CardHeader>
            <CardBody>
              <Collapse isOpen={isOpen_inven}>
                <InputGroup className='mb-2'>
                  <Input placeholder='Search a product by its GTIN,Name or Model Number ' name='search' onChange={(e) => hundelSearch(e)} />
                </InputGroup>{' '}
                {searchResult.length && searchResult.length > 0
                  ? searchResult.map((e) => {
                      return (
                        <>
                          <Card>
                            <Row className='match-height' style={{ border: '1px solid #e6dfdf', padding: '10px' }}>
                              <Col lg='4' md='8' sm='8' xs='12'>
                                <h5>{e.name}</h5>
                                <p>
                                  {e.gtin_type}:{e.gtin}
                                </p>
                                <p>{e.model_number ? e.model_number : 'no model number'}:رقم الموديل</p>
                                <p>{e.brand} :العلامة التجارية</p>
                              </Col>
                              <Col lg='8' md='8' sm='12' xs='12' style={{ display: 'content', textAlign: 'end' }}>
                                {e.has_variant === true ? (
                                  <>
                                    <Row style={{ justifyContent: 'flex-end' }}>
                                      <Col lg='4' styl={{ flexFlow: 'row' }}>
                                        <Link to={`/stock/Inventories/add/${e.id}`}>
                                          {' '}
                                          <Button className='' color='primary' style={{ padding: '10px 8px' }}>
                                            {/* <Plus size={15} /> */}
                                            اضافة الى المخزون{' '}
                                          </Button>
                                        </Link>
                                      </Col>

                                      <Col lg='4'>
                                        <Button
                                          className=''
                                          color='primary'
                                          style={{ padding: '10px 8px' }}
                                          onClick={() => {
                                            setBasicModals(!basicModals);
                                            hundelVarient(e.id);
                                          }}
                                        >
                                          إضافة إلى المخزون مع البديل
                                        </Button>
                                      </Col>
                                    </Row>
                                  </>
                                ) : (
                                  <Row style={{ justifyContent: 'flex-end' }}>
                                    <Col style={{ textAlign: 'end' }}>
                                      <Link to={`/stock/Inventories/add/${e.id}`}>
                                        {' '}
                                        <Button className='' color='primary' style={{ padding: '10px 8px' }}>
                                          {/* <Plus size={15} /> */}
                                          اضافة الى المخزون{' '}
                                        </Button>
                                      </Link>
                                    </Col>
                                  </Row>
                                )}
                              </Col>
                            </Row>
                          </Card>
                        </>
                      );
                    })
                  : 'لم يتم العثور على نتيجة! يرجى تجربة مفتاح بحث مختلف ,مفتاح البحث يجب ان يحتوي ثلاثة احرف على الاقل.'}
              </Collapse>
            </CardBody>
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
                    <span className='align-middle'>قوائم نشطة</span>
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
                    <span className='align-middle'>قوائم غير نشطة</span>
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
                    <span className='align-middle'>نفاذ المخزون</span>
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
            <Col md='12' xs='12'>
              {/* style={{ borderRadius: '0px' }} */}
              <Card className='m-0'>
                {/* <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                  <CardTitle tag='h4'>INVENTORIES</CardTitle>
                  <Button className='ml-2' color='primary' onClick={() => setBasicModal(!basicModal)}>
                    <Plus size={15} />
                    <span className='align-middle ml-50'>ADD INVENTORIES </span>
                  </Button>
                </CardHeader> */}
              </Card>
            </Col>
            <Col>
              <TableWithButtons columns={Columns} data={activeInventory} />
            </Col>
          </Row>
          <Row className='match-height'>
            <Col md='12' xs='12'>
              {/* style={{ borderRadius: '0px', borderBottom: '1px solid blue' }} */}
              <Card className='m-0'>
                {/* style={{ padding: '10px' }} */}
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                  <CardTitle tag='h4'>سلة المهملات</CardTitle>
                  <div>
                    <Button className='ml-2' color='primary' onClick={() => handleTrash()}>
                      <Trash2 size={15} />
                      حذف سلة المهملات نهائيا
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
            {/* <Col md='12' xs='12'>
              <Card className='m-0'>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                  <CardTitle tag='h4'>MANUFACTURERS</CardTitle>
                  <Button className='ml-2' color='primary' onClick={() => setBasicModal(!basicModal)}>
                    <Plus size={15} />
                    <span className='align-middle ml-50'>ADD MANUFACTURERS </span>
                  </Button>
                </CardHeader>
              </Card>
            </Col> */}
            <Col>
              <TableWithButtons columns={Columns} data={inactive} />
            </Col>
          </Row>
          <Row className='match-height'>
            <Col md='12' xs='12'>
              <Card className='m-0'>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                  <CardTitle tag='h4'>سلة المهملات</CardTitle>
                  <div>
                    <Button className='ml-2' color='primary'>
                      {/* onClick={() => handleTrash()} */}
                      <Trash2 size={15} />
                      حذف سلة المهملات نهائيا
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
              <TableWithButtons columns={Columns} data={out_of_stock_data} />
            </Col>
          </Row>
          <Row className='match-height'>
            <Col md='12' xs='12'>
              <Card className='m-0'>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                  <CardTitle tag='h4'>سلة المهملات</CardTitle>
                  <div>
                    <Button className='ml-2' color='primary'>
                      {/* onClick={() => handleTrash()} */}
                      <Trash2 size={15} />
                      حذف سلة المهملات نهائيا
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </Col>
            <Col>
              <TableWithButtons columns={ColumnsTrash} data={trashData} />
            </Col>
          </Row>
          <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-dialog-centered modal-lg'>
            <ModalHeader toggle={() => setBasicModal(!basicModal)}>FORM</ModalHeader>
            <ModalBody>
              <Row style={{ padding: '10px 20px' }}>
                <Col className='mb-1' lg='8' md='8' xs='12'>
                  <Label for='title'>TITLE*</Label>
                  <Input type='text' name='title' onChange={(e) => setTitle(e.target.value)} id='title' value={title} required />
                </Col>
                <Col className='mb-1' lg='4' md='4' xs='12'>
                  <Label for='status'>status *</Label>
                  <Input type='select' name='active' id='status' onChange={(e) => setActive(e.target.value)} value={active} required>
                    <option>Select Status</option>
                    <option value={1}>Active</option>
                    <option value={0}>InActive</option>
                  </Input>
                </Col>
                <Col className='mb-1' lg='6' md='6' xs='12'>
                  <Label for='sku'>SKU*</Label>
                  <Input type='text' name='sku' onChange={(e) => setSku(e.target.value)} id='sku' value={sku} required />
                </Col>
                <Col className='mb-1' lg='6' md='6' xs='12'>
                  <Label for='condition'>CONDITION*</Label>
                  <Input type='select' name='condition' id='condition' onChange={(e) => setCondition(e.target.value)} value={condition} required>
                    <option>Select condition</option>
                    <option value={'New'}>New</option>
                    <option value={'Used'}>Used</option>
                    <option value={'Refurbished'}>Refurbished</option>
                  </Input>
                  {/* <Input type='text' name='condition' onChange={(e) => setCondition(e.target.value)} id='condition' value={condition} /> */}
                </Col>

                <Col className='mb-1' lg='6' md='6' md='12'>
                  <Label>CONDITION NOT*</Label>
                  <Input type='text' name='condition_note' onChange={(e) => setCondition_note(e.target.value)} id='condition_note' value={condition_note} />
                </Col>

                <Col className='mb-1' lg='6' md='6' md='12'>
                  <Label>DESCRIPTION*</Label>
                  <Input type='text' name='description' onChange={(e) => setDescription(e.target.value)} id='description' value={description} />
                </Col>
                <Col className='mb-1' lg='6' md='6' md='12'>
                  <Label>STOCK QUANTITY*</Label>
                  <Input style={{ borderRadius: '0px' }} type='number' name='stock_quantity' onChange={(e) => setStock_quantity(e.target.value)} id='stock_quantity' value={stock_quantity} />
                </Col>
                <Col className='mb-1' lg='6' md='6' md='12'>
                  <Label>MIN ORDER QUANTITY*</Label>
                  <Input type='number' name='min_order_quantity' onChange={(e) => setmMin_order_quantity(e.target.value)} id='min_order_quantity' value={min_order_quantity} />
                </Col>
                <Col className='mb-1' lg='6' md='6' md='12'>
                  <Label>PRICE*</Label>
                  <Input type='number' name='sale_price' onChange={(e) => setSale_price(e.target.value)} id='sale_price' value={sale_price} />
                </Col>
                <Col className='mb-1' lg='6' md='6' md='12'>
                  <Label>OFFER PRICE *</Label>
                  <Input type='number' name='offer_price' onChange={(e) => setOffer_price(e.target.value)} id='offer_price' value={offer_price} />
                </Col>
                <Col className='mb-1' lg='6' md='6' md='12'>
                  <Label>OFFER START DATE*</Label>
                  <Input type='text' name='offer_start' onChange={(e) => setOffer_start(e.target.value)} id='offer_start' value={offer_start} />
                </Col>
                <Col className='mb-1' lg='6' md='6' md='12'>
                  <Label>OFFER END DATE*</Label>
                  <Input type='text' name='offer_end' onChange={(e) => setOffer_end(e.target.value)} id='offer_end' value={offer_end} />
                </Col>
                <Col className='mb-1' lg='6' md='6' md='12'>
                  <Label>LINKED ITEMS*</Label>
                  <Input type='select' name='linked_items' onChange={(e) => setLinked_items(e.target.value)} id='linked_items' value={linked_items}>
                    <option>ITEM 1</option>
                    <option>ITEM 2</option>
                  </Input>
                </Col>

                <Col className='mb-1 d-flex justify-content-end' xs='12'>
                  <Button onClick={handleSubmit} color='primary' type='submit'>
                    SAVE
                  </Button>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
        </TabPane>
      </TabContent>
      {/**varient product */}
      <Modal isOpen={basicModals} toggle={() => setBasicModals(!basicModals)} className='modal-dialog-centered modal-lg'>
        <ModalHeader toggle={() => setBasicModals(!basicModals)}>اضبط المتغيرات</ModalHeader>
        <ModalBody>
          <Row style={{ padding: '10px 20px' }}>
            <Col className='mb-1' lg='12' md='12' xs='12'>
              <Label for='tags'>العلامات</Label>
              <Select
                isClearable={false}
                theme={selectThemeColors}
                defaultValue=''
                isMulti
                name='tags'
                options={size}
                className='react-select'
                classNamePrefix='select'
                // onChange={(e) => setTagss(e)}
              />
            </Col>
            <Col className='mb-1' lg='12' md='12' xs='12'>
              <Label for='tags'>اللون</Label>
              <Select
                isClearable={false}
                theme={selectThemeColors}
                defaultValue=''
                isMulti
                name='tags'
                options={color}
                className='react-select'
                classNamePrefix='select'
                // onChange={(e) => setTagss(e)}
              />
            </Col>
            <Col className='mb-1' lg='12' md='12' xs='12'>
              <Label for='tags'>نمرة القياس</Label>
              <Select
                isClearable={false}
                theme={selectThemeColors}
                defaultValue=''
                isMulti
                name='tags'
                options={sizNumber}
                className='react-select'
                classNamePrefix='select'
                // onChange={(e) => setTagss(e)}
              />
            </Col>
            <Col className='mb-1' lg='12' md='12' xs='12'>
              <Label for='tags'>AHMAD AA</Label>
              <Select
                isClearable={false}
                theme={selectThemeColors}
                defaultValue=''
                isMulti
                name='tags'
                options={ahmad_aa}
                className='react-select'
                classNamePrefix='select'
                // onChange={(e) => setTagss(e)}
              />
            </Col>

            <Col className='mb-1' lg='12' md='12' xs='12'>
              <Label for='tags'>AHMAD KASSRA</Label>
              <Select
                isClearable={false}
                theme={selectThemeColors}
                defaultValue=''
                isMulti
                name='tags'
                options={ahmad_kassar}
                className='react-select'
                classNamePrefix='select'
                // onChange={(e) => setTagss(e)}
              />
            </Col>
            <Col className='mb-1' lg='12' md='12' xs='12'>
              <Label for='tags'>WADAWD</Label>
              <Select
                isClearable={false}
                theme={selectThemeColors}
                defaultValue=''
                isMulti
                name='tags'
                options={[]}
                className='react-select'
                classNamePrefix='select'
                // onChange={(e) => setTagss(e)}
              />
            </Col>

            <Col className='mb-1 d-flex justify-content-end' xs='12'>
              <Button color='primary' type='submit'>
                وضع المتغيرات
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Catalog;
