import { ShopOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import { FC, PropsWithChildren } from "react";
import { useNavigation } from "@remix-run/react";
import DetailedClientMenu from "~/components/Menus/DetailedClientMenu";
import { getClientStatusLabel } from "~/utils/general/getClientStatusLabel";
import CompanyMenu from "~/components/Menus/CompanyMenu";
import CompanyClientMenu from "~/components/Menus/CompanyClientMenu";

interface Props {
    title: string;
    clientId: string;
    companyStatus: string;
    type?: "ADMIN" | "USER" | "CLIENT"
}

const DetailedClientLayout: FC<PropsWithChildren<Props>> = ({
    title,
    children,
    clientId,
    companyStatus,
    type = "ADMIN"
}) => {

    return (
        <>
            <div
                style={{
                    width: "calc(100% - 2rem)",
                    border: "1px solid #D3D3D3",
                    marginBottom: "2rem",
                    marginRight: "2rem",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "20px 28px",
                        backgroundColor: "#f2f2f2",
                    }}
                >
                    <span
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "48px",
                            height: "48px",
                            borderRadius: "50px",
                            backgroundColor: "#198890",
                        }}
                    >
                        <ShopOutlined style={{ color: "#fff", fontSize: "2rem" }} />
                    </span>
                    <h1
                        className="text-2xl font-bold"
                        style={{ color: "#096584" }}
                    >
                        {title}{" "}
                        <Tag
                            color="geekblue"
                            style={{ padding: "2px 8px", marginLeft: "4px" }}
                        >
                            {getClientStatusLabel(companyStatus as any)}
                        </Tag>
                    </h1>
                </div>
                <div
                    style={{
                        paddingBottom: "1rem",
                        borderRadius: "0 0 12px 12px",
                        backgroundColor: "#fff",
                    }}
                >
                    {type === 'ADMIN' ? (
                        <DetailedClientMenu collapsed={false} clientId={clientId} />
                    ) : type === 'USER' ? (
                        <CompanyMenu collapsed={false} clientId={clientId} />
                    ) : (
                        <CompanyClientMenu collapsed={false} clientId={clientId} />
                    )
                    }
                </div>
            </div>
            <div style={{ marginRight: "2rem" }}>{children}</div>
        </>
    );
};

export default DetailedClientLayout;