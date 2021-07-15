import { Award } from 'react-feather';
import Avatar from '@components/avatar';
import { Card, CardBody, CardText } from 'reactstrap';
import decorationLeft from '@src/assets/images/elements/decore-left.png';
import decorationRight from '@src/assets/images/elements/decore-right.png';

const CardCongratulations = () => {
  return (
    <Card className='card-congratulations'>
      <CardBody className='text-center'>
        <img className='congratulations-img-left' src={decorationLeft} alt='decor-left' />
        <img className='congratulations-img-right' src={decorationRight} alt='decor-right' />
        <Avatar icon={<Award size={28} />} className='shadow' color='primary' size='xl' />
        <div className='text-center'>
          <h1 className='mb-1 text-white'>مبارك John,</h1>
          <CardText className='m-auto w-75'>
            {/* You have done <strong>57.6%</strong> more sales today. Check your new badge in your profile. */}
            لقد حققت مبيعات أكثر بنسبة 57.6٪ اليوم. تحقق من شارتك الجديدة في ملف التعريف الخاص بك.
          </CardText>
        </div>
      </CardBody>
    </Card>
  );
};

export default CardCongratulations;
