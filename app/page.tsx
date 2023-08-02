import { constants } from "@/lib/constants";
import HomeClientPage from "./client-page";

export const metadata = {
  title: 'Home | ' + constants.appName,
};

export default function Home() {
  return (
    <>
      <HomeClientPage />
    </>
  );
}
