import Banner from '@/component/Home/Banner';
import HorizontalScroll from '@/component/Home/HorizontalScroll';
import React from 'react';

const page = () => {
  return (
    <div>
      <Banner />
      <HorizontalScroll />
      <div className='h-screen bg-purple-500'></div>
      <div className='h-screen bg-lime-500'></div>
      <div className='h-screen bg-sky-500'></div>
    </div>
  );
};

export default page;