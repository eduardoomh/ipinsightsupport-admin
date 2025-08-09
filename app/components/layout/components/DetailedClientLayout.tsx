import { TeamOutlined } from "@ant-design/icons"
import { FC, PropsWithChildren } from "react";
import DetailedClientMenu from "~/components/Menus/DetailedClientMenu";

interface Props {
    title: string;
    clientId: string;
}

const DetailedClientLayout: FC<PropsWithChildren<Props>> = ({ title, children, clientId }) => {
    return (
        <>
            <div
                style={{
                    width: "calc(100% - 2rem)",
                    borderRadius: '12px',
                    border: '1px solid #D3D3D3',
                    marginBottom: "2rem",
                    marginRight: "2rem",
                    boxShadow: "0px 1px 4px rgba(1, 10, 11, 0.32)"
                }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "20px 28px",
                    borderRadius: '12px 12px 0 0',
                    backgroundColor: "#A9E2FC"
                }}>
                    <span
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: '48px',
                            height: '48px',
                            borderRadius: "50px",
                            backgroundColor: "#198890"
                        }}>
                        <TeamOutlined
                            style={{ color: "#fff", fontSize: "2rem" }}
                        />
                    </span>
                    <h1
                        className="text-2xl font-bold"
                        style={{ color: "#096584" }}
                    >
                        {title}
                    </h1>
                </div>
                <div
                    style={{
                        paddingBottom: "1rem",
                        borderRadius: '0 0 12px 12px',
                        backgroundColor: "#e6f5fb"
                    }}
                >
                    <DetailedClientMenu collapsed={false} clientId={clientId} />
                </div>
            </div>
            <div style={{ marginRight: "2rem" }}>
                {children}
            </div>

        </>
    )
}

export default DetailedClientLayout