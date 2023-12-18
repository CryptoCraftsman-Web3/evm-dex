import PositionByTokenIdClientPage from "./client-page";

type PositionByTokenIdPageProps = {
  params: {
    'token-id': string;
  }
};

const PositionByTokenIdPage = ({ params }: PositionByTokenIdPageProps) => {
  const tokenId = params['token-id'] as string;

  return (
    <PositionByTokenIdClientPage tokenId={BigInt(tokenId)} />
  );
};

export default PositionByTokenIdPage;