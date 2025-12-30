import { Station } from '@/app/meetings/create/_models/types';

interface LocationItemProps {
  station: Station;
  searchQuery: string;
  onClick: () => void;
}

const LocationItem = ({ station, searchQuery, onClick }: LocationItemProps) => {
  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const match = text.slice(0, query.length);
    const afterMatch = text.slice(query.length);

    return (
      <>
        <span className="font-bold text-orange-500">{match}</span>
        {afterMatch}
      </>
    );
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl p-[0.625rem] text-left text-lg font-semibold transition-all duration-150 active:scale-[0.98] active:bg-orange-500/8"
    >
      {highlightText(station.name, searchQuery)}
    </button>
  );
};

export default LocationItem;
