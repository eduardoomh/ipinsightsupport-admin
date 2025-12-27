import { FC } from "react";

interface Props {
    value: any;
    label: string;
    showBorder?: boolean;
}

const DashboardItem: FC<Props> = ({ value, label, showBorder }) => {
    return (
        <section
            style={
                showBorder ? {
                    borderBottom: "1px solid #E2E1E1",
                    padding: "0 0 12px 0",
                    marginBottom: "12px"
                } : {
                    padding: "0 0 12px 0",
                    marginBottom: "12px"
                }
            }>
            <p style={{ color: "#014A64" }}><strong>{label}</strong></p>
            <p>{value}</p>
        </section>
    )
}

export default DashboardItem