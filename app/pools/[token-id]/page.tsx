type PositionByTokenIdPageProps = {
  params: {
    'token-id': string;
  }
};

const PositionByTokenIdPage = ({ params }: PositionByTokenIdPageProps) => {
  const tokenId = params['token-id'] as string;

  return (
    <div>
      <h1>Position by Token ID: {tokenId}</h1>
    </div>
  );
};

export default PositionByTokenIdPage;