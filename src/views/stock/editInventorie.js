import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { List, Plus, ChevronDown, ChevronUp } from 'react-feather';
import { CustomInput, FormGroup, Card, Collapse, CardHeader, CardBody, CardTitle, Button, Input, Label, Badge, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import NumberInput from '@components/number-input';
import { EditorState } from 'draft-js';
import Select, { components } from 'react-select';
import { selectThemeColors } from '@utils';
import Flatpickr from 'react-flatpickr';

//alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
//api
import axios from 'axios';

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';
const Catalog = (props) => {
  //get id from URL
  // const { id } = props.location;

  //init alert
  const MySwal = withReactContent(Swal);
  // init headers auth
  const config = useJwt.jwtConfig;
  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };
  const [value, setValue] = useState(EditorState.createEmpty());
  const [picker, setPicker] = useState(new Date());
  const [pickerEnd, setPickerEnd] = useState(new Date());

  //init input value
  const [product_id, setProduct_id] = useState('');
  const [title, setTitle] = useState(null);

  const [sku, setSku] = useState(null);
  const [condition, setCondition] = useState(null);
  const [active, setActive] = useState(null);

  const [condition_note, setCondition_note] = useState(null);
  const [description, setDescription] = useState(null);
  const [stock_quantity, setStock_quantity] = useState(null);
  const [min_order_quantity, setmMin_order_quantity] = useState(null);
  const [sale_price, setSale_price] = useState(null);
  const [offer_price, setOffer_price] = useState(null);
  const [offer_start, setOffer_start] = useState(null);
  const [offer_end, setOffer_end] = useState(null);
  const [tags, setTags] = useState({ tags: [] });
  const [items, setItems] = useState({ items: [] });

  const [optionTags, setOptionTags] = useState({ optionTags: [] });
  const [optionItems, setOptionItems] = useState({ optionItems: [] });
  const [slug, setSlug] = useState(null);
  const [image, setImage] = useState('');

  // const [incharge, setIncharge] = useState(null);
  // // const [address_line_1, setAddress_line_1] = useState(null);
  // // const [address_line_2, setAddress_line_2] = useState(null);
  // // const [city, setCity] = useState(null);
  // // const [zip_code, setZip_code] = useState(null);
  // const [phone, setPhone] = useState(null);
  // // const [country_id, setCountry_id] = useState(null);
  // // const [state_id, setState_id] = useState(null);
  // const [description, setDescription] = useState(null);
  const [product, setProduct] = useState([]);
  const [isOpen_inven, setIsOpen_inven] = useState(false);

  const [visible, setVisible] = useState('');
  const [visibleImageError, setVisibleImageError] = useState('');

  const [basicModal, setBasicModal] = useState(false);
  const toggleInven = () => setIsOpen_inven(!isOpen_inven);

  const {
    match: { params },
  } = props;
  //fetch data from api
  const [dataSelect, setdataSelect] = useState([]);
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
  useEffect(() => {
    // axios.get("https://zcart.test/api/admin/catalog/manufacturer/create", auth).then(response => {
    //     // console.log(response.data.categories)
    // }).catch(error => {
    //     console.log(error)
    //     handleError(` ${error} check internet connection `)
    // const {
    //   match: { params },
    // } = props;

    if (params.id) {
      console.log(params.id);
    }
    // })
    if (params.id) {
      axios
        .get(`https://amanacart.com/api/admin/stock/inventory/${params.id}`, auth)
        .then((response) => {
          try {
            console.log(response.data);
            setProduct_id(response.data.product.gtin);
            setTitle(response.data.title);
            setSku(response.data.sku);
            setCondition(response.data.condition);
            setActive(response.data.inspection_status);
            setCondition_note(response.data.condition_note);
            setDescription(response.data.description);
            setStock_quantity(response.data.stock_quantity);
            setmMin_order_quantity(response.data.min_order_quantity);
            setSale_price(response.data.sale_price);
            setOffer_price(response.data.offer_price);
            setOffer_start(response.data.offer_start);
            setOffer_end(response.data.offer_end);
            // setLinked_items(response.data.linked_items);
            setCondition_note(response.data.condition_note);
            setSlug(response.data.slug);

            console.log(response);
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
  console.log(product_id);

  console.log(product);
  const handleFileSelected = (e) => {
    setImage(e.target.files[0]);
  };
  const handleFileSelectedCover = (e) => {
    setCover_image(e.target.files[0]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.getCurrentContent().getPlainText() === '') {
      setVisible(true);
    } else {
      setVisible(false);
    }
    const formData = new FormData();

    if (image === '') {
      setVisibleImageError(true);
    } else {
      setVisibleImageError(false);
      // Update the formData object
      formData.append('image', image);
      // formData.append('cover_image', cover_image);
    }
    formData.append('title', title);
    formData.append('sku', sku);
    formData.append('condition', condition);

    formData.append('active', active);
    formData.append('condition_note', condition_note);
    formData.append('description', description);
    formData.append('stock_quantity', stock_quantity);
    formData.append('min_order_quantity', min_order_quantity);
    formData.append('sale_price', sale_price);
    formData.append('offer_price', 11); /*2020-05-01 06:52 am'*/
    formData.append('offer_start', '2020-05-01 06:52 am');
    formData.append('offer_end', '2020-06-01 07:52 pm');
    // formData.append('linked_items', linked_items);
    formData.append('slug', slug);
    // optionTags.map((ele1) => {
    //   formData.append('tag_list[]', ele1);
    // });
    // optionItems.map((ele1) => {
    //   formData.append('linked_items[]', ele1);
    // });
    // formData.append('_method', 'PUT');
    if (params.id) {
      axios
        .post(`https://amanacart.com/api/admin/stock/inventory/${params.id}/update`, formData, auth)
        .then((response) => {
          console.log(response);
          handleSuccess('ADD SUCCESS');

          setBasicModal(!basicModal);
          window.location.reload();

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
    console.log(formData['name']);
  };
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

  console.log(optionTags);
  // useEffect(() => {
  //   axios
  //     .get(`https://amanacart.com/api/admin/search/product?q=${product_id}`, auth)
  //     .then((response) => {
  //       console.log(response.data);
  //       // setProduct(response.data.data);
  //       // setInactive_listings_data(response.data.inventories.inactive_listings);
  //       // setOut_of_stock_data(response.data.inventories.out_of_stock);
  //       // console.log(response.data);
  //       // setTrashData(response.data.trashes);
  //     })
  //     .catch((error) => {
  //       // console.log(error);
  //       if (error.response) {
  //         console.log(error.response.status);
  //         if (error.response.status === 500) {
  //           handleErrorNetwork(`${error.response.status} internal server error`);
  //           console.log(error.response.status);
  //         } else if (error.response.status === 404) {
  //           handleErrorNetwork(`${error.response.status} no product found`);
  //         } else {
  //           handleError(error.response.data.error);
  //         }
  //       } else {
  //         handleErrorNetwork(`${error}`);
  //       }
  //     });
  // }, []);
  return (
    <div id='dashboard-analytics' className=' bg-white'>
      <Row>
        <Col className='' lg='12' md='12' xs='12'>
          {/* style={{ padding: '10px 10px 0px', margin: '0px' }} */}
          {/* <Label for='title'>UPDATE Warehouse</Label> */}
          {/* <hr style={{ borderColor: 'blue' }} /> */}
          <ModalHeader style={{ borderRadius: '0px' }}>تحديث المخزون</ModalHeader>
        </Col>
      </Row>
      <Row>
        {/* <Col className='' lg='12' md='12' xs='12'>
          <Label for='title' style={{ padding: '10px 10px 0px', margin: '0px' }}>
            UPDATE INVENTORIE
          </Label>
        </Col> */}

        <Row style={{ padding: '10px 20px' }}>
          <Col className='mb-1' lg='12' md='12' xs='12'>
            <Label for='title'>العنوان*</Label>
            <Input type='text' name='title' onChange={(e) => setTitle(e.target.value)} id='title' value={title} required />
          </Col>
          <Col className='mb-1' lg='6' md='6' xs='12'>
            <Label for='sku'>SKU*</Label>
            <Input type='text' name='sku' onChange={(e) => setSku(e.target.value)} id='sku' value={sku} required />
          </Col>
          <Col className='mb-1' lg='4' md='4' xs='12'>
            <Label for='condition'>الشرط *</Label>
            <Input type='select' name='condition' id='condition' onChange={(e) => setCondition(e.target.value)} value={condition} required>
              <option>حدد</option>
              <option value={'New'}>New</option>
              <option value={'Used'}>Used</option>
              <option value={'Refurbished'}>Refurbished</option>
            </Input>{' '}
          </Col>
          <Col className='mb-1' lg='2' md='2' xs='12'>
            <Label for='status'>الحالة *</Label>
            <Input type='select' name='active' id='status' onChange={(e) => setActive(e.target.value)} value={active} required>
              <option>حدد الحالة</option>
              <option value={1}>Active</option>
              <option value={0}>InActive</option>
            </Input>
          </Col>

          <Col className='mb-1' lg='12' md='12' md='12'>
            <Label>ملاحظة الشرط*</Label>
            <Input type='text' name='condition_note' onChange={(e) => setCondition_note(e.target.value)} id='condition_note' value={condition_note} />
          </Col>
          {/* <Col className='mb-1' lg='12' md='12' sm='12' xs='12'>
            <Label for='tags'>TAGS</Label>
            <Select
              isClearable={false}
              theme={selectThemeColors}
              defaultValue=''
              isMulti
              name='tags'
              options={optionTags}
              className='react-select'
              classNamePrefix='select'
              onChange={(e) => setTags(e)}
            />
          </Col> */}
          <Col className='' lg='12' md='12' xs='12'>
            <Label for='title' style={{ padding: '10px 10px 0px', margin: '0px' }}>
              قواعد المخزون
            </Label>
            <hr />
          </Col>
          <Col className='mb-1' lg='12' md='12' md='12'>
            <Label>الوصف*</Label>
            <Input type='text' name='description' onChange={(e) => setDescription(e.target.value)} id='description' value={description} />
          </Col>
          <Col className='mb-1' lg='6' md='6' md='12'>
            <Label>كمية المخزون*</Label>
            <Input type='number' name='stock_quantity' onChange={(e) => setStock_quantity(e.target.value)} id='stock_quantity' value={stock_quantity} />
          </Col>
          <Col className='mb-1' lg='6' md='6' md='12'>
            <Label>اقل كمية طلب*</Label>
            <Input type='number' name='min_order_quantity' onChange={(e) => setmMin_order_quantity(e.target.value)} id='min_order_quantity' value={min_order_quantity} />
          </Col>
          <Col className='mb-1' lg='6' md='6' md='12'>
            <Label>السعر*</Label>
            <Input type='number' name='sale_price' onChange={(e) => setSale_price(e.target.value)} id='sale_price' value={sale_price} />
          </Col>
          <Col className='mb-1' lg='6' md='6' md='12'>
            <Label>سعر العرض *</Label>
            <Input type='number' name='offer_price' onChange={(e) => setOffer_price(e.target.value)} id='offer_price' value={offer_price} />
          </Col>
          <Col className='mb-1' lg='6' md='6' md='12'>
            <Label>تاريخ بدء العرض*</Label>
            <Input type='text' name='offer_start' onChange={(e) => setOffer_start(e.target.value)} id='offer_start' value={offer_start} />
          </Col>
          <Col className='mb-1' lg='6' md='6' md='12'>
            <Label>تاريخ انتهاء العرض*</Label>
            {/* <Flatpickr value={pickerEnd} data-enable-time id='date-time-picker' className='form-control' onChange={(date) => setPickerEnd(date)} /> */}

            <Input type='text' data-enable-time name='offer_end' onChange={(e) => setOffer_end(e.target.value)} id='offer_end' value={offer_end} />
          </Col>

          <Col className='mb-1' lg='12' md='12' sm='12' xs='12'>
            <Label for='itmes'>ITMES</Label>
            <Select
              isClearable={false}
              theme={selectThemeColors}
              defaultValue=''
              isMulti
              name='itmes'
              options={optionItems}
              className='react-select'
              classNamePrefix='select'
              onChange={(e) => setItems(e)}
            />
          </Col>
          <Col lg='12' md='12' sm='12'>
            <FormGroup>
              <Label for='image'>صورة </Label>
              <CustomInput type='file' onChange={(e) => handleFileSelected(e)} id='image' name='image' />
            </FormGroup>
          </Col>
          {/* <Flatpickr value={picker} data-enable-time id='date-time-picker' className='form-control' onChange={(date) => setPicker(date)} /> */}

          <Col className='mb-1 d-flex justify-content-end' xs='12'>
            <Button onClick={handleSubmit} color='primary' type='submit'>
              تحديث
            </Button>
          </Col>
        </Row>
      </Row>
    </div>
  );
};

export default Catalog;
