import { useQuery } from '@tanstack/react-query';
import {
  getLatestMovie,
  getTopRatedMovie,
  getUpComingMovie,
  IGetMovieResult,
  IMovie,
} from '../api';
import styled from 'styled-components';
import { makeImagePath } from './utils';
import { AnimatePresence, delay, motion, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import Slider from '../Components/Slider';
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

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

export const BigMovie = styled(motion.div)`
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

export const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

export const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

export const BigDate = styled.span`
  padding: 20px;
  position: relative;
  top: -70px;
`;

export const BigVote = styled.span`
  padding: 20px;
  position: relative;
  top: -70px;
  svg {
    margin-right: 5px;
    color: #e6c636;
  }
`;

export const BigOverView = styled.p`
  padding: 20px;
  position: relative;
  top: -60px;
  color: ${(props) => props.theme.white.lighter};
`;

export interface IMatch {
  params: {
    movieId: string | undefined;
  };
}

function Home() {
  const navigate = useNavigate();
  const latestMovieMatch = useMatch('/movies/latest/:movieId');
  const topMovieMatch = useMatch('/movies/top/:movieId');
  const upcomingMovieMatch = useMatch('/movies/upcoming/:movieId');

  const { scrollY } = useScroll();
  const { data: latestData, isLoading: latestIsLoading } =
    useQuery<IGetMovieResult>(['movies', 'nowPlaying'], getLatestMovie);

  const { data: topRatedData, isLoading: topRatedIsLoading } =
    useQuery<IGetMovieResult>(['movies', 'topRated'], getTopRatedMovie);

  const { data: upComingData, isLoading: upComingIsLoading } =
    useQuery<IGetMovieResult>(['movies', 'upComing'], getUpComingMovie);

  const [currentGenre, setCurrentGenre] = useState<IMatch | null>(null);
  const [clickedMovie, setClickedMovie] = useState<IMovie | null>(null);

  const onOverlayClick = () => {
    navigate(-1);
    setCurrentGenre(null);
  };

  // Match가 변경될 때만 상태 업데이트
  useEffect(() => {
    if (latestMovieMatch?.params.movieId) {
      setCurrentGenre(latestMovieMatch);
      setClickedMovie(
        latestData?.results.find(
          (movie) => movie.id + '' === latestMovieMatch.params.movieId
        ) || null
      );
    } else if (topMovieMatch?.params.movieId) {
      setCurrentGenre(topMovieMatch);
      setClickedMovie(
        topRatedData?.results.find(
          (movie) => movie.id + '' === topMovieMatch.params.movieId
        ) || null
      );
    } else if (upcomingMovieMatch?.params.movieId) {
      setCurrentGenre(upcomingMovieMatch);
      setClickedMovie(
        upComingData?.results.find(
          (movie) => movie.id + '' === upcomingMovieMatch.params.movieId
        ) || null
      );
    }
  }, [
    latestMovieMatch,
    topMovieMatch,
    upcomingMovieMatch,
    latestData,
    topRatedData,
    upComingData,
  ]);

  return (
    <Wrapper>
      {latestIsLoading || topRatedIsLoading || upComingIsLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bg_photo={makeImagePath(latestData?.results[0].backdrop_path || '')}
          >
            <Title>{latestData?.results[0].title}</Title>
            <Overview>{latestData?.results[0].overview}</Overview>
          </Banner>
          <Slider data={latestData} genre={'Latest Movies'} />
          <Slider data={topRatedData} genre={'Top Rated Movies'} />
          <Slider data={upComingData} genre={'Upcoming Movies'} />
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
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigDate>
                        Release Date: {clickedMovie.release_date}
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

export default Home;
