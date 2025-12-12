// components/work-entries/header-actions/ActiveTagsBar.tsx
import { Tag, Button, Typography } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { FilterTag } from "./types";

const { Text } = Typography;

interface Props {
    tags: FilterTag[];
    onResetAll?: () => void;
    variant: 'header' | 'modal';
}

export const ActiveTagsBar = ({ tags, onResetAll, variant }: Props) => {
    if (tags.length === 0) {
        if (variant === 'modal') {
             return (
                <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300 text-center text-gray-400 text-sm">
                   No filters selected.
                </div>
            );
        }
        return null;
    }

    if (variant === 'modal') {
        return (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                    <Text type="secondary" className="text-xs font-bold uppercase tracking-wider text-blue-800">
                        Selection Summary:
                    </Text>
                    {onResetAll && (
                        <Button 
                            type="link" size="small" danger onClick={onResetAll} 
                            style={{ padding: 0, height: 'auto' }}
                        >
                            Clear all
                        </Button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <Tag key={`modal-${tag.key}`} color={tag.color} closable onClose={tag.onRemove} className="m-0">
                            {tag.label}
                        </Tag>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 p-2 rounded-md border border-gray-100 flex flex-wrap gap-2 items-center text-sm mb-4">
            <Text type="secondary" className="mr-2 text-xs uppercase font-semibold">
                <FilterOutlined /> Active:
            </Text>
            {tags.map(tag => (
                <Tag key={tag.key} color={tag.color} closable onClose={tag.onRemove}>
                    {tag.label}
                </Tag>
            ))}
        </div>
    );
};