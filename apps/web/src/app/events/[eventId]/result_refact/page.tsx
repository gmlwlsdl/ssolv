import ResultClient from '@/app/events/[eventId]/result_refact/_components/ResultClient';
import {
  mockRestaurantsData,
  mockSurveysData,
} from '@/app/events/[eventId]/result_refact/_mocks/results.mock';

interface RecommendationsResultPageProps {
  params: Promise<{ eventId: string }>;
}

const ResultPage = async ({ params }: RecommendationsResultPageProps) => {
  const { eventId: _eventId } = await params;

  return <ResultClient surveys={mockSurveysData} restaurants={mockRestaurantsData} />;
};

export default ResultPage;
