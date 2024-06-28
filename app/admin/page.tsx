import { isAdmin } from "@/lib/admin";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const App = dynamic(() => import("./app"), { ssr: false });

const AdminPage = () => {
  //รับค่ามาจาก lib admin.ts
  if (!isAdmin()) {
    redirect("/");
  }

  return <App />;
};
export default AdminPage;
