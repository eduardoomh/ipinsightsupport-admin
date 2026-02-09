import { FC } from "react";
import { ShopOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";

interface Props {
    company: string;
    id: string | number;
    isAdmin?: boolean;
}

const CompanyLink: FC<Props> = ({ company, id, isAdmin = true }) => {
    const navigate = useNavigate();

    return (
        <p
            style={{
                cursor: "pointer",
                textDecoration: "underline",
                marginBottom: "10px",
                fontSize: 16,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
            }}
            onClick={() => navigate(`${isAdmin ? "/admin" : ""}/company/dashboard/${id}`)}
        >
            <ShopOutlined style={{ fontSize: 18, color: "#1677ff" }} />
            {company}
        </p>
    );
};

export default CompanyLink;