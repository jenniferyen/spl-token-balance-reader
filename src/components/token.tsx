import { Box, Flex, HStack, Text, Spacer } from '@chakra-ui/react';

import '../styles/token.css';

export const Token = (props: any) => {
    return (
        <HStack w='50%' background='#121212' spacing='32px' boxShadow='xl' rounded='md' p='6' m={8} ml='25%' >
            <Box>
                <img src={props.token.logoURI} alt='token logo' width='50px' height='50px' />
            </Box>
            <Box>
                <Flex>
                    <Text color='#BB86FC'>
                        {props.token.name}
                    </Text>
                </Flex>
                <Flex>
                    <Text color='#BB86FC'>
                        {props.token.amount} {props.token.symbol}
                    </Text>
                </Flex>
            </Box>
            <Spacer />
            <Box>
                <Flex align='baseline' style={{ color: '#FF0080' }}>{props.token.duplicate}</Flex>
            </Box>
        </HStack>
    )
}
