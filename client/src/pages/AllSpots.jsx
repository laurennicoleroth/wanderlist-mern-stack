import { toast } from 'react-toastify';
import { SpotsContainer, SearchContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext } from 'react';
import { useQuery } from '@tanstack/react-query';

const allSpotsQuery = (params) => {
  const { search, spotStatus, spotType, sort, page } = params;
  return {
    queryKey: [
      'spots',
      search ?? '',
      spotStatus ?? 'all',
      spotType ?? 'all',
      sort ?? 'newest',
      page ?? 1,
    ],
    queryFn: async () => {
      const { data } = await customFetch.get('/spots', {
        params,
      });
      return data;
    },
  };
};

export const loader =
  (queryClient) =>
  async ({ request }) => {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    await queryClient.ensureQueryData(allSpotsQuery(params));
    return { searchValues: { ...params } };
  };

const AllSpotsContext = createContext();
const AllSpots = () => {
  const { searchValues } = useLoaderData();
  const { data } = useQuery(allSpotsQuery(searchValues));
  return (
    <AllSpotsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <SpotsContainer />
    </AllSpotsContext.Provider>
  );
};

export const useAllSpotsContext = () => useContext(AllSpotsContext);

export default AllSpots;
