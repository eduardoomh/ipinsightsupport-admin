import { FC, PropsWithChildren, ReactNode } from "react";
import DetailedClientLayout from "./DetailedClientLayout";
import DefaultCardLayout from "./DefaultCardLayout";
import { UserRole } from "~/features/Users/Interfaces/users.interface";

interface Props {
    title: string;
    headerActions?: ReactNode;
    type: 'basic_section' | 'client_section';
    size?: 'small' | 'normal'
    id?: string;
    hideHeader?: boolean;
    tailwindClass?: string;
    companyStatus?: string;
    menuType?: UserRole;
}

const ContentLayout: FC<PropsWithChildren<Props>> = ({ 
    title, headerActions, children, type, size = 'normal', id, hideHeader = false, tailwindClass, companyStatus, menuType = UserRole.ADMIN
}) => {
    return (
        <div className={`pr-${size === 'small' ? '1' : '6'} pt-0 flex-1 overflow-y-auto bg-transparent ${tailwindClass && tailwindClass}`}>
            {
                type === 'client_section' ? (
                    <DetailedClientLayout title={title} clientId={id} companyStatus={companyStatus} type={menuType}>
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