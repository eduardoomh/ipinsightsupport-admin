import { Tag } from "antd";
import { FC } from "react";
import {
    DollarCircleFilled,
    CreditCardFilled
} from "@ant-design/icons";

interface Props {
    isCredit: boolean;
}

const CreditDebitTag: FC<Props> = ({ isCredit }) => {
    const color = isCredit ? "green" : "blue";

    return (
        <Tag
            color={color}
            style={{
                width: 70,                 // ⭐ ANCHO REDUCIDO (aquí controlas tú)
                justifyContent: "center",  // ⭐ centra contenido
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "2px 6px",
                fontWeight: 600,
                fontSize: 12,
            }}
        >
            {isCredit ? (
                <DollarCircleFilled style={{ fontSize: 12 }} />
            ) : (
                <CreditCardFilled style={{ fontSize: 12 }} />
            )}

            {isCredit ? "Credit" : "Debit"}
        </Tag>
    );
};

export default CreditDebitTag;