import { useQuery } from '@tanstack/react-query';
import {
  getAiringTodayTv,
  getLatestTv,
  getPopularTv,
  getTopRatedTv,
  IGetMovieResult,
  IMovie,
} from '../api';
import styled from 'styled-components';
import { makeImagePath } from './utils';
import { AnimatePresence, delay, motion, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import Slider from '../Components/Slider';
import { BigDate, BigVote, IMatch } from './Home';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Wrapper = styled.div`
  background-color: black;
  overflow-x: hidden;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bg_photo: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bg_photo});
  background-size: cover;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 68px;
`;

const Overview = styled.p`
  width: 50%;
  font-size: 36px;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverView = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

function Tv() {
  const navigate = useNavigate();
  const latestTvMatch = useMatch('/tv/latest/:movieId');
  const airingTvMatch = useMatch('/tv/airing/:movieId');
  const popularTvMatch = useMatch('/tv/popular/:movieId');
  const topTvMatch = useMatch('/tv/top/:movieId');

  const { scrollY } = useScroll();

  const { data: latestData, isLoading: latestIsLoading } =
    useQuery<IGetMovieResult>(['movies', 'nowPlaying'], getLatestTv);

  const { data: airingTodayData, isLoading: airingTodayIsLoading } =
    useQuery<IGetMovieResult>(['movies', 'topRated'], getAiringTodayTv);

  const { data: popularData, isLoading: popularIsLoading } =
    useQuery<IGetMovieResult>(['movies', 'upComing'], getPopularTv);

  const { data: topRatedData, isLoading: topRatedIsLoading } =
    useQuery<IGetMovieResult>(['movies', 'upComing'], getTopRatedTv);

  const [currentGenre, setCurrentGenre] = useState<IMatch | null>(null);
  const [clickedMovie, setClickedMovie] = useState<IMovie | null>(null);

  const onOverlayClick = () => {
    navigate(-1);
    setCurrentGenre(null);
  };

  useEffect(() => {
    if (latestTvMatch?.params.movieId) {
      setCurrentGenre(latestTvMatch);
      setClickedMovie(
        latestData?.results.find(
          (movie) => movie.id + '' === latestTvMatch.params.movieId
        ) || null
      );
    } else if (airingTvMatch?.params.movieId) {
      setCurrentGenre(airingTvMatch);
      setClickedMovie(
        airingTodayData?.results.find(
          (movie) => movie.id + '' === airingTvMatch.params.movieId
        ) || null
      );
    } else if (popularTvMatch?.params.movieId) {
      setCurrentGenre(popularTvMatch);
      setClickedMovie(
        popularData?.results.find(
          (movie) => movie.id + '' === popularTvMatch.params.movieId
        ) || null
      );
    } else if (topTvMatch?.params.movieId) {
      setCurrentGenre(topTvMatch);
      setClickedMovie(
        topRatedData?.results.find(
          (movie) => movie.id + '' === topTvMatch.params.movieId
        ) || null
      );
    }
  }, [
    latestTvMatch,
    airingTvMatch,
    popularTvMatch,
    topTvMatch,
    latestData,
    airingTodayData,
    popularData,
    topRatedData,
  ]);

  return (
    <Wrapper>
      {latestIsLoading ||
      airingTodayIsLoading ||
      popularIsLoading ||
      topRatedIsLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bg_photo={makeImagePath(latestData?.results[0].backdrop_path || '')}
          >
            <Title>{latestData?.results[0].title}</Title>
            <Overview>{latestData?.results[0].overview}</Overview>
          </Banner>
          <Slider data={latestData} genre={'Latest Shows'} />
          <Slider data={airingTodayData} genre={'Airing Today Shows'} />
          <Slider data={popularData} genre={'Popular Shows'} />
          <Slider data={topRatedData} genre={'Top Rated Shows'} />
          <AnimatePresence>
            {currentGenre && (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={currentGenre.params.movieId}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            'w500'
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.name}</BigTitle>
                      <BigDate>
                        First Air Date: {clickedMovie.first_air_date}
                      </BigDate>
                      <BigVote>
                        <FontAwesomeIcon icon={faStar} />
                        {clickedMovie.vote_average}
                      </BigVote>
                      <BigOverView>{clickedMovie.overview}</BigOverView>
                    </>
                  )}
                </BigMovie>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
