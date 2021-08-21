// ** Dropdowns Imports
import IntlDropdown from './IntlDropdown';
import CartDropdown from './CartDropdown';
import UserDropdown from './UserDropdown';
import NavbarSearch from './NavbarSearch';
import NotificationDropdown from './NotificationDropdown';
import NotificationMessage from './notifyMessage';
import { useState, useEffect } from 'react';
import axios from 'axios';
import NotificationAdvirstis from './notifyAdverstis';

// ** Third Party Components
import { Sun, Moon } from 'react-feather';
import { NavItem, NavLink } from 'reactstrap';
import useJwt from '@src/auth/jwt/useJwt';
import { Link } from 'react-router-dom';
//alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './style.css';
const NavbarUser = (props) => {
  // ** Props
  const { skin, setSkin } = props;

  // ** Function to toggle Theme (Light/Dark)
  // const ThemeToggler = () => {
  //   if (skin === 'dark') {
  //     return <Sun className='ficon' onClick={() => setSkin('light')} />
  //   } else {
  //     return <Moon className='ficon' onClick={() => setSkin('dark')} />
  //   }
  // }
  const config = useJwt.jwtConfig;

  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${localStorage.getItem('token')}`,
    },
  };
  const MySwal = withReactContent(Swal);
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
  const [balance, setBalance] = useState(null);
  useEffect(() => {
    axios
      .get('https://amanacart.com/api/admin/notifications', auth)
      .then((response) => {
        console.log(response.data);
        setBalance(response.data.balance);
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

  return (
    <ul className='nav navbar-nav align-items-center ml-auto'>
      {/* <IntlDropdown /> */}
      {/* <NavItem className='d-none d-lg-block'>
        <NavLink className='nav-link-style'>
          <ThemeToggler />
        </NavLink>
      </NavItem> */}
      {/* <NavbarSearch /> */}
      {/* { <CartDropdown />  */}
      <div className='nav-item mr-25  d-none d-lg-block' style={{ padding: '0px 6px' }}>
        الرصيد:<span className='number'>{balance ? balance : '0'} ر.ع</span>
      </div>

      <NotificationAdvirstis />
      <NotificationMessage />
      <NotificationDropdown />
      <UserDropdown />
    </ul>
  );
};
export default NavbarUser;
