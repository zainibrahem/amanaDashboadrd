import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import UILoader from '@components/ui-loader';
import ProfilePoll from './ProfilePolls';
import ProfileAbout from './ProfileAbout';
import ProfilePosts from './ProfilePosts';
import ProfileHeader from './ProfileHeader';
import { Row, Col, Button } from 'reactstrap';
import ProfileTwitterFeeds from './ProfileTwitterFeeds';
import ProfileLatestPhotos from './ProfileLatestPhotos';
import ProfileSuggestedPages from './ProfileSuggestedPages';
import ProfileFriendsSuggestions from './ProfileFriendsSuggestions';
import Breadcrumbs from '@components/breadcrumbs';
import './style.css';
import '@styles/react/pages/page-profile.scss';
import useJwt from '@src/auth/jwt/useJwt';

const Profile = () => {
  const [data, setData] = useState(null);
  const [block, setBlock] = useState(false);

  const handleBlock = () => {
    setBlock(true);
    setTimeout(() => {
      setBlock(false);
    }, 2000);
  };
  const config = useJwt.jwtConfig;
  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };

  useEffect(() => {
    axios.get('https://amanacart.com/api/admin/profile', auth).then((response) => {
      console.log(response.data.profile);
      setData(response.data.profile);
      // setdata(response.data.disputes);
      // console.log(response.data);
      // setTrashData(response.data.closed);
    });
  }, []);
  return (
    <Fragment>
      {/* <Breadcrumbs breadCrumbTitle='Profile' breadCrumbParent='Pages' breadCrumbActive='Profile' /> */}
      {data !== null ? (
        <div id='user-profile'>
          <Row>
            <Col sm='12'>
              <ProfileHeader data={data} />
            </Col>
          </Row>
          <section id='profile-info'>
            {/* lg={{ size: 3, order: 1 }} sm={{ size: 12 }} xs={{ order: 2 }} */}
            <Row>
              <Col lg='12' md='12' sm='12'>
                <ProfileAbout data={data} />
                {/* <ProfileSuggestedPages data={data.suggestedPages} />
                <ProfileTwitterFeeds data={data.twitterFeeds} /> */}
              </Col>
              {/* <Col lg={{ size: 6, order: 2 }} sm={{ size: 12 }} xs={{ order: 1 }}>
                <ProfilePosts data={data.post} />
              </Col>
              <Col lg={{ size: 3, order: 3 }} sm={{ size: 12 }} xs={{ order: 3 }}>
                <ProfileLatestPhotos data={data.latestPhotos} />
                <ProfileFriendsSuggestions data={data.suggestions} />
                <ProfilePoll data={data.polls} />
              </Col> */}
            </Row>
            {/* <Row>
              <Col className='text-center' sm='12'>
                <Button color='primary' className='border-0 mb-1 profile-load-more' size='sm' onClick={handleBlock}>
                  <UILoader blocking={block} overlayColor='rgba(255,255,255, .5)'>
                    <span> Load More</span>
                  </UILoader>
                </Button>
              </Col>
            </Row> */}
          </section>
        </div>
      ) : null}
    </Fragment>
  );
};

export default Profile;