// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
const config = useJwt.jwtConfig;
const MySwal = withReactContent(Swal);

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
// ** Handle User Login
export const handleLogin = (data) => {
  return (dispatch) => {
    // dispatch({
    //   type: 'LOGIN',
    //   data,
    //   config,
    //   [config.storageTokenKeyName]: localStorage.getItem('token'),
    //   [config.storageRefreshTokenKeyName]: localStorage.getItem('token'),
    // });
    dispatch({
      type: 'LOGIN',
      data,
      config,
      [config.storageTokenKeyName]: data['accessToken'],
      [config.storageRefreshTokenKeyName]: data['accessToken'],
    });

    // ** Add to user, accessToken & refreshToken to localStorage
    localStorage.setItem('userData', JSON.stringify(data));
    localStorage.setItem(config.storageTokenKeyName, data['accessToken']);
    localStorage.setItem(config.storageRefreshTokenKeyName, data['accessToken']);
  };
};
// export const handleRegester = (data) => {
//   return (dispatch) => {
//     // dispatch({
//     //   type: 'LOGIN',
//     //   data,
//     //   config,
//     //   [config.storageTokenKeyName]: localStorage.getItem('token'),
//     //   [config.storageRefreshTokenKeyName]: localStorage.getItem('token'),
//     // });
//     dispatch({
//       type: 'REGISTER',
//       data,
//       config,
//       [config.storageTokenKeyName]: data['accessToken'],
//       [config.storageRefreshTokenKeyName]: data['accessToken'],
//     });

//     // ** Add to user, accessToken & refreshToken to localStorage
//     localStorage.setItem('userData', JSON.stringify(data));
//     localStorage.setItem(config.storageTokenKeyName, data['accessToken']);
//     localStorage.setItem(config.storageRefreshTokenKeyName, data['accessToken']);
//   };
// };
const auth = {
  headers: {
    Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
  },
};

// ** Handle User Logout
export const handleLogout = () => {
  axios
    .post(`https://amanacart.com/api/admin/auth/logout`, auth)
    .then((response) => {
      console.log(response.data);
      // localStorage.removeItem('token', response.data.api_token);
      handleSuccess('ADD SUCCESS');

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
  return (dispatch) => {
    dispatch({ type: 'LOGOUT', [config.storageTokenKeyName]: null, [config.storageRefreshTokenKeyName]: null });

    // ** Remove user, accessToken & refreshToken from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem(config.storageTokenKeyName);
    localStorage.removeItem(config.storageRefreshTokenKeyName);
  };
};
