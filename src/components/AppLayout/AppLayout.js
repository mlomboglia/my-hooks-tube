import React from 'react';
import './AppLayout.scss';
import HeaderNav from '../../containers/HeaderNav/HeaderNav';

const AppLayout = (props) => {
  return (
      <div className='app-layout'>
        <HeaderNav/>
        {props.children}
      </div>
  );
}

export default AppLayout;