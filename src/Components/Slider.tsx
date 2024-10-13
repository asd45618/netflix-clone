import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { makeImagePath } from '../Routes/utils';
import { IGetMovieResult } from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const SliderWrapper = styled.div`
  position: relative;
  height: 100%;
  top: -80px;
  margin-bottom: 300px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bg_photo: string }>`
  background-color: white;
  background-image: url(${(props) => props.bg_photo});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const LeftArrow = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 3%;
  height: 100%;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
`;

const RightArrow = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 0;
  width: 3%;
  height: 100%;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
`;

const Genre = styled.h3`
  font-size: 24px;
  margin-bottom: 10px;
  margin-left: 15px;
  font-weight: bold;
`;

const rowVariants = {
  hidden: (isBack: boolean) => ({
    x: isBack ? -window.innerWidth - 5 : window.innerWidth + 5,
  }),
  visible: {
    x: 0,
  },
  exit: (isBack: boolean) => ({
    x: isBack ? window.innerWidth + 5 : -window.innerWidth - 5,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    zIndex: 99,
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: 'tween',
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: 'tween',
    },
  },
};

const offset = 6;

function Slider({ data, genre }: any) {
  const navigate = useNavigate();
  const location = useLocation();

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setBack(false);
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      setBack(true);
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const onBoxClicked = (movieId: number) => {
    if (location.pathname !== '/tv') {
      if (genre === 'Latest Movies') {
        navigate(`/movies/latest/${movieId}`);
      } else if (genre === 'Top Rated Movies') {
        navigate(`/movies/top/${movieId}`);
      } else if (genre === 'Upcoming Movies') {
        navigate(`/movies/upcoming/${movieId}`);
      }
    } else {
      if (genre === 'Latest Shows') {
        navigate(`/tv/latest/${movieId}`);
      } else if (genre === 'Airing Today Shows') {
        navigate(`/tv/airing/${movieId}`);
      } else if (genre === 'Popular Shows') {
        navigate(`/tv/popular/${movieId}`);
      } else if (genre === 'Top Rated Shows') {
        navigate(`/tv/top/${movieId}`);
      }
    }
  };

  return (
    <SliderWrapper>
      <Genre>{genre}</Genre>
      <AnimatePresence
        initial={false}
        onExitComplete={toggleLeaving}
        custom={back}
      >
        <Row
          variants={rowVariants}
          initial='hidden'
          animate='visible'
          exit='exit'
          transition={{ type: 'tween', duration: 1 }}
          key={index}
          custom={back}
        >
          <LeftArrow onClick={decreaseIndex} whileHover={{ opacity: 1 }}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </LeftArrow>
          {data?.results
            .slice(1)
            .slice(offset * index, offset * index + offset)
            .map((movie: any) => (
              <Box
                layoutId={movie.id + ''}
                key={movie.id}
                whileHover='hover'
                initial='normal'
                variants={boxVariants}
                transition={{ type: 'tween' }}
                bg_photo={makeImagePath(movie.backdrop_path, 'w500')}
                onClick={() => onBoxClicked(movie.id)}
              >
                <Info variants={infoVariants}>
                  <h4>
                    {location.pathname !== '/tv' ? movie.title : movie.name}
                  </h4>
                </Info>
              </Box>
            ))}
          <RightArrow onClick={increaseIndex} whileHover={{ opacity: 1 }}>
            <FontAwesomeIcon icon={faChevronRight} />
          </RightArrow>
        </Row>
      </AnimatePresence>
    </SliderWrapper>
  );
}

export default Slider;
