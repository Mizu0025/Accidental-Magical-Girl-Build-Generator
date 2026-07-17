import { Origin, OriginDescription } from '../constants/origin';

const originData: Record<Origin, { label: string; description: string }> = {
  [Origin.Contract]: { label: 'Contract', description: OriginDescription.Contract },
  [Origin.Smug]: { label: 'Smug', description: OriginDescription.Smug },
  [Origin.Weapon]: { label: 'Weapon', description: OriginDescription.Weapon },
  [Origin.Bloodline]: { label: 'Bloodline', description: OriginDescription.Bloodline },
  [Origin.Emergency]: { label: 'Emergency', description: OriginDescription.Emergency },
  [Origin.Artifact]: { label: 'Artifact', description: OriginDescription.Artifact },
  [Origin.Death]: { label: 'Death', description: OriginDescription.Death },
};

const GenerateOrigin = () => {
  return (
    <div>
      {Object.entries(originData).map(([name, data]) => (
        <div key={name}>
          <input type="radio" id={name} name="origin" value={name} />
          <label htmlFor={name}>{data.label}</label>
          <p>{data.description}</p>
        </div>
      ))}
    </div>
  );
};

export default GenerateOrigin;
