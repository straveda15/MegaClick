import GenericPage from "@/components/GenericPage";
import { StaffLeavesView } from "@/components/staff/portal/StaffLeavesView";

// The leaves page is unified across all employees and staff — everyone gets the
// same staff-portal leaves UI (balance cards, filters, apply modal). Rendered
// here as a standalone route (no `onBack`, so it hides its own header and uses
// the GenericPage title instead).
const MyLeavePage = () => {
  return (
    <GenericPage
      title="My Leaves"
      subtitle="Manage your leave requests and view remaining balances."
    >
      <StaffLeavesView />
    </GenericPage>
  );
};

export default MyLeavePage;
