import { useState } from 'react';
import './ChoiceModal.css';

interface ChoiceModalProps {
    title: string;
    description: string;
    options: Array<{
        value: string | number;
        label: string;
        description?: string;
    }>;
    onSelect: (value: string | number) => void;
    onCancel: () => void;
}

export function ChoiceModal({
    title,
    description,
    options,
    onSelect,
    onCancel,
}: ChoiceModalProps) {
    const [selectedValue, setSelectedValue] = useState<string | number | null>(null);

    const handleConfirm = () => {
        if (selectedValue !== null) {
            onSelect(selectedValue);
        }
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onCancel}>×</button>
                </div>

                <div className="modal-body">
                    <p className="modal-description">{description}</p>

                    <div className="choice-options">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                className={`choice-option ${selectedValue === option.value ? 'selected' : ''}`}
                                onClick={() => setSelectedValue(option.value)}
                            >
                                <div className="choice-option-label">{option.label}</div>
                                {option.description && (
                                    <div className="choice-option-description">{option.description}</div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleConfirm}
                        disabled={selectedValue === null}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
