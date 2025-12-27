import React, { useEffect, useState } from "react";
import { ClientI } from "~/features/Companies/Interfaces/clients.interface";
import ContentLayout from "~/components/layout/components/ContentLayout";
import SkeletonList from "~/features/Companies/Fallbacks/SkeletonList";
import TeamMember from "~/features/TeamMembers/Components/TeamMember";

interface Props {
  client: ClientI;
}

const ContactsSection: React.FC<Props> = ({ client }) => {
  const [contacts, setContacts] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      const res = await fetch(`/api/clients/contacts/${client.id}`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    };
    fetchContacts();
  }, [client.id]);

  return (
    <ContentLayout title="Contacts" type="basic_section" size="small">
      {contacts ? (
        contacts.length > 0 ? (
          contacts.map((contact) => (
            <TeamMember
              key={contact.id}
              name={contact.name}
              role={contact.email}
              isLead={false}
              showBorder={true}
            />
          ))
        ) : (
          <p>There are no contacts yet.</p>
        )
      ) : (
        <SkeletonList count={3} height={32} gap={12} />
      )}
    </ContentLayout>
  );
};

export default ContactsSection;