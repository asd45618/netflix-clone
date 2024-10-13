import { useQuery } from '@tanstack/react-query';
import {
  useLocation,
  useMatch,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { getSearchData, IGetMovieResult } from '../api';
import styled from 'styled-components';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { makeImagePath } from './utils';
import {
  BigCover,
  BigDate,
  BigMovie,
  BigOverView,
  BigTitle,
  BigVote,
  Overlay,
} from './Home';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Wrapper = styled.div``;

const CardWrapper = styled.div`
  display: grid;
  max-width: 90%;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  top: 150px;
  left: 0;
  right: 0;
  margin: 0 auto;
`;

const Card = styled(motion.div)<{ bg_photo: string }>`
  background-color: white;
  background-image: url(${(props) => props.bg_photo});
  background-size: cover;
  background-position: center center;
  height: 400px;
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

function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const bigSearchMatch = useMatch('/search/:id');
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || location.state?.keyword;

  const { data, isLoading } = useQuery<IGetMovieResult>(
    ['search', keyword],
    () => getSearchData(keyword || '')
  );
  console.log(data?.results.filter((item) => item.media_type !== 'person'));

  const onBoxClicked = (id: number) => {
    navigate(`/search/${id}?keyword=${keyword}`);
  };

  const onOverlayClick = () => {
    navigate(-1);
  };

  const clickedCard =
    bigSearchMatch?.params.id &&
    data?.results.find((result) => result.id + '' === bigSearchMatch.params.id);

  return (
    <Wrapper>
      <AnimatePresence initial={false}>
        <CardWrapper key={keyword}>
          {data?.results
            .filter((item) => item.media_type !== 'person')
            .map((info: any) => (
              <Card
                layoutId={info.id + ''}
                key={info.id}
                whileHover='hover'
                initial='normal'
                variants={boxVariants}
                transition={{ type: 'tween' }}
                bg_photo={makeImagePath(info.poster_path, 'w300')}
                onClick={() => onBoxClicked(info.id)}
              >
                <Info variants={infoVariants}>
                  <h4>{info.media_type !== 'tv' ? info.title : info.name}</h4>
                </Info>
              </Card>
            ))}
        </CardWrapper>
      </AnimatePresence>
      <AnimatePresence>
        {bigSearchMatch && (
          <>
            <Overlay
              onClick={onOverlayClick}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigMovie
              layoutId={bigSearchMatch.params.id}
              style={{ top: scrollY.get() + 100 }}
            >
              {clickedCard && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedCard.poster_path,
                        'w500'
                      )})`,
                    }}
                  />
                  <BigTitle>
                    {clickedCard.media_type !== 'tv'
                      ? clickedCard.title
                      : clickedCard.name}
                  </BigTitle>
                  <BigDate>
                    {clickedCard.release_date
                      ? `Release Date: ${clickedCard.release_date}`
                      : `First Air Date: ${clickedCard.first_air_date}`}
                  </BigDate>
                  <BigVote>
                    <FontAwesomeIcon icon={faStar} />
                    {clickedCard.vote_average}
                  </BigVote>
                  <BigOverView>{clickedCard.overview}</BigOverView>
                </>
              )}
            </BigMovie>
          </>
        )}
      </AnimatePresence>
    </Wrapper>
  );
}

export default Search;
