import { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Editor } from 'react-draft-wysiwyg';
import Select, { components } from 'react-select';
import { selectThemeColors } from '@utils';
import Flatpickr from 'react-flatpickr';

import { List, Plus, ChevronDown, ChevronUp } from 'react-feather';
import { CustomInput, FormGroup, Card, CardHeader, CardTitle, Button, Input, Label, Badge, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import NumberInput from '@components/number-input';
import { EditorState } from 'draft-js';
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
  const {
    match: { params },
  } = props;
  const MySwal = withReactContent(Swal);
  const [basicModal, setBasicModal] = useState(false);

  // init headers auth
  const config = useJwt.jwtConfig;
  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };
  const [visibleImageError, setVisibleImageError] = useState('');
  const history = useHistory();

  const [value, setValue] = useState(EditorState.createEmpty());
  //init input value

  const [title, setTitle] = useState(null);
  const [sku, setSku] = useState(null);
  const [slug, setSlug] = useState(null);

  const [condition, setCondition] = useState('');
  const [active, setActive] = useState('1');
  const [condition_note, setCondition_note] = useState(null);
  const [description, setDescription] = useState(null);
  const [image, setImage] = useState('');

  const [stock_quantity, setStock_quantity] = useState(null);
  const [min_order_quantity, setMin_order_quantity] = useState(null);
  const [sale_price, setSale_price] = useState(null);
  const [offer_price, setOffer_price] = useState(null);
  const [offer_start, setOffer_start] = useState(null);
  const [offer_end, setOffer_end] = useState(null);
  const [visible, setVisible] = useState('');
  const [tags, setTags] = useState({ tags: [] });
  const [items, setItems] = useState({ items: [] });

  const [optionTags, setOptionTags] = useState({ optionTags: [] });
  const [optionItems, setOptionItems] = useState({ optionItems: [] });

  // const [picker, setPicker] = useState(new Date());

  //fetch data from api
  const hundeErrorText = (errMsg) => {
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
      text: `${errMsg} `,
      icon: 'error',
      customClass: {
        confirmButton: 'btn btn-primary',
      },
      buttonsStyling: false,
    });
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
  useEffect(() => {
    axios
      .get(`https://amanacart.com/api/admin/stock/inventory/${params.id}`, auth)
      .then((response) => {
        setTags({ tags: response.data.tags });
        setItems({ items: response.data.items });
        setTitle(response.data.title);
        setSku(response.data.sku);
        setSlug(response.data.slug);
        setCondition(response.data.condition);
        setActive(response.data.active);
        setCondition_note(response.data.condition_note);
        setDescription(response.data.description.replace(/(<([^>]+)>)/gi, ''));
        setStock_quantity(response.data.stock_quantity);
        setMin_order_quantity(response.data.min_order_quantity);
        setSale_price(response.data.sale_price);
        setOffer_price(response.data.offer_price);
        setOffer_start(response.data.offer_start);
        setOffer_end(response.data.offer_end);
        const arrayItems = [];
        const array = [];

        response.data.tags
          ? Object.keys(response.data.tags || {}).map((ele) => {
              array.push({ value: ele, label: response.data.tags[ele] });
            })
          : '';
        response.data.items
          ? Object.keys(response.data.items || {}).map((ele) => {
              arrayItems.push({ value: ele, label: response.data.items[ele] });
            })
          : '';
        console.log(response.data);
        setOptionTags(array);
        setOptionItems(arrayItems);
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
            handleError(`${error.response.data.error} `);
          }
        } else {
          handleErrorNetwork(`${error} `);
        }
      });
  }, []);
  console.log(tags);
  console.log(optionTags);
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
      // formData.append('cover_image', cover_image, cover_image.name);
    }
    optionTags.map((ele1) => {
      formData.append('tag_list[]', ele1);
    });
    optionItems.map((ele1) => {
      formData.append('linked_items[]', ele1);
    });
    formData.append('product_id', params.id);

    formData.append('title', title);
    formData.append('sku', sku);
    formData.append('slug', slug);

    formData.append('condition', condition);
    formData.append('description', value.getCurrentContent().getPlainText());
    formData.append('active', active);
    formData.append('condition_note', condition_note);

    formData.append('stock_quantity', stock_quantity);
    formData.append('min_order_quantity', min_order_quantity);
    formData.append('sale_price', sale_price);
    formData.append('offer_price', offer_price);
    formData.append('offer_start', offer_start);

    formData.append('offer_end', offer_end);

    axios
      .post('https://amanacart.com/api/admin/stock/inventory/store', formData, auth)
      .then((response) => {
        console.log(response);
        handleSuccess('ADD SUCCESS');
        setBasicModal(!basicModal);
        history.push('/stock/inventories');
      })
      .catch((error) => {
        // console.log(error);
        if (error.response) {
          console.log(error.response.status);
          if (error.response.status === 500) {
            handleErrorNetwork(` the date must be like:2021-07-30 01:14 am `);
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
  return (
    <div id='dashboard-analytics' className=' bg-white'>
      <Row>
        <Col className='' lg='12' md='12' xs='12'>
          {/* style={{ padding: '10px 10px 0px', margin: '0px' }} */}
          {/* <Label for='title'>UPDATE Warehouse</Label> */}
          {/* <hr style={{ borderColor: 'blue' }} /> */}
          <ModalHeader>أضف المخزون</ModalHeader>
        </Col>
      </Row>
      <Row>
        <Row style={{ padding: '10px 20px' }}>
          <Col className='mb-1' lg='12' md='12' xs='12'>
            <Label for='title'>العنوان*</Label>
            <Input type='text' name='title' id='title' onChange={(e) => setTitle(e.target.value)} value={title} required />
          </Col>
          <Col className='mb-1' lg='6' md='6' xs='12'>
            <Label for='sku'>SKU*</Label>
            <Input type='text' name='sku' id='sku' onChange={(e) => setSku(e.target.value)} value={sku} required />
          </Col>
          <Col className='mb-1' lg='4' md='4' xs='12'>
            <Label for='condition'>الشرط *</Label>
            <Input type='select' name='condition' id='condition' onChange={(e) => setCondition(e.target.value)} value={condition} required>
              <option>تحديد</option>
              <option value={'New'}>New</option>
              <option value={'Used'}>Used</option>
              <option value={'Refurbished'}>Refurbished</option>
            </Input>
          </Col>
          <Col className='mb-1' lg='2' md='2' xs='12'>
            <Label for='status'>الحالة *</Label>
            <Input type='select' name='active' id='status' onChange={(e) => setActive(e.target.value)} value={active} required>
              <option>Select Status</option>
              <option value={true}>Active</option>
              <option value={false}>InActive</option>
            </Input>
          </Col>
          <Col className='mb-1' lg='12' md='12' xs='12'>
            <Label for='condition_note'>ملاحظة الشرط*</Label>
            <Input type='text' name='condition_note' id='condition_note' onChange={(e) => setCondition_note(e.target.value)} value={condition_note} required />
          </Col>
          <Col className='mb-1' lg='12' md='12' xs='12'>
            <Label for='slug'> SLUG*</Label>
            <Input type='text' name='slug' id='slug' onChange={(e) => setSlug(e.target.value)} value={slug} required />
          </Col>
          {/* editorState={value} onEditorStateChange={(data) => setValue(data)} */}
          {/* <Editor  name='description' id='description' required placeholder='Start From here' /> */}

          <Col className='mb-1' lg='12' md='12' md='12'>
            <Label>الوصف*</Label>
            <Input type='text' type='text' name='description' id='description' onChange={(e) => setDescription(e.target.value)} value={description} readOnly />
          </Col>
          <Col lg='12' md='12' sm='12'>
            <FormGroup>
              <Label for='image'>صورة</Label>
              {/* onChange={(e) => handleFileSelected(e)} */}
              <CustomInput type='file' onChange={(e) => handleFileSelected(e)} id='image' name='image' />
            </FormGroup>
          </Col>
          <Col>
            <Label for='tags'>العلامات</Label>
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
          </Col>
          <Col className='' lg='12' md='12' xs='12'>
            {/* style={{ padding: '10px 10px 0px', margin: '0px' }} */}
            {/* <Label for='title'>UPDATE Warehouse</Label> */}
            {/* <hr style={{ borderColor: 'blue' }} /> */}
            <ModalHeader>قواعد الصورة</ModalHeader>
          </Col>
          <Col className='mb-1' lg='6' md='6' xs='12'>
            <Label for='stock_quantity'>كمية المخزون*</Label>
            <Input type='number' name='stock_quantity' id='stock_quantity' onChange={(e) => setStock_quantity(e.target.value)} value={stock_quantity} required />
          </Col>
          <Col className='mb-1' lg='6' md='6' xs='12'>
            <Label for='min_order_quantity'>الحد الادنى للطلب *</Label>
            <Input type='number' name='min_order_quantity' id='min_order_quantity' onChange={(e) => setMin_order_quantity(e.target.value)} value={min_order_quantity} required />
          </Col>
          <Col className='mb-1' lg='6' md='6' xs='12'>
            <Label for='price'>السعر *</Label>
            <Input type='number' name='price' id='price' onChange={(e) => setSale_price(e.target.value)} value={sale_price} required />
          </Col>
          <Col className='mb-1' lg='6' md='6' xs='12'>
            <Label for='offer_price'>سعر العرض *</Label>
            <Input type='number' name='offer_price' id='offer_price' onChange={(e) => setOffer_price(e.target.value)} value={offer_price} required />
          </Col>
          <Col className='mb-1' lg='6' md='6' xs='12'>
            <Label for='offer_start'>تاريخ بدء العرض*</Label>
            <Input type='text' name='offer_start' id='offer_start' required onChange={(e) => setOffer_start(e.target.value)} value={offer_start} placeholder='2021-06-30 09:14 pm' />
            {/* <Flatpickr
              value={picker}
              id='offer_start'
              className='form-control'
              onChange={(date) => setPicker(date)}
              options={{
                altInput: true,
                altFormat: 'F j, Y',
                dateFormat: 'Y-m-d',
                enableTime: true,
                noCalendar: false,
              }}
            /> */}
          </Col>
          <Col className='mb-1' lg='6' md='6' xs='12'>
            <Label for='offer_end'>تاريخ نهاية العرض*</Label>
            <Input type='text' name='offer_end' id='offer_end' required onChange={(e) => setOffer_end(e.target.value)} value={offer_end} placeholder='2021-07-30 01:14 am' />
          </Col>
          <Col>
            <Label for='itmes'>العناصر</Label>
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

          <Col className='mb-1 d-flex justify-content-end mt-5' xs='12'>
            <Button color='primary' type='submit' onClick={handleSubmit}>
              اضافة مخزون
            </Button>
          </Col>
        </Row>
      </Row>
    </div>
  );
};

export default Catalog;
