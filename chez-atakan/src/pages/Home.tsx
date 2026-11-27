import { Hero } from '../components/Hero';
import { Story } from '../components/Story';
import { Menu } from '../components/Menu';
import { Compose } from '../components/Compose';
import { Reviews } from '../components/Reviews';
import { Location } from '../components/Location';

export default function Home() {
  return (
    <>
      <Hero />
      <Story />
      <Compose />
      <Menu />
      <Reviews />
      <Location />
    </>
  );
}
