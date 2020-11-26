import {useLayoutEffect, useState} from 'react';
import axios from 'axios';
import 'react-native-console-time-polyfill';

const client = axios.create({
  baseURL: 'https://zus2q1sssv.nonprod.myhrbl.com:8430/api',
  timeout: 20000,
});

const useData = () => {
  const [percent, setPercent] = useState(0);
  const [result, setResult] = useState([]);

  useLayoutEffect(() => {
    console.time('Download data done in');
    (async () => {
      if (result.length === 0) {
        try {
          const {data} = await client.get(
            // https://zus2q1sssv.nonprod.myhrbl.com:8430/api/ShippingAddress/V1/en-IN/?clientApplication=POS
            '/ShippingAddress/V1/es-MX/?clientApplication=POS',
            {
              onDownloadProgress: (progressEvent) => {
                const total = parseFloat(
                  progressEvent.currentTarget.responseHeaders['Content-Length'],
                );
                const current = progressEvent.currentTarget.response.length;

                const percentCompleted = Math.round((current / total) * 100);
                setPercent(percentCompleted / 100);
                // console.log('completed: ', percentCompleted / 100);
              },
            },
          );
          console.timeEnd('Download data done in');
          setResult(data);
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    })();
  }, [result]);

  return {result, percent};
};

export default useData;
