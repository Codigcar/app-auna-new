import Constant from '../utils/constants';

export const fetchWithToken = async (
  endpoint = '',
  method = 'GET',
  params = {},
  token = '',
) => {
  try {
    const resp = await fetch(Constant.URI.PATH80 + endpoint + '?' + params, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log('error');
    throw error;
  }
};
