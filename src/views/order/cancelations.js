import { useContext, useState, useEffect } from 'react';
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
import { Columns, ColumnsTrash } from '../tables/data-tables/cancelationData';
import '@styles/react/libs/charts/apex-charts.scss';
import './style.css';

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
  const [data, setdata] = useState([]);
  const [archivedData, setArchivedData] = useState([]);

  useEffect(() => {
    axios.get('https://amanacart.com/api/admin/order/cancellation', auth).then((response) => {
      setdata(response.data.all);
      setArchivedData(response.data.archived);
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
  const handleError = (msg) => {
    return MySwal.fire({
      title: 'Error!',
      text: msg,
      icon: 'error',
      customClass: {
        confirmButton: 'btn btn-primary',
      },
      buttonsStyling: false,
    });
  };

  //handle empty trash
  const handleTrash = () => {
    axios
      .delete('https://amanacart.com/api/admin/catalog/suppliers/emptyTrash', auth)
      .then((response) => {
        console.log(response);
        handleSuccess('EMPTY TRASH SUCCESS');
        window.location.reload();
      })
      .catch((error) => {
        console.error(error.response);
        handleError(error.response.data.error.name);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.getCurrentContent().getPlainText() === '') {
      setVisible(true);
    } else {
      setVisible(false);
    }

    const formData = new FormData();
    const formDataCover = new FormData();

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
        console.log(error);
        handleError(` ${error}`);
        console.log(error);
      });

    console.log(formData['name']);
  };
  const handleFileSelected = (e) => {
    setImage(e.target.files[0]);
  };
  const handleFileSelectedCover = (e) => {
    setCover_image(e.target.files[0]);
  };
  const [activeTap, setActiveTap] = useState('1');
  const toggle = (tab) => {
    if (activeTap !== tab) {
      setActiveTap(tab);
    }
  };
  return (
    <div id='dashboard-analytics'>
      <Row className='match-height'>
        <Col md='12' xs='12'>
          <Card className='m-0' style={{ borderRadius: '0px' }}>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start' style={{ padding: '0rem' }}>
              <Nav tabs style={{ marginBottom: '0rem', width: '100%' }}>
                <NavItem style={{ width: '50%' }}>
                  <NavLink
                    active={activeTap === '1'}
                    onClick={() => {
                      toggle('1');
                    }}
                    style={{ padding: '20px' }}
                  >
                    <Home size={14} />
                    مفتوح
                  </NavLink>
                </NavItem>
                <NavItem style={{ width: '50%' }}>
                  <NavLink
                    active={activeTap === '2'}
                    onClick={() => {
                      toggle('2');
                    }}
                    style={{ padding: '20px' }}
                  >
                    <Settings size={14} />
                    مأرشف
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
        </TabPane>
        <TabPane tabId='2'>
          <Row className='match-height'>
            <Col>
              <TableWithButtons columns={Columns} data={archivedData} />
            </Col>
          </Row>
        </TabPane>
      </TabContent>

      <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-dialog-centered modal-lg'>
        <ModalHeader toggle={() => setBasicModal(!basicModal)}>FORM</ModalHeader>
        <ModalBody>
          <Row>
            <Col className='mb-1' lg='8' md='8' xs='12'>
              <Label for='name'>NAME*</Label>
              <Input type='text' name='name' onChange={(e) => setName(e.target.value)} id='name' value={name} required />
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
              <Label for='email'>EMAIL ADDRESS*</Label>
              <Input type='email' name='email' onChange={(e) => setEmail(e.target.value)} id='email' value={email} required />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='contact_person'>CONTACT PERSON*</Label>
              <Input type='text' name='contact_person' onChange={(e) => setContactPerson(e.target.value)} id='contact_person' value={contact_person} />
            </Col>

            <Col className='mb-1' lg='6' md='6' md='12'>
              <Label>DESCRIPTION*</Label>
              <Input type='textarea' type='text' name='description' onChange={(e) => setDescription(e.target.value)} id='description' value={description} />
            </Col>
            {/* <Col md='6' sm='12'>
              <FormGroup>
                <Label for='image'>BRAND LOGO </Label>
                <CustomInput type='file' onChange={(e) => handleFileSelected(e)} id='image' name='image' />
              </FormGroup>
            </Col> */}

            <Col className='mb-1 d-flex justify-content-end' xs='12'>
              <Button onClick={handleSubmit} color='primary' type='submit'>
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
