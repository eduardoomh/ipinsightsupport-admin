import { Avatar } from "antd";
import { FC } from "react";
import { getColorForName } from "~/utils/general/getColorForName";

interface Props {
    fullName: string;
    size?: number;
}

const TeamMemberAvatar: FC<Props> = ({ fullName, size = 42 }) => {
    const [firstName = "", lastName = ""] = fullName.split(" ");

    const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
    const color = getColorForName(fullName);


    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "4px 0",
                textAlign: "center",
            }}
        >
            <Avatar
                size={size}
                style={{
                    backgroundColor: color,
                    fontSize: size * 0.38,
                    marginRight: 8,
                }}
            >
                {initials}
            </Avatar>

            <div style={{ textAlign: "left", fontWeight: "450" }}>
                {firstName}
                {lastName && (
                    <div>
                        {lastName}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamMemberAvatar;