import React, { useState } from 'react';
import NumberInput from '@components/number-input';

import { Input, Col, Row, FormGroup } from 'reactstrap';
function Total(props) {
  const [total_price_item, setTotal_price_item] = useState(0);
  const hundel_total_price_item = (value, price) => {
    if (value) {
      setTotal_price_item(value * price);
    } else {
      setTotal_price_item(0);
    }
  };
  return (
    <>
      <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', textAlign: 'center' }}>
        <Col lg='3' md='4' sm='12' style={{ textAlign: 'center' }}>
          <img src={props.src} height='60' alt='not found' />
        </Col>
        <Col lg='3' md='4' sm='12' style={{ textAlign: 'center' }}>
          <p style={{ margin: '0px !important' }}>{props.salePrice ? props.salePrice : ''}</p>
        </Col>
        <Col lg='3' md='4' sm='12' style={{ textAlign: '-webkit-center' }}>
          <FormGroup>
            <NumberInput className='' onChange={(el) => hundel_total_price_item(el, props.salePrice)} />
          </FormGroup>
          {/* <Input type='number' style={{ width: '50px', height: '23px !important', marginTop: '0px !important' }}  /> */}
        </Col>
        <Col lg='3' md='4' sm='12' style={{ textAlign: 'center' }}>
          <p style={{ margin: '0px !important' }}>{total_price_item}</p>
        </Col>
      </Row>
    </>
  );
}

export default Total;
