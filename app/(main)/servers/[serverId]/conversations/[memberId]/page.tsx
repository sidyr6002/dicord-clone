import React from 'react'

interface MemberConversationsPageParams {
    memberId: string
}
interface MemberConversationsPageProps {
    params: MemberConversationsPageParams
}
const MemberConversationsPage = ({ params }: MemberConversationsPageProps) => {
    const {memberId} = params
    return (
        <div>MemberConversationsPage: {memberId}</div>
    )
}

export default MemberConversationsPage