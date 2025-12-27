import { ShopOutlined } from "@ant-design/icons";
import { FC, PropsWithChildren } from "react";
import DetailedClientMenu from "~/components/Menus/DetailedClientMenu";
import CompanyMenu from "~/components/Menus/CompanyMenu";
import CompanyClientMenu from "~/components/Menus/CompanyClientMenu";
import StatusTag from "~/components/basics/StatusTag";
import { UserRole } from "~/features/Users/Interfaces/users.interface";

interface Props {
    title: string;
    clientId: string;
    companyStatus: string;
    type?: UserRole;
}

const DetailedClientLayout: FC<PropsWithChildren<Props>> = ({
    title,
    children,
    clientId,
    companyStatus,
    type = UserRole.ADMIN,
}) => {
    return (
        <>
            <div
                style={{
                    width: "calc(100% - 2rem)",
                    border: "1px solid #E0E0E0",
                    borderRadius: 12,
                    overflow: "hidden",
                    marginBottom: "2rem",
                    marginRight: "2rem",
                    background: "#fff",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}
            >
                {/* HEADER */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "22px 28px",
                        background: "linear-gradient(90deg, #F7FAFC 0%, #EDF2F7 100%)",
                        borderBottom: "1px solid #E5E7EB",
                    }}
                >
                    <span
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "52px",
                            height: "52px",
                            borderRadius: 12,
                            backgroundColor: "#198890",
                            boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
                            flexShrink: 0,
                        }}
                    >
                        <ShopOutlined style={{ color: "#fff", fontSize: "28px" }} />
                    </span>

                    <div style={{ marginLeft: "16px" }}>
                        <h1
                            style={{
                                fontSize: "1.75rem",
                                fontWeight: 700,
                                margin: 0,
                                color: "#084C61",
                            }}
                        >
                            {title}
                        </h1>

                        <div style={{ marginTop: 4 }}>
                            <StatusTag status={companyStatus as any} />
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        paddingBottom: "1rem",
                        backgroundColor: "#fff",
                    }}
                >
                    {type === "ADMIN" ? (
                        <DetailedClientMenu collapsed={false} clientId={clientId} />
                    ) : type === "USER" ? (
                        <CompanyMenu collapsed={false} clientId={clientId} />
                    ) : (
                        <CompanyClientMenu collapsed={false} clientId={clientId} />
                    )}
                </div>
            </div>

            <div style={{ marginRight: "2rem" }}>{children}</div>
        </>
    );
};

export default DetailedClientLayout;