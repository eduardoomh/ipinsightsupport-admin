import { Await, Outlet } from "@remix-run/react";
import { Suspense, ReactNode, useContext } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import ContentLayout from "~/components/layout/components/ContentLayout";
import { UserContext } from "~/context/UserContext";
import { UserRole } from "~/features/Users/Interfaces/users.interface";

interface CompanyTableViewProps {
    company: any;
    resolve: Promise<any>;
    skeleton: ReactNode;
    title: string;
    headerActions?: ReactNode;
    refreshResults: any;
    menuType?: UserRole;
    children: (data: any) => ReactNode;
}

export function CompanyTableView({
    company,
    resolve,
    skeleton,
    title,
    headerActions,
    refreshResults,
    menuType,
    children
}: CompanyTableViewProps) {
    const user = useContext(UserContext);

    return (
        <DashboardLayout
            title={company.company}
            type="client_section"
            id={company.id}
            companyStatus={company.currentStatus}
            menuType={menuType}
        >
            <ContentLayout
                title={title}
                type="basic_section"
                size="small"
                headerActions={user.company_id ? null : headerActions}
            >
                <Suspense fallback={skeleton}>
                    <Await resolve={resolve}>
                        {(data: any) => (
                            <>
                                {children(data)}
                                <Outlet context={{ refreshResults, company }} />
                            </>
                        )}
                    </Await>
                </Suspense>
            </ContentLayout>
        </DashboardLayout>
    );
}