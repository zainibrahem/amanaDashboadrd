import { useContext, useState, useEffect } from 'react';
import { List, Plus, ChevronDown, ChevronUp, Trash2 } from 'react-feather';
import { CustomInput, FormGroup, Card, CardHeader, CardTitle, Button, Input, Label, Badge, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TableWithButtons from '../tables/data-tables/basic/TableWithButtons';
import NumberInput from '@components/number-input';
import { EditorState } from 'draft-js';
import { AvForm, AvGroup, AvField, AvInput, AvFeedback, AvRadioGroup, AvCheckboxGroup, AvRadio, AvCheckbox } from 'availity-reactstrap-validation-safe';
// ** Table Data & Columns
import { Columns, ColumnsTrash } from '../tables/data-tables/rolData';
import '@styles/react/libs/charts/apex-charts.scss';

//api
import axios from 'axios';

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';

//alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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
  const [data, setdata] = useState([]);
  useEffect(() => {
    axios.get('https://amanacart.com/api/admin/setting/role', auth).then((response) => {
      setdata(response.data.roles);
      setTrashData(response.data.trashes);
    });
  }, []);

  const [permission, setPermission] = useState([]);

  useEffect(() => {
    axios.get('https://amanacart.com/api/admin/setting/role/create', auth).then((response) => {
      setPermission(response.data.permissions);
    });
  }, []);

  const [visibleImageError, setVisibleImageError] = useState('');
  const [visible, setVisible] = useState('');

  //init input value
  // const [image, setImage] = useState('');

  const [active, setActive] = useState('1');

  //init input value

  //    const [active, setActive] = useState(null);
  // const [permissionList, setPermissionList] = useState([]);
  const [name, setName] = useState(null);
  const [level, setLevel] = useState(null);
  const [description, setDescription] = useState(null);
  const permissionList = [];
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

  //handle empty trash
  // const handleTrash = () => {
  //   axios
  //     .delete('https://amanacart.com/api/admin/admin/user/emptyTrash', auth)
  //     .then((response) => {
  //       console.log(response);
  //       handleSuccess('EMPTY TRASH SUCCESS');
  //       window.location.reload();
  //     })
  //     .catch((error) => {
  //       console.error(error.response);
  //       handleError(error.response.data.error.name);
  //     });
  // };

  const handleFileSelected = (e) => {
    setImage(e.target.files[0]);
  };
  const handleFileSelectedCover = (e) => {
    setCover_image(e.target.files[0]);
  };

  const hundelPermission = (e, id) => {
    if (e.target.checked) {
      permissionList.push(id);
      console.log(permissionList);
    } else {
      const index = permissionList.indexOf(id);
      if (index > -1) {
        permissionList.splice(index, 1);
      }
      console.log(permissionList);

      // let idN = permissionList.filter((e) => e !== id);
      // setPermissionList(idN);
    }
  };
  const hundelAddRole = (e) => {
    e.preventDefault();

    const formData = new FormData();
    permissionList.map((ele1) => {
      formData.append('permissions[]', ele1);
    });
    formData.append('name', name);
    formData.append('level', level);
    formData.append('description', description);
    // formData.append('permissions[]', permissionList);
    // formData.append('active', active);
    // formData.append('_method', 'PUT');

    axios
      .post(`https://amanacart.com/api/admin/setting/role`, formData, auth)
      .then((response) => {
        console.log(response);
        handleSuccess('تمت العملية بنجاح');

        window.location.reload();

        // setBasicModal(!basicModal);
        // return response;
      })
      .catch((error) => {
        console.log(error.response);
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
  const handleTrash = () => {
    if (trashData.length > 0) {
      axios
        .delete('https://amanacart.com/api/admin/setting/role/emptyTrash', auth)
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
            handleErrorNetwork(`${error} Error network`);
          }
        });
    }
  };

  return (
    <div id='dashboard-analytics'>
      <Row className='match-height mt-5'>
        <Col md='12' xs='12'>
          <Card className='m-0'>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
              <CardTitle tag='h4'>القواعد</CardTitle>
              <Button className='ml-2' color='primary' onClick={() => setBasicModal(!basicModal)}>
                <Plus size={15} />
                اضافة قاعدة
              </Button>
            </CardHeader>
          </Card>
        </Col>
        <Col>
          <TableWithButtons columns={Columns} data={data} />
        </Col>
      </Row>
      <Row className='match-height'>
        <Col md='12' xs='12'>
          <Card className='m-0'>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
              <CardTitle tag='h4'>سلة المهملات</CardTitle>
              <Button className='ml-2' color='primary' onClick={(e) => handleTrash(e)}>
                <Plus size={15} />
                حذف سلة المهملات
              </Button>
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
          <Row>
            <Col className='mb-1' lg='10' md='8' xs='12'>
              <Label for='name'>NAME*</Label>
              <Input type='text' name='name' id='name' onChange={(e) => setName(e.target.value)} />
            </Col>
            <Col className='mb-1' lg='2' md='4' xs='12'>
              <Label for='level'>ROLE LEVEL *</Label>
              <Input type='number' name='level' id='level' onChange={(e) => setLevel(e.target.value)} />
              {/* <AvFeedback>the number must be</AvFeedback> */}
            </Col>
            <Col className='mb-1' lg='12' md='12' xs='12'>
              <Label for='description'>DESCRIPTION *</Label>
              <Input type='text' name='description' id='description' onChange={(e) => setDescription(e.target.value)} />
            </Col>

            {/* <CustomInput inline type='checkbox' id='exampleCustomCheckbox' label='Checked' defaultChecked /> */}
            {permission &&
              permission.length > 0 &&
              permission.map((e) => {
                return (
                  <>
                    <Col className='mb-1' lg='12' md='12' xs='12' key={e.permissions.module_id} className='d-flex'>
                      <Label for='value' xs={3}>
                        {e.name}*
                      </Label>
                      <div xs={9}>
                        {e.permissions.map((el) => {
                          return <CustomInput inline type='checkbox' id={el.id} label={el.name} onClick={(e) => hundelPermission(e, el.id)} />;
                        })}
                      </div>
                    </Col>
                  </>
                );
              })}

            <Col className='mb-1 d-flex justify-content-end' xs='12'>
              <Button color='primary' type='submit' onClick={(e) => hundelAddRole(e)}>
                SAVE
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Catalog;
