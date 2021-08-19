import React, { useEffect, useState } from 'react';
import { Box, Flex, HStack, Text, Spacer } from '@chakra-ui/react';
import { getSolanaBalance } from '../utils';

export const Solana = (props: any) => {
    const [balance, setBalance] = useState<number>(0);
    const [USDEquivalent, setUSDEquivalent] = useState<number>(0);

    const solanaObj = {
        address: props.walletAddress,
        amount: balance,
        chainId: Number.MAX_VALUE,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
        name: 'Solana',
        symbol: 'SOL',
        tags: ['Solana', 'SOL']
    }

    useEffect(() => {
        const fetchBalance = async () => {
            const balance = await getSolanaBalance(props.walletAddress);
            if (balance) {
                setBalance(balance);
            }
        }
        fetchBalance();
    }, [props.walletAddress]);


    useEffect(() => {
        const fetchPrice = async () => {
            await fetch('http://localhost:8000/getSolanaPrice').then(res => {
                return res.json()
            }).then(apiPrice => {
                const price = apiPrice['SOL_price'];
                const USDEquivalent = price * balance;
                setUSDEquivalent(USDEquivalent);
            });
        }
        fetchPrice();
    }, [balance]);

    return (
        // TO DO: style solana differently than the other tokens
        <HStack w='50%' background='#121212' spacing='32px' boxShadow='xl' rounded='md' p='6' m={8} ml='25%' >
            <Box>
                <img src={solanaObj.logoURI} alt='token logo' width='50px' height='50px' />
            </Box>
            <Box>
                <Flex>
                    <Text color='#BB86FC'>
                        {solanaObj.name}
                    </Text>
                </Flex>
                <Flex>
                    <Text color='#BB86FC'>
                        {solanaObj.amount} {solanaObj.symbol}
                    </Text>
                </Flex>
            </Box>
            <Spacer /> 
            <Box>
                <Flex align='baseline' style={{ color: 'white' }}>${USDEquivalent.toFixed(2)}</Flex>
            </Box>
            <Spacer />
        </HStack>
    )
}
