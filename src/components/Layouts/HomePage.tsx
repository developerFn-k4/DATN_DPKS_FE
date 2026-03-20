import React from 'react';
import { HomeHeader } from '../Header/HomeHeader';
import HomeHero from '../HomeLayout/HomeHero';
import HomePopular from '../HomeLayout/HomePopular';
import HomeDeals from '../HomeLayout/HomeDeals';
import HomeBanner from '../HomeLayout/HomeBanner';
import { HomeFooter } from '../Footer/HomeFooter';

const Home: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto min-h-screen bg-white overflow-x-hidden">
      <HomeHeader />
      <HomeHero />
      <HomePopular />
      <HomeDeals />
      <HomeBanner />
      <HomeFooter />
    </div>
  );
}

export default Home;