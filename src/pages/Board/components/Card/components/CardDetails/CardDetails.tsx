import './cardDetails.scss';

interface ICardDetails {
  onClose(): void;
}
export function CardDetails({ onClose }: ICardDetails): JSX.Element {
  return (
    <div className="card-details__overlay" onClick={onClose}>
      <div className="card-details__window">cardName</div>
    </div>
  );
}
