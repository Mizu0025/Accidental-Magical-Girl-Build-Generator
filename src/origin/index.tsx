import { Origin, OriginDescription } from '../constants/origin';
import { OriginName } from '../types/origin';
import './style.css';

const originData: Record<Origin, { label: string; description: string }> = {
  [Origin.Contract]: { label: 'Contract', description: OriginDescription.Contract },
  [Origin.Smug]: { label: 'Smug', description: OriginDescription.Smug },
  [Origin.Weapon]: { label: 'Weapon', description: OriginDescription.Weapon },
  [Origin.Bloodline]: { label: 'Bloodline', description: OriginDescription.Bloodline },
  [Origin.Emergency]: { label: 'Emergency', description: OriginDescription.Emergency },
  [Origin.Artifact]: { label: 'Artifact', description: OriginDescription.Artifact },
  [Origin.Death]: { label: 'Death', description: OriginDescription.Death },
};

const GenerateOrigin = ({ onSelect }: { onSelect: (value: OriginName) => void }) => {
  return (
    <div className="origin-buttons">
      {Object.entries(originData).map(([name, data]) => (
        <div key={name} className="origin-item">
          <input
            className="origin-radio"
            type="radio"
            id={name}
            name="origin"
            value={name}
            onChange={() => onSelect(name as OriginName)}
          />
          <label className="origin-button-label" htmlFor={name} data-tooltip={data.description}>{data.label}</label>
        </div>
      ))}
    </div>
  );
};

export default GenerateOrigin;
