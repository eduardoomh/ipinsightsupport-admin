import { Card } from "antd";
import { FC, PropsWithChildren, ReactNode } from "react";

interface Props {
    title: string;
    headerActions?: ReactNode;
    type: 'basic_section' | 'client_section'
}

const ContentLayout: FC<PropsWithChildren<Props>> = ({ title, headerActions, children }) => {
    return (
        <div className="pr-12 flex-1 overflow-y-auto bg-transparent">
            {/* 👇 Contenedor del encabezado con título y acciones */}
            <Card
                style={{ width: "100%", borderRadius: '12px', border: '1px solid #D3D3D3' }}
                title={
                    <div className="flex items-center justify-between py-8">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        {headerActions}
                    </div>
                }
            >
                {children}
            </Card>
        </div>
    )
}

export default ContentLayout