import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { Link, Form } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Spot';
import SpotInfo from './SpotInfo';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
day.extend(advancedFormat);

const Spot = ({
  _id,
  position,
  company,
  spotLocation,
  spotType,
  createdAt,
  spotStatus,
}) => {
  const date = day(createdAt).format('MMM Do, YYYY');
  return (
    <Wrapper>
      <header>
        <div className='main-icon'>{company.charAt(0)}</div>
        <div className='info'>
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className='content'>
        <div className='content-center'>
          <SpotInfo icon={<FaLocationArrow />} text={spotLocation} />
          <SpotInfo icon={<FaCalendarAlt />} text={date} />
          <SpotInfo icon={<FaBriefcase />} text={spotType} />
          <div className={`status ${spotStatus}`}>{spotStatus}</div>
        </div>
        <footer className='actions'>
          <Link to={`../edit-spot/${_id}`} className='btn edit-btn'>
            Edit
          </Link>
          <Form method='post' action={`../delete-spot/${_id}`}>
            <button type='submit' className='btn delete-btn'>
              Delete
            </button>
          </Form>
        </footer>
      </div>
    </Wrapper>
  );
};
export default Spot;
