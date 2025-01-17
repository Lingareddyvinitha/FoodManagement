import styled from '@emotion/styled'
import tw from 'tailwind.macro'

export const LoadingViewContainer = styled.div`
   ${tw`flex flex-col justify-center items-center  bg-gray-200`}
   min-height:400px
`

export const FailureViewContainer = styled.div`
   ${tw`flex flex-col justify-center items-center bg-gray-200`}
   min-height:400px
`

export const FailureViewMessage = styled.p`
   ${tw`m-6 text-2xl text-center`}
`

export const RetryButton = styled.button`
   ${tw`px-8 py-2 bg-blue-500 text-white text-2xl rounded`}
`
