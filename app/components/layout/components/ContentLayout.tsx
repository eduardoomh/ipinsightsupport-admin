import { FC, PropsWithChildren, ReactNode } from "react";
import DetailedClientLayout from "./DetailedClientLayout";
import DefaultCardLayout from "./DefaultCardLayout";

interface Props {
    title: string;
    headerActions?: ReactNode;
    type: 'basic_section' | 'client_section';
    size?: 'small' | 'normal'
    id?: string;
    hideHeader?: boolean;
}

const ContentLayout: FC<PropsWithChildren<Props>> = ({ title, headerActions, children, type, size = 'normal', id, hideHeader = false }) => {
    return (
        <div className={`pr-${size === 'small' ? '1' : '6'} flex-1 overflow-y-auto bg-transparent`}>
            {
                type === 'client_section' ? (
                    <DetailedClientLayout title={title} clientId={id}>
                        {children}
                    </DetailedClientLayout>
                ) : (
                    <DefaultCardLayout title={title} headerActions={headerActions} size={size} hideHeader={hideHeader}>
                        {children}
                    </DefaultCardLayout>
                )
            }

        </div>
    )
}

export default ContentLayout