import { Box, Flex, HStack } from '@chakra-ui/react';

export const Token = (props: any) => {
    return (
        <HStack spacing='24px' ml='36vw'>
            <Box p='3'>
                <img src={props.token.logoURI} alt='token logo' width='50px' height='50px' />
            </Box>
            <Box>
                <Flex>{props.token.name}</Flex>
                <Flex>{props.token.amount} {props.token.symbol}</Flex>
                <Flex align='flex-end' style={{ color: 'red' }}>{props.token.duplicate}</Flex>
            </Box>
        </HStack>
    )
}
