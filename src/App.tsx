import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// COMPONENTS
import { Token } from './components/token';

// STYLESHEETS
import { 
  ChakraProvider, 
  Input, 
  IconButton, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import './styles/App.css';

// UTILS
import { getTokenBalances } from './redux/actions/actionCreators';

/*
 * Test address: 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo
 */

function App() {
  const [address, setAddress] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);

  const networkState = {
    'mainnet-beta': 'mainnet-beta',
    'devnet': 'devnet',
    'testnet': 'testnet'
  }
  const [network, setNetwork] = useState<string>('mainnet-beta');

  const dispatch = useDispatch();
  const tokenList = useSelector((state: any) => state.tokenList);
  const error = useSelector((state: any) => state.error);

  useEffect(() => {
    dispatch(getTokenBalances(address, network));
    setShowError(!!error);
  }, [address, error, network, dispatch]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAddress(event.target.value);
  }

  return (
    <ChakraProvider>
      <div className='App'>
        <div className='networkText'>Network: {network}</div>
        <Menu>
          <MenuButton 
            as={IconButton} 
            aria-label='Options' 
            icon={<HamburgerIcon />} 
            mr='24px'
          />
          <MenuList>
            <MenuItem onClick={() => setNetwork(networkState['mainnet-beta'])}>mainnet-beta</MenuItem>
            <MenuItem onClick={() => setNetwork(networkState['devnet'])}>devnet</MenuItem>
            <MenuItem onClick={() => setNetwork(networkState['testnet'])}>testnet</MenuItem>
          </MenuList>
        </Menu>

        <Input
          className='inputField'
          variant='flushed'
          placeholder='Enter a Solana wallet address'
          value={address}
          onChange={handleInputChange}
        />

        {tokenList && tokenList.map((token: any, index: any) => {
          return (
            <Token token={token} index={index} />
          )
        })}

        {address !== '' && showError && <div className='errorText'>{error}</div>}
      </div>
    </ChakraProvider>
  );
}

export default App;
