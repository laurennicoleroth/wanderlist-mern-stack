import Spot from './Spot';
import Wrapper from '../assets/wrappers/SpotsContainer';
import { useAllSpotsContext } from '../pages/AllSpots';
import PageBtnContainer from './PageBtnContainer';
const SpotsContainer = () => {
  const { data } = useAllSpotsContext();

  const { spots, totalSpots, numOfPages } = data;
  if (spots.length === 0) {
    return (
      <Wrapper>
        <h2>No spots to display...</h2>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <h5>
        {totalSpots} spot{spots.length > 1 && 's'} found
      </h5>
      <div className='spots'>
        {spots.map((spot) => {
          return <Spot key={spot._id} {...spot} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};
export default SpotsContainer;
