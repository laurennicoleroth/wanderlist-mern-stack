import Wrapper from '../assets/wrappers/SpotInfo';

const SpotInfo = ({ icon, text }) => {
  return (
    <Wrapper>
      <span className='spot-icon'>{icon}</span>
      <span className='spot-text'>{text}</span>
    </Wrapper>
  );
};
export default SpotInfo;
