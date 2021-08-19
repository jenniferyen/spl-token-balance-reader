import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// COMPONENTS
import { Solana } from './components/solana';
import { Token } from './components/token';
import phantomLogo from './images/phantom-logo.png'

// STYLESHEETS
import { 
  ChakraProvider, 
  Button,
  IconButton, 
  Input, 
  Menu, 
  MenuButton, 
  MenuItem,
  MenuList, 
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import './styles/App.css';

// UTILS
import { getTokenBalances } from './redux/actions/actionCreators';

// TYPES
import { AppState } from './redux/reducers/index';
import { TokenType } from './types';

/*
 * Test address: 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo
 */

declare global {
  interface Window {
      solana: any;
  }
}

const networkState = {
  'mainnet-beta': 'mainnet-beta',
  'devnet': 'devnet',
  'testnet': 'testnet'
}

function App() {
  const [address, setAddress] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [network, setNetwork] = useState<string>('mainnet-beta');
  const [connected, setConnected] = useState<boolean>(false);
  const [provider, setProvider] = useState<any>();

  const getProvider = () => {
    if ('solana' in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
    window.open('https://phantom.app/', '_blank');
  };

  const handlePhantomConnect = () => {
    const provider = getProvider();
    setProvider(provider);
    if (provider) {
      provider.connect();
    }
  }

  useEffect(() => {
    if (provider) {
      provider.on('connect', () => {
        setConnected(true);
        setAddress(provider.publicKey?.toBase58());
      });
      provider.on('disconnect', () => {
        setConnected(false);
        setAddress('');
      });
      // Try to eagerly connect
      provider.connect({ onlyIfTrusted: true });
      return () => {
        provider.disconnect();
      };
    }
  }, [provider]);

  const dispatch = useDispatch();
  const tokenList = useSelector((state: AppState) => state.tokenList);
  const error = useSelector((state: AppState) => state.error);

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

        {connected && provider ?
          (<Button leftIcon={<img src={phantomLogo} width='24px' height='24px' alt='Phantom logo'/>} ml='24px' size='md' onClick={() => provider.disconnect()}>
            Disconnect Phantom
          </Button>) 
          :
          <Button leftIcon={<img src={phantomLogo} width='24px' height='24px' alt='Phantom logo'/>} ml='24px' size='md' onClick={handlePhantomConnect}>
            Connect Phantom
          </Button>
        }

        {!showError && network === networkState['mainnet-beta'] && <Solana walletAddress={address} />}

        {tokenList && tokenList.map((token: TokenType, index: number) => {
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
