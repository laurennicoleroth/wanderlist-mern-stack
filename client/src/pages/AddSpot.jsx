import { FormRow, FormRowSelect, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useOutletContext } from 'react-router-dom';
import { SPOT_STATUS, SPOT_TYPE } from '../../../utils/constants';
import { Form, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

export const action =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
      await customFetch.post('/spots', data);
      queryClient.invalidateQueries(['spots']);
      toast.success('Spot added successfully ');
      return redirect('all-spots');
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return error;
    }
  };

const AddSpot = () => {
  const { user } = useOutletContext();

  return (
    <Wrapper>
      <Form method='post' className='form'>
        <h4 className='form-title'>add spot</h4>
        <div className='form-center'>
          <FormRow type='text' name='position' />
          <FormRow type='text' name='company' />
          <FormRow
            type='text'
            labelText='spot location'
            name='spotLocation'
            defaultValue={user.location}
          />
          <FormRowSelect
            labelText='spot status'
            name='spotStatus'
            defaultValue={SPOT_STATUS.PENDING}
            list={Object.values(SPOT_STATUS)}
          />
          <FormRowSelect
            labelText='spot type'
            name='spotType'
            defaultValue={SPOT_TYPE.FULL_TIME}
            list={Object.values(SPOT_TYPE)}
          />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};
export default AddSpot;
