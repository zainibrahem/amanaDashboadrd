import { useContext, useState, useEffect } from 'react';
import { List, Plus, ChevronDown, ChevronUp, Trash2, User, CornerUpLeft } from 'react-feather';
import CardAction from '@components/card-actions';
import { useHistory, Link } from 'react-router-dom';
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
} from 'reactstrap';

// ** Table Data & Columns
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

  const {
    match: { params },
  } = props;
  //init alert
  const MySwal = withReactContent(Swal);
  const history = useHistory();

  // init headers auth
  const config = useJwt.jwtConfig;
  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };

  const [activeNav, setActiveNav] = useState(localStorage.getItem('id'));
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

  const [replies, setReplies] = useState([]);
  const [reply, setReply] = useState(null);
  const [image, setImage] = useState('');

  const handleFileSelected = (e) => {
    setImage(e.target.files[0]);
  };

  useEffect(() => {
      axios
        .get(`https://amanacart.com/api/admin/ticket`, auth)
        .then((response) => {
          try {
            console.log(response.data);
            setdata(response.data);
            setReplies(response.data.replies);

            console.log('datasssss');
            console.log(data);
          } catch (e) {
            console.log('response, e');
            console.log(response, e);
          }
          // return response;
        })
        .catch((error) => {
          console.log('responsessssssssss, e');
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

  const hundelDelete = (e) => {
    e.preventDefault();
    axios
      .delete(`https://amanacart.com/api/admin/ticket/${params.id}/archive`, auth)
      .then((response) => {
        console.log(response);
        handleSuccess('تمت العملية بنجاح');
        history.push('/tickets');
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

  const hundelResponse = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('reply', reply);
    formData.append('attachments', image);

    axios
      .post(`https://amanacart.com/api/admin/ticket/${params.id}/storeReply`, formData, auth)
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
    <Row className=' mt-5'>
     </Row>
  );
};
export default Catalog;
