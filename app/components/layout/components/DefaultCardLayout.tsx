import { Card } from "antd"
import { FC, PropsWithChildren } from "react";

interface Props {
    title: string;
    headerActions: any;
    size: 'small' | 'normal';
    hideHeader?: boolean;
}
const DefaultCardLayout: FC<PropsWithChildren<Props>> = ({ title, headerActions, children, size, hideHeader }) => {
    return (
        <Card
            style={{
                width: "100%",
                border: '1px solid #D3D3D3',
                boxShadow: "0px 1px 4px rgba(1, 10, 11, 0.32)"
            }}
            title={hideHeader ? null :
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-8 sm:py-6 md:py-8">
                    <h1
                        className="text-2xl font-bold"
                        style={{ color: "#014A64" }}
                    >
                        {title}
                    </h1>
                    {headerActions}
                </div>
            }
        >
            <div className="overflow-x-auto">
                {children}
            </div>
        </Card>
    )
}

export default DefaultCardLayout