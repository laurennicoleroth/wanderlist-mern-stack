import { FormRow, FormRowSelect, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useLoaderData, useParams } from 'react-router-dom';
import { SPOT_STATUS, SPOT_TYPE } from '../../../utils/constants';
import { Form, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { useQuery } from '@tanstack/react-query';

const singleSpotQuery = (id) => {
  return {
    queryKey: ['spot', id],
    queryFn: async () => {
      const { data } = await customFetch.get(`/spots/${id}`);
      return data;
    },
  };
};

export const loader =
  (queryClient) =>
  async ({ params }) => {
    try {
      await queryClient.ensureQueryData(singleSpotQuery(params.id));
      return params.id;
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return redirect('/dashboard/all-spots');
    }
  };
export const action =
  (queryClient) =>
  async ({ request, params }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
      await customFetch.patch(`/spots/${params.id}`, data);
      queryClient.invalidateQueries(['spots']);

      toast.success('Spot edited successfully');
      return redirect('/dashboard/all-spots');
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return error;
    }
  };

const EditSpot = () => {
  const id = useLoaderData();

  const {
    data: { spot },
  } = useQuery(singleSpotQuery(id));

  return (
    <Wrapper>
      <Form method='post' className='form'>
        <h4 className='form-title'>edit spot</h4>
        <div className='form-center'>
          <FormRow type='text' name='position' defaultValue={spot.position} />
          <FormRow type='text' name='company' defaultValue={spot.company} />
          <FormRow
            type='text'
            name='spotLocation'
            labelText='spot location'
            defaultValue={spot.spotLocation}
          />
          <FormRowSelect
            name='spotStatus'
            labelText='spot status'
            defaultValue={spot.spotStatus}
            list={Object.values(SPOT_STATUS)}
          />
          <FormRowSelect
            name='spotType'
            labelText='spot type'
            defaultValue={spot.spotType}
            list={Object.values(SPOT_TYPE)}
          />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};
export default EditSpot;
