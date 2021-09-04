import React, { useEffect, useState } from 'react';
import { Label, CustomInput, Input, Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, Button, Card, CardHeader, CardTitle, CardBody, Alert } from 'reactstrap';
import Select, { components } from 'react-select';
import { selectThemeColors } from '@utils';
import NumberInput from '@components/number-input';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '@styles/react/libs/editor/editor.scss';

import FileUploaderMulti from '../forms/form-elements/file-uploader/FileUploaderMulti';
import 'uppy/dist/uppy.css';
import '@uppy/status-bar/dist/style.css';
import '@styles/react/libs/file-uploader/file-uploader.scss';

import { Printer, TrendingUp, Users, Zap, Box, ChevronDown, ChevronUp, AlertCircle } from 'react-feather';

//api
import axios from 'axios';

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';

//alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

//validation input value
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation-safe';

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss';
import { array } from 'prop-types';
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
const EcommerceDashboard = () => {
  const [value, setValue] = useState(EditorState.createEmpty());
  const [visible, setVisible] = useState('');
  const [visibleCatError, setVisibleCatError] = useState('');
  const [visibleImageError, setVisibleImageError] = useState('');
  const [countries, setCountries] = useState({ countries: [] });
  const [gtin_types, setGtin_types] = useState({ gtin_types: [] });
  const [manufacturer, setManufacturer] = useState({ manufacturer: [] });
  const [status, setStatus] = useState({ status: [] });
  const [tags, setTags] = useState({ tags: [] });
  const [optionTags, setOptionTags] = useState({ optionTags: [] });
  const [categories, setCategories] = useState({ categories: [] });

  //init input value
  const [name, setName] = useState(null);
  const [active, setActive] = useState('1');
  const [mpn, setMpn] = useState(null);
  const [gtinValue, setGtinValue] = useState(null);
  const [gtinTypeValue, setGtinTypeValue] = useState(null);
  const [tagsValue, setTagsValue] = useState([]);
  const [images, setImages] = useState([]);
  const [hasVariant, setHasVariant] = useState(true);
  const [requiresShipping, setRequiresShipping] = useState(true);
  const [featuredImage, setFeaturedImage] = useState('');
  const [cat, setCat] = useState([]);
  const [origin, setOrigin] = useState(null);
  const [brand, setBrand] = useState(null);
  const [modalNumber, setModalNumber] = useState(null);
  const [manufacturerValue, setManufacturerValue] = useState(null);

  const formatGroupLabel = (data) => (
    <div className='d-flex justify-content-between align-center'>
      <strong>
        <span>{data.label}</span>
      </strong>
      <span>{data.options.length}</span>
    </div>
  );
  //init alert
  const MySwal = withReactContent(Swal);

  // init headers auth
  const config = useJwt.jwtConfig;
  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };

  // alert success
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

  //fetch data from api
  useEffect(() => {
    axios
      .get('https://amanacart.com/api/admin/catalog/product/create', auth)
      .then((response) => {
        setTags({ tags: response.data.tags });
        setCountries({ countries: response.data.countries });
        setGtin_types({ gtin_types: response.data.gtin_types });
        setManufacturer({ manufacturer: response.data.manufacturer });
        setStatus({ status: response.data.statuses });
        const array = [];
      
        response.data.tags.map((ele) => {
          array.push({ value: ele.id, label: ele.name });
        });
        setOptionTags(array);
        const arr = [];
        console.log('sddddddddddd')

        response.data.categories.map((ele) => {
          const newOption = [];
          ele.sub_groups.map((i) => {
            newOption.push({ label: i.name, value: i.categories });
          });
         
          const opt = [];
          newOption.map((j) => {
            console.log(j)
            const opt3 = [];
            j.value.map((val) => {
              opt3.push({ label: val.name, value: val.id });
            });
            arr.push({ options: opt3, label: ` ${ele.name}  ${j.label} ` });
          });
        });
        console.log(arr)
        setCategories(arr);
        // console.log("----------------------")
        // console.log(countries)
        // console.log(gtin_types)
        // console.log(manufacturer)
        // console.log(status)
        // console.log(optionTags)
        // console.log(response.data)
        // console.log(tags)
        // console.log(categories)
        // console.log(response.data.categories)
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

  //handle add attribute
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.getCurrentContent().getPlainText() === '') {
      setVisible(true);
    } else {
      setVisible(false);
    }
    if (cat.length === 0) {
      setVisibleCatError(true);
    } else {
      setVisibleCatError(false);
    }
    const formData = new FormData();
    const formDatas = new FormData();
    if (featuredImage === '') {
      setVisibleImageError(true);
    } else {
      setVisibleImageError(false);
      // Update the formData object
      formDatas.append("images['feature']", featuredImage);
    }
    console.log('featuredImage');
    console.log(featuredImage);
    console.log(images);

    images.map((ele1) => {
      formDatas.append('image_list[]', ele1);
    });
    tagsValue.map((ele1) => {
      formDatas.append('tag_list[]', ele1);
    });
    cat.map((ele1) => {
      formDatas.append('category_list[]', ele1);
    });
    formDatas.append('name', name);
    formDatas.append('active', Number(active));
    formDatas.append('mpn', mpn);
    formDatas.append('gtin', gtinValue);
    formDatas.append('gtin_type', gtinTypeValue);
    formDatas.append('description', value.getCurrentContent().getPlainText());

    formDatas.append('has_variant', Number(hasVariant));
    formDatas.append('requires_shipping', requiresShipping);
    formDatas.append('model_number', modalNumber);
    formDatas.append('manufacturer_id', Number(manufacturerValue));
    formDatas.append('brand', brand);
    formDatas.append('origin_country', origin);

    if (name && active && value.getCurrentContent().getPlainText() && cat.length) {
      axios
        .post('https://amanacart.com/api/admin/catalog/product/store', formDatas, auth)
        .then((response) => {
          console.log(response);
          console.log("formDatas['tags_list']");
          console.log(formDatas['image_list']);
          handleSuccess('تمت العملية بنجاح');
          window.location.reload();

          setImages([]);
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
          setImages([]);
        });
    }
  };
  const setCats = (value) => {
    setCat([]);
    const arrays = [];
    value.map((ele) => {
      arrays.push(ele.value);
    });
    setCat(arrays);

    console.log(arrays);
  };

  const handleFileSelected = (e) => {
    console.log(e.target.files[0]);
    setFeaturedImage(e.target.files[0]);
  };
  // specify upload params and url for your files
  const getUploadParams = ({ meta }) => {
    return { url: 'https://httpbin.org/post' };
  };

  // called every time a file's `status` changes

  const handleChangeStatus = ({ meta, file }, status) => {
    if (!images.includes(file)) {
      setImages([...images, file]);
    }
  };
  const setTagss = (e) => {
    const array = [];
    e.map((ele) => {
      array.push(ele.value);
    });
    setTagsValue(array);

    console.log('tagsValue');
    console.log(e);
    console.log(tagsValue);
  };

  // receives array of files that are done uploading when submit button is clicked
  const handleSubmits = (files) => {
    console.log(files.map((f) => f.meta));
  };

  return (
    <div id='dashboard-ecommerce'>
      <AvForm onSubmit={handleSubmit}>
        <Row className='match-height'>
          <Col lg='8' md='12' xs='12'>
            <Card>
              <CardHeader>
                <CardTitle tag='h4'>اضافة منتج</CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col className='mb-1' lg='8' md='8' xs='12'>
                    <AvGroup>
                      <Label for='name'>الاسم*</Label>
                      <AvInput type='text' name='name' onChange={(e) => setName(e.target.value)} id='name' placeholder='' required />
                      <AvFeedback>الرجاء ادخال اسم المنتج!</AvFeedback>
                    </AvGroup>
                  </Col>
                  <Col className='mb-1' lg='4' md='4' xs='12'>
                    <AvGroup>
                      <Label for='status'>الحالة</Label>
                      <AvInput type='select' name='active' id='status' onChange={(e) => setActive(e.target.value)}>
                        {status.status.map((item) => {
                          return (
                            <option value={item.value} key={item.value}>
                              {item.name}
                            </option>
                          );
                        })}
                        <option>حدد</option>
                      </AvInput>
                    </AvGroup>
                  </Col>
                  <Col className='mb-1' md='4' xs='12'>
                    <AvGroup>
                      <Label for='mpn'>MPN</Label>
                      <AvInput type='text' id='mpn' name='mpn' onChange={(e) => setMpn(e.target.value)} placeholder='رقم جزء الشركة المصنعة' />
                    </AvGroup>
                  </Col>
                  <Col className='mb-1' md='4' xs='12'>
                    <AvGroup>
                      <Label for='gtin'>GTIN</Label>
                      <AvInput type='text' id='gtin' onChange={(e) => setGtinValue(e.target.value)} name='gtin' placeholder='رقم عنصر التجارة العالمية' />
                    </AvGroup>
                  </Col>
                  <Col className='mb-1' md='4' xs='12'>
                    <AvGroup>
                      <Label for='gtin_type'>GTIN TYPE</Label>
                      <AvInput type='select' name='gtin_type' onChange={(e) => setGtinTypeValue(e.target.value)} id='gtin_type'>
                        <option vhidden>GTN نوع</option>
                        {gtin_types.gtin_types.map((item) => {
                          return (
                            <option value={item} key={item}>
                              {item}
                            </option>
                          );
                        })}
                      </AvInput>
                    </AvGroup>
                  </Col>
                  <Col className='mb-1' md='12'>
                    <AvGroup>
                      <Label for='description'>الوصف*</Label>
                      <Editor editorState={value} onEditorStateChange={(data) => setValue(data)} name='description' id='description' required placeholder='ابدا من هنا' />
                      <Alert color='danger' isOpen={visible}>
                        <div className='alert-body'>
                          <AlertCircle size={15} /> <span className='ml-1'>الوصف مطلوب</span>
                        </div>
                      </Alert>
                    </AvGroup>
                  </Col>
                  <Col className='mb-1' md='12'>
                    <AvGroup>
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
                        onChange={(e) => setTagss(e)}
                      />
                    </AvGroup>
                  </Col>
                  <Col className='mb-1' md='12'>
                    <Dropzone onChangeStatus={handleChangeStatus} accept='image/*,audio/*,video/*' />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg='4' md='12' xs='12'>
            <Card>
              <CardHeader>
                <CardTitle tag='h5'>منظمة</CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col className='mb-1' md='12'>
                    <Label>قواعد الكاتالوغ</Label>
                    <br />
                    <CustomInput inline type='checkbox' onChange={(e) => setHasVariant(e.target.checked)} id='hash' name='hash' label='له متغير' defaultChecked />
                    <CustomInput inline type='checkbox' onChange={(e) => setRequiresShipping(e.target.checked)} id='requires' name='requires' label='يتطلب الشحن' defaultChecked />
                  </Col>
                  <Col className='mb-1' md='12'>
                    <label>الصور المميزة </label>
                    <CustomInput type='file' onChange={(e) => handleFileSelected(e)} placeholder='الصور المميرة' id='featuredImage' name='customFile' />
                    <Alert color='danger' isOpen={visibleImageError}>
                      <div className='alert-body'>
                        <AlertCircle size={15} /> <span className='ml-1'>هذا الحقل مطلوب</span>
                      </div>
                    </Alert>
                  </Col>
                  <Col className='mb-1' md='12'>
                    <Label for='cat'>التصنيف*</Label>
                    <Select
                      isClearable={false}
                      theme={selectThemeColors}
                      defaultValue=''
                      isMulti
                      name='cat'
                      id='cat'
                      options={categories}
                      formatGroupLabel={formatGroupLabel}
                      className='react-select'
                      classNamePrefix='select'
                      onChange={(e) => setCats(e)}
                    />
                    <Alert color='danger' isOpen={visibleCatError}>
                      <div className='alert-body'>
                        <AlertCircle size={15} /> <span className='ml-1'>هذا الحقل مطلوب</span>
                      </div>
                    </Alert>
                  </Col>
                  <Col className='mb-1' md='12'>
                    <Label for='orgin'>دولة المنشأ</Label>
                    <Input type='select' name='orgin' id='orgin' onChange={(e) => setOrigin(e.target.value)}>
                      <option hidden>حدد</option>
                      {countries.countries.map((item) => {
                        return (
                          <option value={item.id} key={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </Input>
                  </Col>
                  <Col className='mb-1' md='12'>
                    <Label for='brand'>العلامة التجارية</Label>
                    <Input type='text' id='brand' name='brand' placeholder='enter brand name' onChange={(e) => setBrand(e.target.value)} />
                  </Col>
                  <Col className='mb-1' md='12'>
                    <Label for='nodalNumber'>رقم الموديل</Label>
                    <Input type='text' id='nodalNumber' name='nodalNumber' placeholder='enter model number' onChange={(e) => setModalNumber(e.target.value)} />
                  </Col>
                  <Col className='mb-1' md='12'>
                    <Label for='manufacturer'>الشركة المصنعة</Label>
                    <Input type='select' name='manufacturer' id='manufacturer' onChange={(e) => setManufacturerValue(e.target.value)}>
                      <option hidden> حدد</option>
                      {manufacturer.manufacturer.map((item) => {
                        return (
                          <option value={item.id} key={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </Input>
                  </Col>
                  <Col className='mb-1' md='12'>
                    <Button color='info'>حفظ</Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </AvForm>
    </div>
  );
};

export default EcommerceDashboard;
