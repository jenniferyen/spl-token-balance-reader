import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// COMPONENTS
import { Token } from './components/token';

// STYLESHEETS
import './App.css';
import { ChakraProvider, Input } from '@chakra-ui/react';

// UTILS
import { getTokenBalances } from './redux/actions/actionCreators';

/*
 * Test address: 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo
 */

function App() {
  const [address, setAddress] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);

  const dispatch = useDispatch();
  const tokenList = useSelector((state: any) => state.tokenList);
  const error = useSelector((state: any) => state.error);

  useEffect(() => {
    dispatch(getTokenBalances(address));
    setShowError(!!error);
  }, [address, error, dispatch]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAddress(event.target.value);
  }

  return (
    <ChakraProvider>
      <div className='App'>
        <Input
          variant='filled'
          placeholder='Enter a Solana wallet address'
          value={address}
          onChange={handleInputChange}
          style={{width: '500px', padding: '12px', marginTop: '24px'}}
        />

        {tokenList && tokenList.map((token: any, index: any) => {
          return (
            <Token token={token} index={index} style={{padding: '5px'}}/>
          )
        })}

        {address !== '' && showError && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </ChakraProvider>
  );
}

export default App;
