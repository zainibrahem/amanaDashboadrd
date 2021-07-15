// ** React Imports
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// ** Custom Components
import Avatar from '@components/avatar';

// ** Utils
import { isUserLoggedIn } from '@utils';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { handleLogout } from '@store/actions/auth';
import useJwt from '@src/auth/jwt/useJwt';
import axios from 'axios';
// ** Third Party Components
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import { User, Mail, CheckSquare, MessageSquare, Settings, CreditCard, HelpCircle, Power } from 'react-feather';

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-11.jpg';

const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch();

  // ** State
  const [userData, setUserData] = useState(null);

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')));
    }
  }, []);

  //** Vars
  const userAvatar = (userData && userData.avatar) || defaultAvatar;
  const config = useJwt.jwtConfig;
  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get('https://amanacart.com/api/admin/profile', auth).then((response) => {
      console.log(response.data);
      setData(response.data.profile);
      // setdata(response.data.disputes);
      // console.log(response.data);
      // setTrashData(response.data.closed);
    });
  }, []);

  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={(e) => e.preventDefault()}>
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name font-weight-bold'>{(data && data.nice_name) || ''}</span>
          {/* <span className='user-status'>{(userData && userData.role) || 'Admin'}</span> */}
        </div>
        <Avatar img={data.avatar} imgHeight='40' imgWidth='40' status='online' />
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem tag={Link} to='/pages/profile'>
          <User size={14} className='mr-75' />
          <span className='align-middle'>الملف الشخصي</span>
        </DropdownItem>
        <DropdownItem tag={Link} to='/supportDisk/messages'>
          <Mail size={14} className='mr-75' />
          <span className='align-middle'>الصندوق الوارد</span>
        </DropdownItem>
        {/* <DropdownItem tag={Link} to='/apps/todo'>
          <CheckSquare size={14} className='mr-75' />
          <span className='align-middle'>Tasks</span>
        </DropdownItem> */}
        <DropdownItem tag={Link} to='/supportDisk/messages'>
          <MessageSquare size={14} className='mr-75' />
          <span className='align-middle'>المحادثات</span>
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem tag={Link} to='/pages/profile'>
          <Settings size={14} className='mr-75' />
          <span className='align-middle'>الاعدادات</span>
        </DropdownItem>

        {/* <DropdownItem tag={Link} to='/pages/faq'>
          <HelpCircle size={14} className='mr-75' />
          <span className='align-middle'>FAQ</span>
        </DropdownItem> */}
        <DropdownItem tag={Link} to='/login' onClick={() => dispatch(handleLogout())}>
          <Power size={14} className='mr-75' />
          <span className='align-middle'>تسجيل الخروج</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
