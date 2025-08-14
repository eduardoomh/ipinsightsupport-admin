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
                borderRadius: '12px',
                borderTopRightRadius: size !== 'small' ? '0px' : '12px',
                borderBottomRightRadius: size !== 'small' ? '0px' : '12px',
                border: '1px solid #D3D3D3',
                boxShadow: "0px 1px 4px rgba(1, 10, 11, 0.32)"
            }}
            title={hideHeader ? null : 
                <div className={`flex items-center justify-between ${size === 'small' ? 'py-2' : 'py-8'}`}>
                    <h1
                        className={`${size === 'small' ? 'text-1xl' : 'text-2xl'} font-bold`}
                        style={{ color: "#014A64" }}
                    >
                        {title}
                    </h1>
                    {headerActions}
                </div>
            }
        >
            {children}
        </Card>
    )
}

export default DefaultCardLayout