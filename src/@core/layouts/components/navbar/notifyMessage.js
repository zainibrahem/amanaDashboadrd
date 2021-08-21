// ** React Imports
import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
// ** Custom Components
import Avatar from '@components/avatar';
// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';

//alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// ** Third Party Components
import classnames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { MessageSquare, X, Check, AlertTriangle } from 'react-feather';
import { Button, Badge, Media, CustomInput, DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

const NotificationMessage = () => {
  const config = useJwt.jwtConfig;

  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${localStorage.getItem('token')}`,
    },
  };
  // alert success
  const MySwal = withReactContent(Swal);

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
  const [notification, setNotification] = useState([]);
  const [notify_count, setNotify_count] = useState('');
  useEffect(() => {
    axios
      .get('https://amanacart.com/api/admin/notifications', auth)
      .then((response) => {
        console.log(response.data);
        setNotification(response.data.messages);
        setNotify_count(response.data.messages_count);
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

  // ** Notification Array
  // const notificationsArray = [
  //   {
  //     img: require('@src/assets/images/portrait/small/avatar-s-15.jpg').default,
  //     subtitle: 'Won the monthly best seller badge.',
  //     title: (
  //       <Media tag='p' heading>
  //         <span className='font-weight-bolder'>Congratulation Sam 🎉</span>winner!
  //       </Media>
  //     ),
  //   },
  //   {
  //     img: require('@src/assets/images/portrait/small/avatar-s-3.jpg').default,
  //     subtitle: 'You have 10 unread messages.',
  //     title: (
  //       <Media tag='p' heading>
  //         <span className='font-weight-bolder'>New message</span>&nbsp;received
  //       </Media>
  //     ),
  //   },
  //   {
  //     avatarContent: 'MD',
  //     color: 'light-danger',
  //     subtitle: 'MD Inc. order updated',
  //     title: (
  //       <Media tag='p' heading>
  //         <span className='font-weight-bolder'>Revised Order 👋</span>&nbsp;checkout
  //       </Media>
  //     ),
  //   },
  //   {
  //     title: <h6 className='font-weight-bolder mr-auto mb-0'>System Notifications</h6>,
  //     switch: <CustomInput type='switch' id='primary' name='primary' inline defaultChecked />,
  //   },
  //   {
  //     avatarIcon: <X size={14} />,
  //     color: 'light-danger',
  //     subtitle: 'USA Server is down due to hight CPU usage',
  //     title: (
  //       <Media tag='p' heading>
  //         <span className='font-weight-bolder'>Server down</span>&nbsp;registered
  //       </Media>
  //     ),
  //   },
  //   {
  //     avatarIcon: <Check size={14} />,
  //     color: 'light-success',
  //     subtitle: 'Last month sales report generated',
  //     title: (
  //       <Media tag='p' heading>
  //         <span className='font-weight-bolder'>Sales report</span>&nbsp;generated
  //       </Media>
  //     ),
  //   },
  //   {
  //     avatarIcon: <AlertTriangle size={14} />,
  //     color: 'light-warning',
  //     subtitle: 'BLR Server using high memory',
  //     title: (
  //       <Media tag='p' heading>
  //         <span className='font-weight-bolder'>High memory</span>&nbsp;usage
  //       </Media>
  //     ),
  //   },
  // ];

  // ** Function to render Notifications
  /*eslint-disable */
  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component='li'
        className='media-list scrollable-container'
        options={{
          wheelPropagation: false,
        }}
      >
        {notification && notification.length > 0 ? (
          notification.map((item, index) => {
            return (
              <a key={index} className='d-flex' href='/' onClick={(e) => e.preventDefault()}>
                <Media
                // className={classnames('d-flex', {
                //   'align-items-start': !item.switch,
                //   'align-items-center': item.switch,
                // })}
                >
                  <Fragment>
                    <Media body>
                      {item.user}
                      <small className='notification-text'>{item.name}</small>
                    </Media>
                  </Fragment>
                </Media>
              </a>
            );
          })
        ) : (
          <>
            <a className='d-flex' href='/' onClick={(e) => e.preventDefault()}>
              <Media
              // className={classnames('d-flex', {
              //   'align-items-start': !item.switch,
              //   'align-items-center': item.switch,
              // })}
              >
                <Fragment>
                  <Media body>
                    <small className='notification-text'>لا يوجد رسائل</small>
                  </Media>
                </Fragment>
              </Media>
            </a>
          </>
        )}
      </PerfectScrollbar>
    );
  };
  /*eslint-enable */

  return (
    <UncontrolledDropdown tag='li' className='dropdown-notification nav-item mr-25'>
      <DropdownToggle tag='a' className='nav-link' href='/' onClick={(e) => e.preventDefault()}>
        <MessageSquare size={21} />
        <Badge pill color='danger' className='badge-up'>
          {notify_count}
        </Badge>
      </DropdownToggle>
      <DropdownMenu tag='ul' right className='dropdown-menu-media mt-0'>
        <li className='dropdown-menu-header'>
          <DropdownItem className='d-flex' tag='div' header>
            <h4 className='notification-title mb-0 mr-auto'>الاشعارات</h4>
            <Badge tag='div' color='light-primary' pill>
              {notify_count}
            </Badge>
          </DropdownItem>
        </li>
        {renderNotificationItems()}
        {/* <li className='dropdown-menu-footer'>
          {notify_count > 0 ? (
            <Button.Ripple color='primary' block>
              Read all notifications
            </Button.Ripple>
          ) : (
            ''
          )}
        </li> */}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default NotificationMessage;
