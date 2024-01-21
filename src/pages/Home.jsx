import React from 'react';
import Hero from '../components/hero_banner';
import Trending from '../components/trending_products';
import Collection from '../components/collection';
import Featured from '../components/featured';

export const HomePage = () => {
  

  return (
    <>
      <Hero />
      <Trending />
      <Collection />
      <Featured />
    </>
  );
};
