import { Avatar, Tag, Typography } from "antd"
import { FC } from "react";
const { Text } = Typography

interface Props {
    name: string;
    role: string;
    isLead: boolean;
    showBorder?: boolean;
}
const TeamMember: FC<Props> = ({ name, role, isLead, showBorder }) => {
    return (
        <div style={
            showBorder ? {
                display: "flex",
                justifyContent: "flex-start",
                gap: "1rem",
                borderBottom: "1px solid #E2E1E1",
                padding: "0 0 12px 0",
                marginBottom: "12px"
            } : {
                display: "flex",
                justifyContent: "flex-start",
                gap: "1rem",
                padding: "0 0 12px 0",
                marginBottom: "12px"
            }
        }>
            <div style={{display: "flex", alignItems: "center"}}>
                <Avatar size="large" style={{backgroundColor: "#05AAE6"}}>{name.charAt(0)}</Avatar>
            </div>

            <div style={{display: "flex", flexDirection: "column", gap: "4px"}}>
                <Text strong>{name}</Text>
                <div style={{display: "flex", gap: "4px"}}>
                    <Tag>{role}</Tag> {" "}{isLead && <Tag color="blue">Lead</Tag>}
                </div>
                
            </div>
        </div>
    )
}

export default TeamMember