import React, { useEffect, useState } from "react";
import { ClientI } from "~/interfaces/clients.interface";
import ContentLayout from "~/components/layout/components/ContentLayout";
import DashboardItem from "../../detailedClients/DashboardItem";
import SkeletonList from "./SkeletonList";
import { getDefaultRates } from "~/utils/general/getDefaultRates";

interface Props {
    client: ClientI;
}

const RatesSection: React.FC<Props> = ({ client }) => {
    const [rates, setRates] = useState<any>(null);
    const [defaultRates] = useState(getDefaultRates())
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRates = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/clients/rates/${client.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setRates(data);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchRates();
    }, [client.id]);

    if (loading) {
        return (
            <ContentLayout title="Rates" type="basic_section" size="small">
                <SkeletonList count={3} height={32} gap={12} />
            </ContentLayout>
        );
    }

    const rateItems = [
        { rate: rates?.engineeringRate || defaultRates.engineering, role: 'Engineering', estimated: client?.estimated_engineering_hours || '0' },
        { rate: rates?.architectureRate || defaultRates.architecture, role: 'Architecture', estimated: client?.estimated_architecture_hours || '0' },
        { rate: rates?.seniorArchitectureRate || defaultRates.senior_architecture, role: 'Senior architecture', estimated: client?.estimated_senior_architecture_hours || '0' },
    ];

    return (
        <ContentLayout title="Rates" type="basic_section" size="small">
            {
            client?.billing_type === "MONTHLY_PLAN" ? "The company has a monthly plan, the rates are not used" : rateItems.map(item => (
                <DashboardItem
                    key={item.role}
                    label={item.role}
                    value={`$${item.rate}/hr (${item.estimated}/hrs remaining)`}
                    showBorder={true}
                />
            ))}
        </ContentLayout>
    );
};

export default RatesSection;