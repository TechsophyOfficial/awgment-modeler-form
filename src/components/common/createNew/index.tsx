import React from 'react';
import ActionButton from '../actionButton';

interface CreateNewProps {
    height?: number;
    width?: number;
    handleCreateNew?: () => void;
}

const CreateNew: React.FC<CreateNewProps> = ({ height, width, handleCreateNew }) => {
    const onCreateNew = () => {
        if (handleCreateNew) {
            handleCreateNew();
        }
    };

    return (
        <ActionButton variant="primary" height={height || 40} width={width || 160} onClick={onCreateNew}>
            Create New
        </ActionButton>
    );
};

export default CreateNew;
