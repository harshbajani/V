import { Canvas } from "./_components/canvas";
import { Room } from "@/components/room";
import { Loading } from "./_components/loading";

interface VisionIdPageProps {
  params: {
    visionId: string;
  };
}
const VisionIdPage = ({ params }: VisionIdPageProps) => {
  return (
    <Room roomId={params.visionId} fallback={<Loading />}>
      <Canvas visionId={params.visionId} />
    </Room>
  );
};
export default VisionIdPage;
