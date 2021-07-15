import { useState } from 'react';
import { AlignJustify, Rss, Info, Image, Users, Edit } from 'react-feather';
import { Card, CardImg, Collapse, Navbar, Nav, NavItem, NavLink, Button } from 'reactstrap';

const ProfileHeader = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Card className='profile-header mb-2'>
      <CardImg src={data.avatar} alt='User Profile Image' top />
      <div className='position-relative'>
        <div className='profile-img-container d-flex align-items-center'>
          <div className='profile-img'>
            <img className='rounded img-fluid' src={data.avatar} alt='Card image' />
          </div>
          <div className='profile-title ml-3'>
            <h2 className='text-white'>{data.username}</h2>
            <p className='text-white'>{data.designation}</p>
          </div>
        </div>
      </div>
      <div className='profile-header-nav'>
        <Navbar className='justify-content-end justify-content-md-between w-100' expand='md' light>
          <Button color='' className='btn-icon navbar-toggler' onClick={toggle}>
            <AlignJustify size={21} />
          </Button>
          {/* <Collapse isOpen={isOpen} navbar>
            
          </Collapse> */}
        </Navbar>
      </div>
    </Card>
  );
};

export default ProfileHeader;
