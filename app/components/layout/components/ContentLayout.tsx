import { FC, PropsWithChildren, ReactNode } from "react";
import DetailedClientLayout from "./DetailedClientLayout";
import DefaultCardLayout from "./DefaultCardLayout";

interface Props {
    title: string;
    headerActions?: ReactNode;
    type: 'basic_section' | 'client_section';
    size?: 'small' | 'normal'
    id?: string;
}

const ContentLayout: FC<PropsWithChildren<Props>> = ({ title, headerActions, children, type, size = 'normal', id }) => {
    return (
        <div className={`pr-${size === 'small' ? '1' : '12'} flex-1 overflow-y-auto bg-transparent`}>
            {
                type === 'client_section' ? (
                    <DetailedClientLayout title={title} clientId={id}>
                        {children}
                    </DetailedClientLayout>
                ) : (
                    <DefaultCardLayout title={title} headerActions={headerActions} size={size}>
                        {children}
                    </DefaultCardLayout>
                )
            }

        </div>
    )
}

export default ContentLayout