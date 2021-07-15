// ** Logo
import logo from '@src/assets/images/logo/logo.svg';
import { Spinner } from 'reactstrap';

const SpinnerComponent = () => {
  return (
    <div className='fallback-spinner vh-100'>
      <img className='fallback-logo' src={logo} alt='logo' width={50} style={{ marginBottom: '25px !important' }} />
      <div className='loading' style={{ marginTop: '25px !important' }}>
        <Spinner color='' style={{ marginTop: '25px !important' }} />
      </div>

      {/* <div className='loading' style={{ color: '#f39c12 !important' }}>
        <div className='effect-1 effects' style={{ color: '#f39c12 !important' }}></div>
        <div className='effect-2 effects' style={{ color: '#f39c12 !important' }}></div>
        <div className='effect-3 effects' style={{ color: '#f39c12 !important' }}></div>
      </div> */}
    </div>
  );
};

export default SpinnerComponent;
