import React, { useEffect, useState } from "react";
import { ClientI } from "~/interfaces/clients.interface";
import ContentLayout from "~/components/layout/components/ContentLayout";
import { getRateTypeLabel, RateType } from "~/utils/general/getRateTypeLabel";
import TeamMember from "~/features/Companies/Components/TeamMember";
import SkeletonList from "~/features/Companies/Fallbacks/SkeletonList";

interface Props {
  client: ClientI;
}

const TeamMembersSection: React.FC<Props> = ({ client }) => {
  const [teamMembers, setTeamMembers] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const res = await fetch(`/api/clients/team-members/${client.id}`);
      if (res.ok) {
        const data = await res.json();
        setTeamMembers(data);
      }
    };
    fetchTeamMembers();
  }, [client.id]);

  return (
    <ContentLayout title="Team members" type="basic_section" size="small">
      {teamMembers ? (
        teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <TeamMember
              key={member.id}
              name={member.user.name}
              role={getRateTypeLabel(member.rate_type as RateType)}
              isLead={member.role === "technical_lead"}
              showBorder={true}
            />
          ))
        ) : (
          <p>There are no team members assigned yet.</p>
        )
      ) : (
        <SkeletonList count={3} height={32} gap={12} />
      )}
    </ContentLayout>
  );
};

export default TeamMembersSection;