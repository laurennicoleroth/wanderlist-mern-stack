import { FormRow, FormRowSelect, SubmitBtn } from '.';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { Form, useSubmit, Link } from 'react-router-dom';
import { SPOT_TYPE, SPOT_STATUS, SPOT_SORT_BY } from '../../../utils/constants';
import { useAllSpotsContext } from '../pages/AllSpots';

const SearchContainer = () => {
  const { searchValues } = useAllSpotsContext();
  const { search, spotStatus, spotType, sort } = searchValues;
  const submit = useSubmit();

  const debounce = (onChange) => {
    let timeout;
    return (e) => {
      const form = e.currentTarget.form;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onChange(form);
      }, 2000);
    };
  };
  return (
    <Wrapper>
      <Form className='form'>
        <h5 className='form-title'>search form</h5>
        <div className='form-center'>
          <FormRow
            type='search'
            name='search'
            defaultValue={search}
            onChange={debounce((form) => {
              submit(form);
            })}
          />

          <FormRowSelect
            labelText='spot status'
            name='spotStatus'
            list={['all', ...Object.values(SPOT_STATUS)]}
            defaultValue={spotStatus}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <FormRowSelect
            labelText='spot type'
            name='spotType'
            list={['all', ...Object.values(SPOT_TYPE)]}
            defaultValue={spotType}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <FormRowSelect
            name='sort'
            defaultValue={sort}
            list={[...Object.values(SPOT_SORT_BY)]}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <Link to='/dashboard/all-spots' className='btn form-btn delete-btn'>
            Reset Search Values
          </Link>
        </div>
      </Form>
    </Wrapper>
  );
};
export default SearchContainer;
